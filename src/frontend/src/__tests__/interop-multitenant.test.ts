import { describe, it, expect } from 'vitest';
import { Principal } from '@dfinity/principal';
import { UserRole } from '../backend';
import { createMockActor, generateMockPrincipal } from './setup';

describe('Interop Multi-Tenant Boundary Tests', () => {
  describe('getInteropContext - Organization Membership Enforcement', () => {
    it('should only return data for organizations the user belongs to', async () => {
      const userPrincipal = Principal.fromText('2vxsx-fae');
      const actor = createMockActor({
        authenticated: true,
        profile: {
          name: 'Test User',
          email: 'test@example.com',
          activeOrgId: BigInt(1),
        },
        activeOrg: BigInt(1),
        userRole: UserRole.owner,
      });

      const context = await actor.getInteropContext();

      expect(context.activeOrg).toBe(BigInt(1));
      expect(context.userRole).toBe(UserRole.owner);
      expect(context.profile?.activeOrgId).toBe(BigInt(1));
    });

    it('should return null activeOrg when user is not member of any organization', async () => {
      const actor = createMockActor({
        authenticated: true,
        profile: {
          name: 'Test User',
          email: 'test@example.com',
          activeOrgId: undefined,
        },
        activeOrg: null,
        userRole: null,
      });

      const context = await actor.getInteropContext();

      expect(context.activeOrg).toBeUndefined();
      expect(context.userRole).toBeUndefined();
    });

    it('should reflect correct organization when user switches active org', async () => {
      const actor = createMockActor({
        authenticated: true,
        profile: {
          name: 'Test User',
          email: 'test@example.com',
          activeOrgId: BigInt(2),
        },
        activeOrg: BigInt(2),
        userRole: UserRole.admin,
      });

      const context = await actor.getInteropContext();

      expect(context.activeOrg).toBe(BigInt(2));
      expect(context.userRole).toBe(UserRole.admin);
      expect(context.profile?.activeOrgId).toBe(BigInt(2));
    });
  });

  describe('getUserRole - Cross-Tenant Access Prevention', () => {
    it('should return null when querying role for organization user is not member of', async () => {
      const user1 = generateMockPrincipal(0);
      const user2 = generateMockPrincipal(1);

      const actor = createMockActor({
        authenticated: true,
        userRole: UserRole.owner,
        organizations: [
          {
            id: BigInt(1),
            members: [user1],
          },
          {
            id: BigInt(2),
            members: [user2],
          },
        ],
      });

      // User1 trying to query role in Org2 (where they're not a member)
      await expect(actor.getUserRole(BigInt(2), user1)).rejects.toThrow(
        'Unauthorized: You must be a member of this organization'
      );
    });

    it('should return correct role when user is member of multiple organizations', async () => {
      const user = generateMockPrincipal(0);

      const actorOrg1 = createMockActor({
        authenticated: true,
        userRole: UserRole.owner,
        organizations: [
          {
            id: BigInt(1),
            members: [user],
          },
        ],
      });

      const actorOrg2 = createMockActor({
        authenticated: true,
        userRole: UserRole.user,
        organizations: [
          {
            id: BigInt(2),
            members: [user],
          },
        ],
      });

      const roleOrg1 = await actorOrg1.getUserRole(BigInt(1), user);
      const roleOrg2 = await actorOrg2.getUserRole(BigInt(2), user);

      expect(roleOrg1).toBe(UserRole.owner);
      expect(roleOrg2).toBe(UserRole.user);
    });

    it('should enforce organization boundaries for different users', async () => {
      const owner1 = generateMockPrincipal(0);
      const owner2 = generateMockPrincipal(1);
      const user3 = generateMockPrincipal(2);

      const actor = createMockActor({
        authenticated: true,
        userRole: UserRole.owner,
        organizations: [
          {
            id: BigInt(1),
            members: [owner1, user3],
          },
          {
            id: BigInt(2),
            members: [owner2],
          },
        ],
      });

      // Owner2 should not be able to query roles in Org1
      await expect(actor.getUserRole(BigInt(1), owner2)).rejects.toThrow(
        'Unauthorized: You must be a member of this organization'
      );

      // User3 should be able to query their role in Org1
      const role = await actor.getUserRole(BigInt(1), user3);
      expect(role).toBe(UserRole.owner); // Based on mock config
    });
  });

  describe('logActivity - Organization Scoping', () => {
    it('should scope activity logging to users active organization', async () => {
      const user = generateMockPrincipal(0);
      const actor = createMockActor({
        authenticated: true,
        organizations: [
          {
            id: BigInt(1),
            members: [user],
          },
        ],
      });

      await actor.logActivity(BigInt(1), BigInt(5), 'user_action', 'clicked button');

      expect(actor.logActivity).toHaveBeenCalledWith(
        BigInt(1),
        BigInt(5),
        'user_action',
        'clicked button'
      );
    });

    it('should prevent logging activity for organizations user is not member of', async () => {
      const user = generateMockPrincipal(0);
      const actor = createMockActor({
        authenticated: true,
        organizations: [
          {
            id: BigInt(1),
            members: [user],
          },
        ],
      });

      // Try to log activity for Org2 where user is not a member
      await expect(
        actor.logActivity(BigInt(2), BigInt(5), 'user_action', 'clicked button')
      ).rejects.toThrow('Unauthorized: You must be a member of this organization to log activity');
    });

    it('should validate orgId matches users membership before logging', async () => {
      const user1 = generateMockPrincipal(0);
      const user2 = generateMockPrincipal(1);

      const actor = createMockActor({
        authenticated: true,
        organizations: [
          {
            id: BigInt(1),
            members: [user1],
          },
          {
            id: BigInt(2),
            members: [user2],
          },
        ],
      });

      // User1 can log to Org1
      await expect(
        actor.logActivity(BigInt(1), BigInt(5), 'test_event', 'metadata')
      ).resolves.toBeUndefined();

      // User1 cannot log to Org2
      await expect(
        actor.logActivity(BigInt(2), BigInt(5), 'test_event', 'metadata')
      ).rejects.toThrow('Unauthorized: You must be a member of this organization to log activity');
    });

    it('should allow logging with orgId 0 for global activities', async () => {
      const actor = createMockActor({
        authenticated: true,
        organizations: [],
      });

      // OrgId 0 should be allowed for global activities
      await expect(
        actor.logActivity(BigInt(0), BigInt(1), 'global_event', 'metadata')
      ).resolves.toBeUndefined();
    });
  });
});
