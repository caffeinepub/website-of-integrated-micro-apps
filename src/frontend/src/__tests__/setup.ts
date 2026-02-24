import { beforeEach, vi } from 'vitest';
import { Principal } from '@dfinity/principal';
import { UserRole } from '../backend';
import type { InteropContext, UserProfile } from '../backend';

// Mock actor factory
export function createMockActor(config?: {
  authenticated?: boolean;
  profile?: UserProfile | null;
  activeOrg?: bigint | null;
  userRole?: UserRole | null;
  organizations?: Array<{ id: bigint; members: Principal[] }>;
}) {
  const {
    authenticated = true,
    profile = null,
    activeOrg = null,
    userRole = null,
    organizations = [],
  } = config || {};

  return {
    getInteropContext: vi.fn(async (): Promise<InteropContext> => {
      return {
        authenticated,
        caller: Principal.fromText('2vxsx-fae'),
        profile: profile || undefined,
        activeOrg: activeOrg || undefined,
        userRole: userRole || undefined,
      };
    }),
    getUserRole: vi.fn(async (orgId: bigint, user: Principal): Promise<UserRole> => {
      // Check if user is member of the organization
      const org = organizations.find((o) => o.id === orgId);
      if (!org || !org.members.some((m) => m.toString() === user.toString())) {
        throw new Error('Unauthorized: You must be a member of this organization');
      }
      return userRole || UserRole.user;
    }),
    logActivity: vi.fn(async (orgId: bigint, appId: bigint, eventType: string, metadata: string): Promise<void> => {
      if (!authenticated) {
        throw new Error('Unauthorized: Only authenticated users can log activity');
      }
      // Check if user is member of the organization
      if (orgId !== BigInt(0)) {
        const org = organizations.find((o) => o.id === orgId);
        if (!org) {
          throw new Error('Unauthorized: You must be a member of this organization to log activity');
        }
      }
    }),
  };
}

// Test fixtures
export const mockUserProfile: UserProfile = {
  name: 'Test User',
  email: 'test@example.com',
  activeOrgId: BigInt(1),
};

export const mockUserProfileNoOrg: UserProfile = {
  name: 'Test User',
  email: 'test@example.com',
  activeOrgId: undefined,
};

export const mockInteropContextAuthenticated: InteropContext = {
  authenticated: true,
  caller: Principal.fromText('2vxsx-fae'),
  profile: mockUserProfile,
  activeOrg: BigInt(1),
  userRole: UserRole.owner,
};

export const mockInteropContextNoProfile: InteropContext = {
  authenticated: true,
  caller: Principal.fromText('2vxsx-fae'),
  profile: undefined,
  activeOrg: undefined,
  userRole: undefined,
};

export const mockOrganization = {
  id: BigInt(1),
  name: 'Test Organization',
  owner: Principal.fromText('2vxsx-fae'),
  createdAt: BigInt(Date.now() * 1000000),
  members: [Principal.fromText('2vxsx-fae')],
  admins: [],
  vendors: [],
};

export const mockOrganization2 = {
  id: BigInt(2),
  name: 'Second Organization',
  owner: Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai'),
  createdAt: BigInt(Date.now() * 1000000),
  members: [Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai')],
  admins: [],
  vendors: [],
};

// Helper to generate mock principals
export function generateMockPrincipal(seed: number): Principal {
  const principals = [
    '2vxsx-fae',
    'rrkah-fqaaa-aaaaa-aaaaq-cai',
    'ryjl3-tyaaa-aaaaa-aaaba-cai',
    'aaaaa-aa',
    'rno2w-sqaaa-aaaaa-aaacq-cai',
  ];
  return Principal.fromText(principals[seed % principals.length]);
}

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
