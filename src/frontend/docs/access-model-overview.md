# Access Model Overview

This document explains the authentication, authorization, and multi-tenant architecture for all micro-apps built on the Arkly Portal platform.

## 1. Internet Identity Authentication Flow

### Authentication Mechanism
The platform uses **Internet Identity** for decentralized authentication. Users authenticate through the Internet Computer's identity service, which provides a unique **Principal ID** for each user.

### Anonymous vs Authenticated Users
- **Anonymous principals** are treated as **guests** with no access to application data
- **Authenticated users** receive a stable Principal ID after logging in through Internet Identity
- The authentication state is managed by the `useInternetIdentity` hook in `frontend/src/hooks/useInternetIdentity.ts`

### Login Flow
1. User clicks "Login" button
2. Internet Identity modal opens for authentication
3. Upon successful authentication, user receives a Principal ID
4. If first-time login, user is prompted to create a profile (name and email)
5. User profile is saved via `saveCallerUserProfile` backend method
6. User can now access application features

### Logout Flow
1. User clicks "Logout" button
2. `clear()` method is called to clear the identity
3. All cached application data is cleared from React Query cache
4. User returns to guest/anonymous state

## 2. Shared Interoperability Layer

### Purpose
The shared interoperability layer provides a **consistent access model** across all micro-apps in the portal. It ensures that every micro-app has access to:
- User profile information
- Active organization context
- User role within the organization
- Authentication state

### Core API: `getInteropContext`

The `getInteropContext` backend method returns a unified context object:

