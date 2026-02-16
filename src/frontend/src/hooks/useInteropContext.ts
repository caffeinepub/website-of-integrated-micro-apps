import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { useLogActivity } from './useQueries';
import type { InteropContext } from '../backend';

/**
 * Hook to fetch the interoperability context from the backend.
 * This provides a single source of truth for user profile, active org, and role.
 */
export function useInteropContext() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<InteropContext | null>({
    queryKey: ['interopContext', identity?.getPrincipal().toString() || 'anonymous'],
    queryFn: async () => {
      if (!actor || !identity) return null;
      return actor.getInteropContext();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

/**
 * Hook to log activity using the active organization context.
 * Automatically uses the active org from interop context, or defaults to orgId=0.
 */
export function useLogActivityWithContext() {
  const { data: context } = useInteropContext();
  const logActivity = useLogActivity();

  const logWithContext = (params: {
    appId: bigint;
    eventType: string;
    metadata: string;
  }) => {
    const orgId = context?.activeOrg ?? BigInt(0);
    logActivity.mutate({
      orgId,
      appId: params.appId,
      eventType: params.eventType,
      metadata: params.metadata,
    });
  };

  return {
    mutate: logWithContext,
    isLoading: logActivity.isPending,
    isError: logActivity.isError,
    error: logActivity.error,
  };
}
