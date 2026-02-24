import { describe, it, expect } from 'vitest';
import { Principal } from '@dfinity/principal';
import { UserRole } from '../backend';
import { createMockActor, mockUserProfile } from './setup';

describe('Interop Contract Validation Tests', () => {
  describe('getInteropContext - API Shape Validation', () => {
    it('should return object with expected InteropContext shape', async () => {
      const actor = createMockActor({
        authenticated: true,
        profile: mockUserProfile,
        activeOrg: BigInt(1),
        userRole: UserRole.owner,
      });

      const context = await actor.getInteropContext();

      // Validate structure
      expect(context).toHaveProperty('authenticated');
      expect(context).toHaveProperty('caller');
      expect(context).toHaveProperty('profile');
      expect(context).toHaveProperty('activeOrg');
      expect(context).toHaveProperty('userRole');

      // Validate types
      expect(typeof context.authenticated).toBe('boolean');
      expect(context.caller).toBeInstanceOf(Principal);
      expect(context.profile).toBeDefined();
      expect(typeof context.activeOrg).toBe('bigint');
      expect(typeof context.userRole).toBe('string');
    });

    it('should return valid UserProfile structure when profile exists', async () => {
      const actor = createMockActor({
        authenticated: true,
        profile: mockUserProfile,
        activeOrg: BigInt(1),
        userRole: UserRole.admin,
      });

      const context = await actor.getInteropContext();

      expect(context.profile).toBeDefined();
      expect(context.profile).toHaveProperty('name');
      expect(context.profile).toHaveProperty('email');
      expect(context.profile).toHaveProperty('activeOrgId');

      expect(typeof context.profile!.name).toBe('string');
      expect(typeof context.profile!.email).toBe('string');
      expect(typeof context.profile!.activeOrgId).toBe('bigint');
    });

    it('should handle optional fields correctly when not present', async () => {
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
  });

  describe('getUserRole - UserRole Enum Validation', () => {
    it('should return valid UserRole enum value for owner', async () => {
      const memberPrincipal = Principal.fromText('2vxsx-fae');
      const actor = createMockActor({
        authenticated: true,
        userRole: UserRole.owner,
        organizations: [
          {
            id: BigInt(1),
            members: [memberPrincipal],
          },
        ],
      });

      const role = await actor.getUserRole(BigInt(1), memberPrincipal);

      expect(role).toBe(UserRole.owner);
      expect([UserRole.owner, UserRole.admin, UserRole.user]).toContain(role);
    });

    it('should return valid UserRole enum value for admin', async () => {
      const memberPrincipal = Principal.fromText('2vxsx-fae');
      const actor = createMockActor({
        authenticated: true,
        userRole: UserRole.admin,
        organizations: [
          {
            id: BigInt(1),
            members: [memberPrincipal],
          },
        ],
      });

      const role = await actor.getUserRole(BigInt(1), memberPrincipal);

      expect(role).toBe(UserRole.admin);
      expect([UserRole.owner, UserRole.admin, UserRole.user]).toContain(role);
    });

    it('should return valid UserRole enum value for user', async () => {
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
      expect([UserRole.owner, UserRole.admin, UserRole.user]).toContain(role);
    });
  });

  describe('logActivity - Parameter Contract Validation', () => {
    it('should accept expected parameters and return void promise', async () => {
      const actor = createMockActor({
        authenticated: true,
        organizations: [
          {
            id: BigInt(1),
            members: [Principal.fromText('2vxsx-fae')],
          },
        ],
      });

      const orgId = BigInt(1);
      const appId = BigInt(5);
      const eventType = 'user_action';
      const metadata = JSON.stringify({ action: 'click', target: 'button' });

      const result = await actor.logActivity(orgId, appId, eventType, metadata);

      expect(result).toBeUndefined();
      expect(actor.logActivity).toHaveBeenCalledWith(orgId, appId, eventType, metadata);
      expect(actor.logActivity).toHaveBeenCalledTimes(1);
    });

    it('should validate orgId parameter type as bigint', async () => {
      const actor = createMockActor({
        authenticated: true,
        organizations: [
          {
            id: BigInt(1),
            members: [Principal.fromText('2vxsx-fae')],
          },
        ],
      });

      const orgId = BigInt(1);
      await actor.logActivity(orgId, BigInt(1), 'test', 'metadata');

      const callArgs = actor.logActivity.mock.calls[0];
      expect(typeof callArgs[0]).toBe('bigint');
    });

    it('should validate eventType and metadata as strings', async () => {
      const actor = createMockActor({
        authenticated: true,
        organizations: [
          {
            id: BigInt(1),
            members: [Principal.fromText('2vxsx-fae')],
          },
        ],
      });

      const eventType = 'page_view';
      const metadata = 'user navigated to dashboard';

      await actor.logActivity(BigInt(1), BigInt(1), eventType, metadata);

      const callArgs = actor.logActivity.mock.calls[0];
      expect(typeof callArgs[2]).toBe('string');
      expect(typeof callArgs[3]).toBe('string');
    });
  });
});
