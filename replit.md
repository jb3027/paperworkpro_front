# PaperworkPro - Production File Management System

## Overview

PaperworkPro is a Next.js-based web application designed for managing production files and documents. The system provides role-based access control with visual lock/unlock indicators showing which productions users can access. Users can navigate into productions they have access to and switch between Edit Mode and Broadcast Mode for different workflows.

The application targets production teams who need a centralized platform to store, organize, and access production-related documents with appropriate permission controls.

## Recent Changes (October 2025)

- **Dashboard Redesign**: Removed recent files section; dashboard now shows all productions with lock/unlock padlock icons
- **Access Control**: Productions display open padlock (green) for accessible productions and locked padlock (red) for restricted ones
- **Production Detail Pages**: New `/production/[id]` route with Edit Mode and Broadcast Mode navigation buttons
- **Mode Pages**: Placeholder pages for Edit Mode and Broadcast Mode functionality
- **Color Scheme**: Updated to use teal (#0d9488), amber (#f59e0b), dark red (#991b1b), and neon green (#10b981)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 15.5.4 with React 19.1.0 and TypeScript
- Uses Next.js App Router architecture with client-side rendering ("use client" directives)
- Turbopack enabled for faster development builds
- Custom port configuration (5000) for Replit environment compatibility

**UI Component System**:
- Custom component library built on Radix UI primitives (@radix-ui/react-tabs)
- Tailwind CSS v4 for styling with custom CSS variables for theming
- Framer Motion for animations and transitions
- Lucide React for icons
- Component structure follows atomic design with base UI components in `src/app/components/ui/`

**Routing & Navigation**:
- File-based routing via Next.js App Router
- Custom utility function `createPageUrl()` for generating internal URLs
- Client-side navigation with Next.js Link components

**State Management**:
- React hooks (useState, useEffect, useCallback) for local component state
- No global state management library - relies on prop drilling and component-level state
- URL search params for passing data between pages (e.g., production ID)

**Design Patterns**:
- Dark mode UI with custom color scheme: teal (#0d9488), amber (#f59e0b), dark red (#991b1b), neon green (#10b981)
- Role-based access control with visual lock/unlock indicators
- Production-centric navigation with Edit Mode and Broadcast Mode workflows
- Admin users have access to all productions, other users only see productions they're members of

### Backend Architecture

**Current State**: Mock data implementation with service layer abstraction
- Service classes (`UserService`, `FileService`, `ProductionService`) in `src/lib/services.ts`
- Entity classes (`User`, `File`, `Production`) in `src/app/components/entities/`
- All backend methods currently throw "Not implemented" errors - designed for future API integration
- Mock data stored in `src/lib/mockData.ts` with simulated async operations

**Planned Architecture**:
- Entity classes have CRUD methods (create, filter, update, delete) ready for API implementation
- Service layer uses async/await pattern with simulated delays
- Authentication system planned but not yet implemented (login page exists)

**Data Models**:

*User*:
- Role-based access (admin, editor, viewer)
- Email-based identification
- Created date tracking

*Production*:
- Member-based access control via email array
- Admins have access to all productions
- Non-admin users only access productions where their email is in the members array
- Visual indicators (lock/unlock icons) show access status

*File*:
- Production association via production_id
- Type categorization (9 predefined types)
- File metadata (URL, size, mime type)
- Created/updated date tracking
- Optional descriptions

### Data Storage

**Current**: In-memory mock data with no persistence
**Planned**: The architecture suggests a future database integration, likely:
- RESTful API or GraphQL endpoint consumption
- File storage service for uploaded documents
- Relational data model with foreign keys (production_id references)

### Authentication & Authorization

**Current Implementation**:
- Mock login system with email-based user selection
- Simple credential check against mock user array
- No token management or session persistence
- User context stored in component state

**Role-based Permissions**:
- Admin: Full access to all productions and files
- Editor: Can edit files they have access to
- Viewer: Read-only access
- Production access controlled via members array

**Planned Security**:
- Entity classes have `me()` and `logout()` methods for future auth integration
- No current password hashing or secure storage

### External Dependencies

**Core Framework Dependencies**:
- Next.js 15.5.4 - React framework with App Router
- React 19.1.0 & React DOM 19.1.0 - UI library
- TypeScript 5.x - Type safety

**UI & Styling**:
- Tailwind CSS v4 - Utility-first CSS framework
- @tailwindcss/postcss v4 - PostCSS integration
- @radix-ui/react-tabs ^1.1.13 - Accessible tab component primitive
- Framer Motion ^12.23.22 - Animation library
- Lucide React ^0.544.0 - Icon library

**Utilities**:
- date-fns ^4.1.0 - Date formatting and manipulation

**Development Tools**:
- ESLint 9.x with Next.js config - Code linting
- TypeScript compiler - Type checking

**Environment-Specific**:
- Replit dev domain configuration in next.config.ts
- Custom allowed dev origins for Replit environment

**File Upload Integration**:
- `UploadFile` function in `src/integrations/Core.ts` - Currently a placeholder using URL.createObjectURL
- Designed for future integration with cloud storage service (likely AWS S3, Cloudinary, or similar)

**Missing Integrations** (Architecture suggests future needs):
- Database ORM/client (no Drizzle, Prisma, or similar currently configured)
- Backend API framework or serverless functions
- File storage service (S3, Cloudinary, etc.)
- Authentication provider (Auth0, NextAuth, etc.)
- Email service for notifications