import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, PricingPlan, Vendor, ActivityLog, SocialPost, Message, ForumReply } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['interopContext'] });
    },
  });
}

export function useListOrganizations() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listOrganizations();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateOrganization() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, email }: { name: string; email: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrganization(name, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['interopContext'] });
    },
  });
}

export function useJoinOrganization() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orgId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.joinOrganization(orgId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['interopContext'] });
    },
  });
}

export function useGetOrganization(orgId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['organization', orgId?.toString()],
    queryFn: async () => {
      if (!actor || !orgId) return null;
      return actor.getOrganization(orgId);
    },
    enabled: !!actor && !actorFetching && !!orgId,
  });
}

export function useGetUserRole(orgId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['userRole', orgId?.toString(), identity?.getPrincipal().toString() || 'anonymous'],
    queryFn: async () => {
      if (!actor || !orgId || !identity) return null;
      const userPrincipal = identity.getPrincipal();
      return actor.getUserRole(orgId, userPrincipal);
    },
    enabled: !!actor && !actorFetching && !!orgId && !!identity,
    retry: false,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetPublishedPlans() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PricingPlan[]>({
    queryKey: ['publishedPlans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedPlans();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useListPlans() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PricingPlan[]>({
    queryKey: ['allPlans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPlans();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreatePlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: {
      name: string;
      description: string;
      price: bigint;
      features: string[];
      category: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPlan(plan.name, plan.description, plan.price, plan.features, plan.category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPlans'] });
      queryClient.invalidateQueries({ queryKey: ['publishedPlans'] });
    },
  });
}

export function useGetActiveVendors(orgId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Vendor[]>({
    queryKey: ['activeVendors', orgId?.toString()],
    queryFn: async () => {
      if (!actor || !orgId) return [];
      return actor.getActiveVendors(orgId);
    },
    enabled: !!actor && !actorFetching && !!orgId,
  });
}

export function useListVendors() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Vendor[]>({
    queryKey: ['vendors'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVendors();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vendor: {
      orgId: bigint;
      name: string;
      description: string;
      contactInfo: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createVendor(vendor.orgId, vendor.name, vendor.description, vendor.contactInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['activeVendors'] });
    },
  });
}

export function useDeactivateVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vendorId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deactivateVendor(vendorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['activeVendors'] });
    },
  });
}

export function useLogActivity() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (activity: {
      orgId: bigint;
      appId: bigint;
      eventType: string;
      metadata: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logActivity(activity.orgId, activity.appId, activity.eventType, activity.metadata);
    },
  });
}

export function useGetDashboardMetrics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<[bigint, bigint, bigint, bigint]>({
    queryKey: ['dashboardMetrics'],
    queryFn: async () => {
      if (!actor) return [BigInt(0), BigInt(0), BigInt(0), BigInt(0)];
      return actor.getDashboardMetrics();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetActivityLogs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ActivityLog[]>({
    queryKey: ['activityLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActivityLogs();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Social Feed Hooks
export function useSocialPosts(orgId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SocialPost[]>({
    queryKey: ['socialPosts', orgId?.toString()],
    queryFn: async () => {
      if (!actor || !orgId) return [];
      return actor.getOrgPosts(orgId);
    },
    enabled: !!actor && !actorFetching && !!orgId,
    refetchInterval: 60000, // 60 seconds
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orgId, content }: { orgId: bigint; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(orgId, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['socialPosts', variables.orgId.toString()] });
    },
  });
}

export function useGetUserProfile(principal: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', principal],
    queryFn: async () => {
      if (!actor || !principal) return null;
      // Convert string to Principal
      const { Principal } = await import('@dfinity/principal');
      const userPrincipal = Principal.fromText(principal);
      return actor.getUserProfile(userPrincipal);
    },
    enabled: !!actor && !actorFetching && !!principal,
  });
}

// Messaging Hooks
export function useConversations(orgId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<{
    id: bigint;
    participants: Array<any>;
    messages: Array<Message>;
    orgId: bigint;
  }>>({
    queryKey: ['conversations', orgId?.toString()],
    queryFn: async () => {
      if (!actor || !orgId) return [];
      return actor.getUserConversations(orgId);
    },
    enabled: !!actor && !actorFetching && !!orgId,
    refetchInterval: 30000, // 30 seconds
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
}

export function useCreateConversation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orgId, participants }: { orgId: bigint; participants: Array<any> }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createConversation(orgId, participants);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', variables.orgId.toString()] });
    },
  });
}

export function useAddMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, content, orgId }: { conversationId: bigint; content: string; orgId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMessage(conversationId, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', variables.orgId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['conversation', variables.conversationId.toString()] });
    },
  });
}

export function useGetConversation(conversationId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{
    id: bigint;
    participants: Array<any>;
    messages: Array<Message>;
    orgId: bigint;
  } | null>({
    queryKey: ['conversation', conversationId?.toString()],
    queryFn: async () => {
      if (!actor || !conversationId) return null;
      return actor.getConversation(conversationId);
    },
    enabled: !!actor && !actorFetching && !!conversationId,
  });
}

// Forum Hooks
export function useForumTopics(orgId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<{
    id: bigint;
    title: string;
    content: string;
    orgId: bigint;
    author: any;
    timestamp: bigint;
    replies: Array<ForumReply>;
  }>>({
    queryKey: ['forumTopics', orgId?.toString()],
    queryFn: async () => {
      if (!actor || !orgId) return [];
      return actor.getOrgTopics(orgId);
    },
    enabled: !!actor && !actorFetching && !!orgId,
    refetchInterval: 60000, // 60 seconds
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
}

export function useCreateTopic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orgId, title, content }: { orgId: bigint; title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTopic(orgId, title, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forumTopics', variables.orgId.toString()] });
    },
  });
}

export function useAddReply() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ topicId, content, orgId }: { topicId: bigint; content: string; orgId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addReply(topicId, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forumTopics', variables.orgId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['forumTopic', variables.topicId.toString()] });
    },
  });
}

export function useGetTopic(topicId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{
    id: bigint;
    title: string;
    content: string;
    orgId: bigint;
    author: any;
    timestamp: bigint;
    replies: Array<ForumReply>;
  } | null>({
    queryKey: ['forumTopic', topicId?.toString()],
    queryFn: async () => {
      if (!actor || !topicId) return null;
      return actor.getTopic(topicId);
    },
    enabled: !!actor && !actorFetching && !!topicId,
  });
}
