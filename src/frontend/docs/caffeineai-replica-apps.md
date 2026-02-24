# CaffeineAI Replica Micro-Apps Documentation

This document catalogs available replica micro-apps from the CaffeineAI system that have been adapted for the Arkly Portal multi-tenant architecture.

## Overview

The following micro-apps have been cloned and adapted from CaffeineAI's system to work within Arkly Portal's organization-based multi-tenant environment. Each app has been modified to:
- Use Internet Identity for authentication
- Integrate with the shared interoperability layer (useInteropContext)
- Enforce organization-scoped data isolation
- Apply role-based access control
- Use the portal's coral/orange design theme

## Adapted Micro-Apps

### 1. Social Feed (Social Media Category)

**Original Source**: CaffeineAI Social Network Template  
**Portal Category**: Social  
**Route**: `/apps/social-feed`  
**Status**: ✅ Adapted and Integrated

**Primary Features**:
- User-generated posts within organization context
- Real-time feed updates via polling (60s interval)
- Like, comment, and share interactions
- Author profile resolution
- Organization-scoped content isolation

**Adaptation Complexity**: Medium  
**Key Changes**:
- Replaced mock data with backend integration via `useSocialPosts` hook
- Added organization filtering for all posts
- Integrated user profile lookup for author names
- Applied portal theme colors and design tokens
- Added role-based UI controls (moderation for owners/admins)

**Backend Integration**:
- `createPost(orgId, content)` - Create new posts
- `getOrgPosts(orgId)` - Fetch organization posts
- `getPost(postId)` - Get individual post details

---

### 2. Messaging Inbox (Messaging Category)

**Original Source**: CaffeineAI Direct Messaging System  
**Portal Category**: Messaging  
**Route**: `/apps/messaging-inbox`  
**Status**: ✅ Adapted and Integrated

**Primary Features**:
- Private conversations between organization members
- Real-time message updates via polling (30s interval)
- Conversation threading
- Participant management
- Multi-tenant data isolation

**Adaptation Complexity**: Medium-High  
**Key Changes**:
- Replaced mock conversations with backend integration via `useConversations` hook
- Added organization membership validation for all participants
- Implemented conversation list with last message preview
- Added message composition and sending functionality
- Applied portal design system

**Backend Integration**:
- `createConversation(orgId, participants)` - Start new conversation
- `getUserConversations(orgId)` - Fetch user's conversations
- `getConversation(conversationId)` - Get conversation details
- `addMessage(conversationId, content)` - Send message

---

### 3. Community Forum (Forums Category)

**Original Source**: CaffeineAI Discussion Board  
**Portal Category**: Forums  
**Route**: `/apps/forum`  
**Status**: ✅ Adapted and Integrated

**Primary Features**:
- Topic creation and discussion threads
- Reply system with nested conversations
- Real-time topic updates via polling (60s interval)
- View and reply counts
- Role-based moderation (pin, edit, delete for owners/admins)

**Adaptation Complexity**: Medium  
**Key Changes**:
- Replaced mock topics with backend integration via `useForumTopics` hook
- Added organization filtering for all topics
- Implemented topic creation and reply functionality
- Added role-based moderation controls
- Applied forum category theme colors

**Backend Integration**:
- `createTopic(orgId, title, content)` - Create new topic
- `getOrgTopics(orgId)` - Fetch organization topics
- `getTopic(topicId)` - Get topic with replies
- `addReply(topicId, content)` - Add reply to topic

---

## Additional Available Replica Apps (Not Yet Adapted)

### 4. AI Chat Assistant (AI Category)

**Original Source**: CaffeineAI Conversational AI Template  
**Alignment**: AI Category  
**Adaptation Assessment**: High complexity - requires AI service integration

**Primary Features**:
- Natural language conversation interface
- Context-aware responses
- Conversation history
- Multi-model support

**Adaptation Notes**: Would require external AI API integration or on-chain AI model deployment. Current portal has AI Playground as a simpler alternative.

---

### 5. DAO Governance (DAO Category)

**Original Source**: CaffeineAI Decentralized Governance System  
**Alignment**: DAO Category  
**Adaptation Assessment**: High complexity - requires voting and proposal systems

**Primary Features**:
- Proposal creation and voting
- Token-weighted governance
- Execution of approved proposals
- Voting history and analytics

**Adaptation Notes**: Would require token management system and proposal execution framework. Good candidate for future expansion.

---

### 6. Marketplace (Marketplace Category)

**Original Source**: CaffeineAI P2P Marketplace  
**Alignment**: Marketplace Category  
**Adaptation Assessment**: Medium-High complexity - requires payment integration

**Primary Features**:
- Product/service listings
- Search and filtering
- Transaction management
- Seller ratings and reviews

**Adaptation Notes**: Would require payment processing integration and escrow system. Could leverage existing vendor management system.

---

### 7. Event Calendar (Events Category)

**Original Source**: CaffeineAI Event Management System  
**Alignment**: Events Category (not yet in portal)  
**Adaptation Assessment**: Medium complexity

**Primary Features**:
- Event creation and scheduling
- RSVP management
- Calendar views (day, week, month)
- Event reminders

**Adaptation Notes**: Straightforward adaptation with organization-scoped events. Would add new category to portal.

---

### 8. Knowledge Base (Knowledge Category)

**Original Source**: CaffeineAI Wiki/Documentation System  
**Alignment**: Knowledge Category (not yet in portal)  
**Adaptation Assessment**: Medium complexity

**Primary Features**:
- Article creation and editing
- Category organization
- Search functionality
- Version history

**Adaptation Notes**: Could leverage forum backend structure. Would add new category to portal.

---

## Mapping to Portal Categories

| Portal Category | Adapted Apps | Available for Adaptation |
|----------------|--------------|--------------------------|
| AI | AI Playground (existing) | AI Chat Assistant |
| DAO | DAO Voting (existing) | DAO Governance (enhanced) |
| Messaging | Messaging Inbox ✅ | - |
| Forums | Community Forum ✅ | - |
| Marketplace | Vendor Marketplace (existing) | P2P Marketplace |
| Social | Social Feed ✅ | - |
| Banking | Banking Dashboard (existing) | - |
| Payments | Payment Gateway (existing) | - |
| Network | Network Monitor (existing) | - |

## Implementation Status

**Completed (3/8)**:
- ✅ Social Feed - Fully integrated with real-time updates
- ✅ Messaging Inbox - Fully integrated with real-time updates
- ✅ Community Forum - Fully integrated with real-time updates

**Recommended Next Steps**:
1. Event Calendar - Add events category and adapt event management
2. Knowledge Base - Add knowledge category for organization documentation
3. Enhanced Marketplace - Expand vendor system with P2P features
4. DAO Governance - Enhance existing DAO voting with proposal execution

## Technical Architecture

All adapted apps follow this pattern:

1. **Authentication**: Internet Identity via `useInternetIdentity` hook
2. **Context**: Shared interoperability layer via `useInteropContext` hook
3. **Activity Logging**: Automatic logging via `useLogActivityWithContext` hook
4. **Data Access**: React Query hooks in `useQueries.ts`
5. **Multi-tenancy**: Organization ID filtering on all backend calls
6. **Real-time Updates**: Polling with `refetchInterval` configuration
7. **Theme**: Portal design tokens and category-specific colors

## Design Consistency

All adapted apps maintain:
- Coral/orange primary color palette (oklch(0.68 0.19 35))
- Consistent spacing and typography
- Responsive mobile-first layouts
- Light/dark mode support
- Accessible UI components from shadcn/ui
