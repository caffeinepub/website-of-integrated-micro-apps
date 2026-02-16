import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, PricingPlan, Vendor, ActivityLog } from '../backend';

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

  return useQuery({
    queryKey: ['userRole', orgId?.toString()],
    queryFn: async () => {
      if (!actor || !orgId) return null;
      const identity = await actor.getCallerUserProfile();
      if (!identity) return null;
      return actor.getUserRole(orgId, identity as any);
    },
    enabled: !!actor && !actorFetching && !!orgId,
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
