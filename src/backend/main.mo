import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type OrgId = Nat;
  public type VendorId = Nat;
  public type AppId = Nat;

  public type Organization = {
    id : OrgId;
    name : Text;
    owner : Principal;
    createdAt : Time.Time;
    members : List.List<Principal>;
    admins : List.List<Principal>;
    vendors : List.List<VendorId>;
  };

  public type Vendor = {
    id : VendorId;
    orgId : OrgId;
    name : Text;
    description : Text;
    contactInfo : Text;
    isActive : Bool;
    createdAt : Time.Time;
  };

  public type PricingPlan = {
    id : OrgId;
    name : Text;
    description : Text;
    price : Nat;
    features : [Text];
    category : Text;
    isPublished : Bool;
    lastUpdated : Time.Time;
  };

  public type UserRole = {
    #owner;
    #admin;
    #user;
  };

  public type ActivityLog = {
    id : AppId;
    orgId : OrgId;
    appId : AppId;
    user : Principal;
    eventType : Text;
    timestamp : Time.Time;
    metadata : Text;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    activeOrgId : ?OrgId;
  };

  public type InteropContext = {
    authenticated : Bool;
    caller : Principal;
    profile : ?UserProfile;
    activeOrg : ?OrgId;
    userRole : ?UserRole;
  };

  // New Types for Micro-Apps
  public type SocialPost = {
    id : Nat;
    orgId : OrgId;
    author : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  public type Message = {
    sender : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  public type Conversation = {
    id : Nat;
    orgId : OrgId;
    participants : List.List<Principal>;
    messages : List.List<Message>;
  };

  public type ForumTopic = {
    id : Nat;
    orgId : OrgId;
    title : Text;
    author : Principal;
    content : Text;
    replies : List.List<ForumReply>;
    timestamp : Time.Time;
  };

  public type ForumReply = {
    author : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  let organizations = Map.empty<OrgId, Organization>();
  let vendors = Map.empty<VendorId, Vendor>();
  let pricingPlans = Map.empty<OrgId, PricingPlan>();
  let activityLogs = Map.empty<Nat, ActivityLog>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextOrgId = 1;
  var nextVendorId = 1;
  var nextPlanId = 1;
  var nextLogId = 1;

  // Micro-App Data
  let socialFeedPosts = Map.empty<Nat, SocialPost>();
  let conversations = Map.empty<Nat, Conversation>();
  let forumTopics = Map.empty<Nat, ForumTopic>();
  var nextPostId = 1;
  var nextConversationId = 1;
  var nextTopicId = 1;

  // Helper function to check if user is owner of an organization
  private func isOrgOwner(caller : Principal, orgId : OrgId) : Bool {
    switch (organizations.get(orgId)) {
      case (null) { false };
      case (?org) { org.owner == caller };
    };
  };

  // Helper function to check if user is admin of an organization
  private func isOrgAdmin(caller : Principal, orgId : OrgId) : Bool {
    switch (organizations.get(orgId)) {
      case (null) { false };
      case (?org) {
        org.admins.find(func(admin : Principal) : Bool { admin == caller }) != null;
      };
    };
  };

  // Helper function to check if user is member of an organization
  private func isOrgMember(caller : Principal, orgId : OrgId) : Bool {
    switch (organizations.get(orgId)) {
      case (null) { false };
      case (?org) {
        org.members.find(func(member : Principal) : Bool { member == caller }) != null;
      };
    };
  };

  // Interoperability
  public query ({ caller }) func getInteropContext() : async InteropContext {
    let callerProfile = userProfiles.get(caller);
    let activeOrg = switch (callerProfile) {
      case (null) { null };
      case (?p) { p.activeOrgId };
    };
    let userRole = switch (activeOrg) {
      case (null) { null };
      case (?orgId) {
        if (isOrgOwner(caller, orgId)) {
          ?#owner;
        } else if (isOrgAdmin(caller, orgId)) {
          ?#admin;
        } else if (isOrgMember(caller, orgId)) {
          ?#user;
        } else { null };
      };
    };
    {
      authenticated = true;
      caller;
      profile = callerProfile;
      activeOrg;
      userRole;
    };
  };

  // User Profile Management (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Organization Management
  public shared ({ caller }) func createOrganization(name : Text, callerEmail : Text) : async OrgId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create organizations");
    };

    if (name.size() <= 0) { Runtime.trap("Organization name cannot be empty.") };

    let orgId = nextOrgId;
    nextOrgId += 1;

    let org : Organization = {
      id = orgId;
      name;
      owner = caller;
      createdAt = Time.now();
      members = List.fromArray([caller]);
      admins = List.empty<Principal>();
      vendors = List.empty<VendorId>();
    };
    organizations.add(orgId, org);

    let welcomePlan : PricingPlan = {
      id = orgId;
      name = name # " Welcome Plan";
      description = "Special introductory offer for new organizations on Arkly Portal.";
      price = 0;
      features = ["Free access to core features for 30 days", "Onboarding support", "Unlimited users"];
      category = "general";
      isPublished = true;
      lastUpdated = Time.now();
    };
    pricingPlans.add(orgId, welcomePlan);

    let log : ActivityLog = {
      id = nextLogId;
      orgId;
      appId = 0;
      user = caller;
      eventType = "CreateOrganization";
      timestamp = Time.now();
      metadata = "Org name: " # name # ", Email: " # callerEmail;
    };
    activityLogs.add(nextLogId, log);
    nextLogId += 1;

    orgId;
  };

  public query ({ caller }) func getOrganization(orgId : OrgId) : async {
    id : OrgId;
    name : Text;
    owner : Principal;
    createdAt : Time.Time;
    members : [Principal];
    admins : [Principal];
    vendors : [VendorId];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view organizations");
    };

    if (not isOrgMember(caller, orgId)) {
      Runtime.trap("Unauthorized: You must be a member of this organization");
    };

    switch (organizations.get(orgId)) {
      case (null) { Runtime.trap("Organization not found") };
      case (?org) {
        {
          id = org.id;
          name = org.name;
          owner = org.owner;
          createdAt = org.createdAt;
          members = org.members.toArray();
          admins = org.admins.toArray();
          vendors = org.vendors.toArray();
        };
      };
    };
  };

  public query ({ caller }) func listOrganizations() : async [{
    id : OrgId;
    name : Text;
    owner : Principal;
    createdAt : Time.Time;
    members : [Principal];
    admins : [Principal];
    vendors : [VendorId];
  }] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can list organizations");
    };

    let allOrgs = organizations.values().toArray();
    let filteredOrgs = allOrgs.filter(func(org) { isOrgMember(caller, org.id) });
    filteredOrgs.map(func(org) { 
      {
        id = org.id;
        name = org.name;
        owner = org.owner;
        createdAt = org.createdAt;
        members = org.members.toArray();
        admins = org.admins.toArray();
        vendors = org.vendors.toArray();
      }
    });
  };

  public shared ({ caller }) func joinOrganization(orgId : OrgId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can join organizations");
    };

    if (not organizations.containsKey(orgId)) { Runtime.trap("Organization does not exist") };
    
    let org = switch (organizations.get(orgId)) {
      case (null) { Runtime.trap("Organization does not exist") };
      case (?o) { o };
    };

    if (org.members.find(func(member : Principal) : Bool { member == caller }) != null) {
      Runtime.trap("You are already a member of this organization");
    };

    let updatedMembers = List.fromArray(org.members.toArray().concat([caller]));
    let updatedOrg = {
      org with members = updatedMembers;
    };
    organizations.add(orgId, updatedOrg);

    let log : ActivityLog = {
      id = nextLogId;
      orgId;
      appId = 0;
      user = caller;
      eventType = "JoinOrganization";
      timestamp = Time.now();
      metadata = "Org name: " # org.name;
    };
    activityLogs.add(nextLogId, log);
    nextLogId += 1;
  };

  public shared ({ caller }) func deleteOrganization(orgId : OrgId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete organizations");
    };

    if (not isOrgOwner(caller, orgId)) {
      Runtime.trap("Unauthorized: Only the organization owner can delete it");
    };

    if (not organizations.containsKey(orgId)) { Runtime.trap("Organization does not exist") };
    organizations.remove(orgId);

    let log : ActivityLog = {
      id = nextLogId;
      orgId;
      appId = 0;
      user = caller;
      eventType = "DeleteOrganization";
      timestamp = Time.now();
      metadata = "Deleted organization with ID: " # orgId.toText();
    };
    activityLogs.add(nextLogId, log);
    nextLogId += 1;
  };

  // Vendor Management
  public shared ({ caller }) func createVendor(orgId : OrgId, name : Text, description : Text, contactInfo : Text) : async VendorId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create vendors");
    };

    if (not (isOrgOwner(caller, orgId) or isOrgAdmin(caller, orgId))) {
      Runtime.trap("Unauthorized: Only organization owners or admins can create vendors");
    };

    let vendorId = nextVendorId;
    nextVendorId += 1;

    let vendor : Vendor = {
      id = vendorId;
      orgId;
      name;
      description;
      contactInfo;
      isActive = true;
      createdAt = Time.now();
    };
    vendors.add(vendorId, vendor);

    let log : ActivityLog = {
      id = nextLogId;
      orgId;
      appId = 0;
      user = caller;
      eventType = "CreateVendor";
      timestamp = Time.now();
      metadata = "Vendor name: " # name;
    };
    activityLogs.add(nextLogId, log);
    nextLogId += 1;

    vendorId;
  };

  public query ({ caller }) func getVendor(vendorId : VendorId) : async Vendor {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view vendors");
    };

    switch (vendors.get(vendorId)) {
      case (null) { Runtime.trap("Vendor not found") };
      case (?vendor) {
        if (not isOrgMember(caller, vendor.orgId)) {
          Runtime.trap("Unauthorized: You must be a member of the vendor's organization");
        };
        vendor;
      };
    };
  };

  public query ({ caller }) func listVendors() : async [Vendor] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can list vendors");
    };

    let allVendors = vendors.values().toArray();
    allVendors.filter<Vendor>(func(vendor : Vendor) : Bool {
      isOrgMember(caller, vendor.orgId);
    });
  };

  public query ({ caller }) func getActiveVendors(orgId : OrgId) : async [Vendor] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view vendors");
    };

    if (not isOrgMember(caller, orgId)) {
      Runtime.trap("Unauthorized: You must be a member of this organization");
    };

    let allVendors = vendors.values().toArray();
    allVendors.filter<Vendor>(func(v : Vendor) : Bool { 
      v.orgId == orgId and v.isActive 
    });
  };

  public shared ({ caller }) func deactivateVendor(vendorId : VendorId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can deactivate vendors");
    };

    if (not vendors.containsKey(vendorId)) { Runtime.trap("Vendor does not exist") };
    
    let vendor = switch (vendors.get(vendorId)) {
      case (null) { Runtime.trap("Vendor does not exist") };
      case (?v) { v };
    };

    if (not (isOrgOwner(caller, vendor.orgId) or isOrgAdmin(caller, vendor.orgId))) {
      Runtime.trap("Unauthorized: Only organization owners or admins can deactivate vendors");
    };

    let updatedVendor = { vendor with isActive = false };
    vendors.add(vendorId, updatedVendor);

    let log : ActivityLog = {
      id = nextLogId;
      orgId = vendor.orgId;
      appId = 0;
      user = caller;
      eventType = "DeactivateVendor";
      timestamp = Time.now();
      metadata = "Vendor name: " # vendor.name;
    };
    activityLogs.add(nextLogId, log);
    nextLogId += 1;
  };

  // Pricing Plan Management
  public shared ({ caller }) func createPlan(name : Text, description : Text, price : Nat, features : [Text], category : Text) : async OrgId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create pricing plans");
    };

    let planId = nextPlanId;
    nextPlanId += 1;

    let plan : PricingPlan = {
      id = planId;
      name;
      description;
      price;
      features;
      category;
      isPublished = true;
      lastUpdated = Time.now();
    };
    pricingPlans.add(planId, plan);

    let log : ActivityLog = {
      id = nextLogId;
      orgId = 0;
      appId = 0;
      user = caller;
      eventType = "CreatePricingPlan";
      timestamp = Time.now();
      metadata = "Plan name: " # name;
    };
    activityLogs.add(nextLogId, log);
    nextLogId += 1;

    planId;
  };

  public query ({ caller }) func listPlans() : async [PricingPlan] {
    // Any authenticated user can view all plans
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view pricing plans");
    };
    pricingPlans.values().toArray();
  };

  public query ({ caller }) func getPublishedPlans() : async [PricingPlan] {
    // Any authenticated user can view published plans
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view pricing plans");
    };
    let allPlans = pricingPlans.values().toArray();
    allPlans.filter<PricingPlan>(func(p : PricingPlan) : Bool { p.isPublished });
  };

  // Activity Logging
  public shared ({ caller }) func logActivity(orgId : OrgId, appId : AppId, eventType : Text, metadata : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can log activity");
    };

    if (orgId != 0 and not isOrgMember(caller, orgId)) {
      Runtime.trap("Unauthorized: You must be a member of this organization to log activity");
    };

    let log : ActivityLog = {
      id = nextLogId;
      orgId;
      appId;
      user = caller;
      eventType;
      timestamp = Time.now();
      metadata;
    };
    activityLogs.add(nextLogId, log);
    nextLogId += 1;
  };

  public query ({ caller }) func getActivityLogs() : async [ActivityLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all activity logs");
    };
    activityLogs.values().toArray();
  };

  // Role Management
  public query ({ caller }) func getUserRole(orgId : OrgId, user : Principal) : async UserRole {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check roles");
    };

    if (not isOrgMember(caller, orgId) and caller != user) {
      Runtime.trap("Unauthorized: You must be a member of this organization");
    };

    switch (organizations.get(orgId)) {
      case (null) { Runtime.trap("Organization does not exist") };
      case (?org) {
        if (org.owner == user) { 
          #owner 
        } else if (org.admins.find(func(admin : Principal) : Bool { admin == user }) != null) { 
          #admin 
        } else { 
          #user 
        };
      };
    };
  };

  // Dashboard Metrics (Admin/Owner only)
  public shared ({ caller }) func getDashboardMetrics() : async (Nat, Nat, Nat, Nat) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view dashboard metrics");
    };

    let orgCount = organizations.size();
    let vendorCount = vendors.size();
    let planCount = pricingPlans.size();
    let activityCount = activityLogs.size();
    (orgCount, vendorCount, planCount, activityCount);
  };

  // Social Feed Methods
  public shared ({ caller }) func createPost(orgId : OrgId, content : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create posts");
    };

    if (not isOrgMember(caller, orgId)) {
      Runtime.trap("Unauthorized: You must be a member of this organization to create posts");
    };

    let postId = nextPostId;
    nextPostId += 1;

    let post : SocialPost = {
      id = postId;
      orgId;
      author = caller;
      content;
      timestamp = Time.now();
    };

    socialFeedPosts.add(postId, post);
    postId;
  };

  public query ({ caller }) func getOrgPosts(orgId : OrgId) : async [SocialPost] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view posts");
    };

    if (not isOrgMember(caller, orgId)) {
      Runtime.trap("Unauthorized: You must be a member of this organization to view posts");
    };

    let allPosts = socialFeedPosts.values().toArray();
    allPosts.filter(func(post) { post.orgId == orgId });
  };

  public query ({ caller }) func getPost(postId : Nat) : async ?SocialPost {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view posts");
    };

    switch (socialFeedPosts.get(postId)) {
      case (null) { null };
      case (?post) {
        if (not isOrgMember(caller, post.orgId)) {
          Runtime.trap("Unauthorized: You must be a member of this organization to view this post");
        };
        ?post;
      };
    };
  };

  // Messaging Methods
  public shared ({ caller }) func createConversation(orgId : OrgId, participants : [Principal]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create conversations");
    };

    if (not isOrgMember(caller, orgId)) {
      Runtime.trap("Unauthorized: You must be a member of this organization to create conversations");
    };

    // Verify all participants are members of the organization
    for (participant in participants.vals()) {
      if (not isOrgMember(participant, orgId)) {
        Runtime.trap("Unauthorized: All participants must be members of this organization");
      };
    };

    let conversationId = nextConversationId;
    nextConversationId += 1;

    let convo : Conversation = {
      id = conversationId;
      orgId;
      participants = List.fromArray(participants);
      messages = List.empty<Message>();
    };

    conversations.add(conversationId, convo);
    conversationId;
  };

  public shared ({ caller }) func addMessage(conversationId : Nat, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can send messages");
    };

    switch (conversations.get(conversationId)) {
      case (null) { Runtime.trap("Conversation not found") };
      case (?convo) {
        if (convo.participants.find(func(p) { p == caller }) == null) {
          Runtime.trap("Unauthorized: You must be a participant to send messages");
        };

        let message : Message = {
          sender = caller;
          content;
          timestamp = Time.now();
        };

        let updatedMessages = List.fromArray<Message>((convo.messages.toArray()).concat([message]));
        let updatedConvo = {
          convo with messages = updatedMessages;
        };
        conversations.add(conversationId, updatedConvo);
      };
    };
  };

  public query ({ caller }) func getConversation(conversationId : Nat) : async ?{
    id : Nat;
    orgId : OrgId;
    participants : [Principal];
    messages : [Message];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view conversations");
    };

    switch (conversations.get(conversationId)) {
      case (null) { null };
      case (?convo) {
        if (convo.participants.find(func(p) { p == caller }) == null) {
          Runtime.trap("Unauthorized: You must be a participant to view this conversation");
        };
        ?{
          id = convo.id;
          orgId = convo.orgId;
          participants = convo.participants.toArray();
          messages = convo.messages.toArray();
        };
      };
    };
  };

  public query ({ caller }) func getUserConversations(orgId : OrgId) : async [{
    id : Nat;
    orgId : OrgId;
    participants : [Principal];
    messages : [Message];
  }] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view conversations");
    };

    if (not isOrgMember(caller, orgId)) {
      Runtime.trap("Unauthorized: You must be a member of this organization");
    };

    let allConvos = conversations.values().toArray();
    let userConvos = allConvos.filter(func(convo) { 
      convo.orgId == orgId and convo.participants.find(func(p) { p == caller }) != null
    });
    
    userConvos.map(func(convo) {
      {
        id = convo.id;
        orgId = convo.orgId;
        participants = convo.participants.toArray();
        messages = convo.messages.toArray();
      }
    });
  };

  // Forum Methods
  public shared ({ caller }) func createTopic(orgId : OrgId, title : Text, content : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create topics");
    };

    if (not isOrgMember(caller, orgId)) {
      Runtime.trap("Unauthorized: You must be a member of this organization to create topics");
    };

    let topicId = nextTopicId;
    nextTopicId += 1;

    let topic : ForumTopic = {
      id = topicId;
      orgId;
      title;
      author = caller;
      content;
      replies = List.empty<ForumReply>();
      timestamp = Time.now();
    };

    forumTopics.add(topicId, topic);
    topicId;
  };

  public shared ({ caller }) func addReply(topicId : Nat, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can reply to topics");
    };

    switch (forumTopics.get(topicId)) {
      case (null) { Runtime.trap("Topic not found") };
      case (?topic) {
        if (not isOrgMember(caller, topic.orgId)) {
          Runtime.trap("Unauthorized: You must be a member of this organization to reply");
        };

        let reply : ForumReply = {
          author = caller;
          content;
          timestamp = Time.now();
        };

        let updatedReplies = List.fromArray<ForumReply>((topic.replies.toArray()).concat([reply]));
        let updatedTopic = {
          topic with replies = updatedReplies;
        };
        forumTopics.add(topicId, updatedTopic);
      };
    };
  };

  public query ({ caller }) func getTopic(topicId : Nat) : async ?{
    id : Nat;
    orgId : OrgId;
    title : Text;
    author : Principal;
    content : Text;
    replies : [ForumReply];
    timestamp : Time.Time;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view topics");
    };

    switch (forumTopics.get(topicId)) {
      case (null) { null };
      case (?topic) {
        if (not isOrgMember(caller, topic.orgId)) {
          Runtime.trap("Unauthorized: You must be a member of this organization to view this topic");
        };
        ?{
          id = topic.id;
          orgId = topic.orgId;
          title = topic.title;
          author = topic.author;
          content = topic.content;
          replies = topic.replies.toArray();
          timestamp = topic.timestamp;
        };
      };
    };
  };

  public query ({ caller }) func getOrgTopics(orgId : OrgId) : async [{
    id : Nat;
    orgId : OrgId;
    title : Text;
    author : Principal;
    content : Text;
    replies : [ForumReply];
    timestamp : Time.Time;
  }] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view topics");
    };

    if (not isOrgMember(caller, orgId)) {
      Runtime.trap("Unauthorized: You must be a member of this organization to view topics");
    };

    let allTopics = forumTopics.values().toArray();
    let orgTopics = allTopics.filter(func(topic) { topic.orgId == orgId });
    
    orgTopics.map(func(topic) {
      {
        id = topic.id;
        orgId = topic.orgId;
        title = topic.title;
        author = topic.author;
        content = topic.content;
        replies = topic.replies.toArray();
        timestamp = topic.timestamp;
      }
    });
  };
};

