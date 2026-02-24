import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type AppId = bigint;
export type OrgId = bigint;
export type Time = bigint;
export interface ActivityLog {
    id: AppId;
    appId: AppId;
    orgId: OrgId;
    metadata: string;
    user: Principal;
    timestamp: Time;
    eventType: string;
}
export interface ForumReply {
    content: string;
    author: Principal;
    timestamp: Time;
}
export interface PricingPlan {
    id: OrgId;
    features: Array<string>;
    isPublished: boolean;
    name: string;
    lastUpdated: Time;
    description: string;
    category: string;
    price: bigint;
}
export interface InteropContext {
    userRole?: UserRole;
    activeOrg?: OrgId;
    caller: Principal;
    authenticated: boolean;
    profile?: UserProfile;
}
export interface Message {
    content: string;
    sender: Principal;
    timestamp: Time;
}
export interface SocialPost {
    id: bigint;
    content: string;
    orgId: OrgId;
    author: Principal;
    timestamp: Time;
}
export interface Vendor {
    id: VendorId;
    contactInfo: string;
    orgId: OrgId;
    name: string;
    createdAt: Time;
    description: string;
    isActive: boolean;
}
export type VendorId = bigint;
export interface UserProfile {
    name: string;
    email: string;
    activeOrgId?: OrgId;
}
export enum UserRole {
    admin = "admin",
    owner = "owner",
    user = "user"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMessage(conversationId: bigint, content: string): Promise<void>;
    addReply(topicId: bigint, content: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    createConversation(orgId: OrgId, participants: Array<Principal>): Promise<bigint>;
    createOrganization(name: string, callerEmail: string): Promise<OrgId>;
    createPlan(name: string, description: string, price: bigint, features: Array<string>, category: string): Promise<OrgId>;
    createPost(orgId: OrgId, content: string): Promise<bigint>;
    createTopic(orgId: OrgId, title: string, content: string): Promise<bigint>;
    createVendor(orgId: OrgId, name: string, description: string, contactInfo: string): Promise<VendorId>;
    deactivateVendor(vendorId: VendorId): Promise<void>;
    deleteOrganization(orgId: OrgId): Promise<void>;
    getActiveVendors(orgId: OrgId): Promise<Array<Vendor>>;
    getActivityLogs(): Promise<Array<ActivityLog>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getConversation(conversationId: bigint): Promise<{
        id: bigint;
        participants: Array<Principal>;
        messages: Array<Message>;
        orgId: OrgId;
    } | null>;
    getDashboardMetrics(): Promise<[bigint, bigint, bigint, bigint]>;
    getInteropContext(): Promise<InteropContext>;
    getOrgPosts(orgId: OrgId): Promise<Array<SocialPost>>;
    getOrgTopics(orgId: OrgId): Promise<Array<{
        id: bigint;
        title: string;
        content: string;
        orgId: OrgId;
        author: Principal;
        timestamp: Time;
        replies: Array<ForumReply>;
    }>>;
    getOrganization(orgId: OrgId): Promise<{
        id: OrgId;
        members: Array<Principal>;
        vendors: Array<VendorId>;
        owner: Principal;
        name: string;
        createdAt: Time;
        admins: Array<Principal>;
    }>;
    getPost(postId: bigint): Promise<SocialPost | null>;
    getPublishedPlans(): Promise<Array<PricingPlan>>;
    getTopic(topicId: bigint): Promise<{
        id: bigint;
        title: string;
        content: string;
        orgId: OrgId;
        author: Principal;
        timestamp: Time;
        replies: Array<ForumReply>;
    } | null>;
    getUserConversations(orgId: OrgId): Promise<Array<{
        id: bigint;
        participants: Array<Principal>;
        messages: Array<Message>;
        orgId: OrgId;
    }>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserRole(orgId: OrgId, user: Principal): Promise<UserRole>;
    getVendor(vendorId: VendorId): Promise<Vendor>;
    isCallerAdmin(): Promise<boolean>;
    joinOrganization(orgId: OrgId): Promise<void>;
    listOrganizations(): Promise<Array<{
        id: OrgId;
        members: Array<Principal>;
        vendors: Array<VendorId>;
        owner: Principal;
        name: string;
        createdAt: Time;
        admins: Array<Principal>;
    }>>;
    listPlans(): Promise<Array<PricingPlan>>;
    listVendors(): Promise<Array<Vendor>>;
    logActivity(orgId: OrgId, appId: AppId, eventType: string, metadata: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
