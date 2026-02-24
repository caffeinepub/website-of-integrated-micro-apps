import { describe, it, expect } from 'vitest';
import { Principal } from '@dfinity/principal';
import { UserRole } from '../backend';
import {
  createMockActor,
  mockUserProfile,
  mockUserProfileNoOrg,
  mockInteropContextNoProfile,
} from './setup';

describe('Interop Isolation Tests', () => {
  describe('getInteropContext - Authentication State Boundaries', () => {
    it('should return minimal context when user has no profile', async () => {
      const actor = createMockActor({
        authenticated: true,
        profile: null,
        activeOrg: null,
        userRole: null,
      });

      const context = await actor.getInteropContext();

      expect(context.authenticated).toBe(true);
      expect(context.caller).toBeInstanceOf(Principal);
      expect(context.profile).toBeUndefined();
      expect(context.activeOrg).toBeUndefined();
      expect(context.userRole).toBeUndefined();
    });

    it('should return context with profile but no org when user has no active organization', async () => {
      const actor = createMockActor({
        authenticated: true,
        profile: mockUserProfileNoOrg,
        activeOrg: null,
        userRole: null,
      });

      const context = await actor.getInteropContext();

      expect(context.authenticated).toBe(true);
      expect(context.profile).toBeDefined();
      expect(context.profile?.name).toBe('Test User');
      expect(context.activeOrg).toBeUndefined();
      expect(context.userRole).toBeUndefined();
    });

    it('should return full context when user is authenticated with profile and active org', async () => {
      const actor = createMockActor({
        authenticated: true,
        profile: mockUserProfile,
        activeOrg: BigInt(1),
        userRole: UserRole.owner,
      });

      const context = await actor.getInteropContext();

      expect(context.authenticated).toBe(true);
      expect(context.profile).toBeDefined();
      expect(context.profile?.activeOrgId).toBe(BigInt(1));
      expect(context.activeOrg).toBe(BigInt(1));
      expect(context.userRole).toBe(UserRole.owner);
    });
  });

  describe('getUserRole - Unauthenticated Access', () => {
    it('should return null when querying role for non-member user', async () => {
      const actor = createMockActor({
        authenticated: true,
        userRole: UserRole.user,
        organizations: [
          {
            id: BigInt(1),
            members: [Principal.fromText('2vxsx-fae')],
          },
        ],
      });

      const nonMemberPrincipal = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');

      await expect(
        actor.getUserRole(BigInt(1), nonMemberPrincipal)
      ).rejects.toThrow('Unauthorized: You must be a member of this organization');
    });

    it('should return user role when querying for member user', async () => {
      const memberPrincipal = Principal.fromText('2vxsx-fae');
      const actor = createMockActor({
        authenticated: true,
        userRole: UserRole.user,
        organizations: [
          {
            id: BigInt(1),
            members: [memberPrincipal],
          },
        ],
      });

      const role = await actor.getUserRole(BigInt(1), memberPrincipal);

      expect(role).toBe(UserRole.user);
    });
  });

  describe('logActivity - Authentication Requirements', () => {
    it('should throw error when logging activity without authentication', async () => {
      const actor = createMockActor({
        authenticated: false,
      });

      await expect(
        actor.logActivity(BigInt(1), BigInt(1), 'test_event', 'test metadata')
      ).rejects.toThrow('Unauthorized: Only authenticated users can log activity');
    });

    it('should throw error when logging activity for non-member organization', async () => {
      const actor = createMockActor({
        authenticated: true,
        organizations: [
          {
            id: BigInt(1),
            members: [Principal.fromText('2vxsx-fae')],
          },
        ],
      });

      await expect(
        actor.logActivity(BigInt(2), BigInt(1), 'test_event', 'test metadata')
      ).rejects.toThrow('Unauthorized: You must be a member of this organization to log activity');
    });

    it('should successfully log activity when authenticated and member of organization', async () => {
      const actor = createMockActor({
        authenticated: true,
        organizations: [
          {
            id: BigInt(1),
            members: [Principal.fromText('2vxsx-fae')],
          },
        ],
      });

      await expect(
        actor.logActivity(BigInt(1), BigInt(1), 'test_event', 'test metadata')
      ).resolves.toBeUndefined();

      expect(actor.logActivity).toHaveBeenCalledWith(
        BigInt(1),
        BigInt(1),
        'test_event',
        'test metadata'
      );
    });
  });
});
