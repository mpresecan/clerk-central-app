# Centralized Clerk Authentication Implementation

This document provides a comprehensive guide to the centralized Clerk authentication system implemented across the `clerk-center` (primary authentication server) and `pl1`/`pl2` (PayloadCMS satellite applications).

## Architecture Overview

The system follows Clerk's Primary/Satellite model:

- **Primary Server** (`clerk-center/`): Hosts authentication UI and manages user sessions
- **Satellite Applications** (`pl1/`, `pl2/`): PayloadCMS applications that delegate authentication to the primary server
- **Authentication Flow**: Users authenticate once on the primary server and gain access to all satellite applications

## Project Structure

```
centralized-auth/
├── clerk-center/          # Primary authentication server
├── pl1/                   # PayloadCMS satellite application #1
├── pl2/                   # PayloadCMS satellite application #2
└── docs/                  # Documentation
```

## Implementation Details

### 1. Primary Authentication Server (clerk-center)

#### Configuration
- **Port**: 3000 (localhost:3000)
- **Role**: Primary authentication server
- **Features**: Sign-in/sign-up pages, user management

#### Key Files
- `src/app/layout.tsx`: ClerkProvider with allowedRedirectOrigins
- `src/app/sign-in/[[...sign-in]]/page.tsx`: Sign-in page
- `src/app/sign-up/[[...sign-up]]/page.tsx`: Sign-up page
- `.env.local`: Environment configuration

#### Environment Variables
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key
CLERK_SECRET_KEY=sk_test_your-secret-key
NEXT_PUBLIC_CLERK_DOMAIN=localhost:3000
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_PL1_URL=http://localhost:3001
NEXT_PUBLIC_PL2_URL=http://localhost:3002
```

### 2. Satellite Applications (pl1, pl2)

#### Configuration
- **pl1 Port**: 3001 (localhost:3001)
- **pl2 Port**: 3002 (localhost:3002)
- **Role**: PayloadCMS applications with Clerk frontend authentication

#### Key Features
- **Dual Authentication**: PayloadCMS admin uses built-in auth, frontend uses Clerk
- **Protected Routes**: `/dashboard`, `/profile` require Clerk authentication
- **User Sync**: Clerk users synced to `frontend-users` collection via webhooks

#### Key Files
- `src/middleware.ts`: Route protection for frontend pages
- `src/collections/Users.ts`: PayloadCMS admin users
- `src/collections/FrontendUsers.ts`: Clerk-authenticated frontend users
- `src/app/(frontend)/layout.tsx`: ClerkProvider for frontend
- `src/app/api/clerk-webhook/route.ts`: User synchronization

#### Environment Variables (pl1)
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key
CLERK_SECRET_KEY=sk_test_your-secret-key
NEXT_PUBLIC_CLERK_IS_SATELLITE=true
NEXT_PUBLIC_CLERK_DOMAIN=localhost:3001
NEXT_PUBLIC_CLERK_SIGN_IN_URL=http://localhost:3000/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=http://localhost:3000/sign-up
PAYLOAD_SECRET=your-payload-secret-key
DATABASE_URI=mongodb://localhost:27017/pl1
CLERK_WEBHOOK_SECRET=your-clerk-webhook-secret
```

#### Environment Variables (pl2)
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key
CLERK_SECRET_KEY=sk_test_your-secret-key
NEXT_PUBLIC_CLERK_IS_SATELLITE=true
NEXT_PUBLIC_CLERK_DOMAIN=localhost:3002
NEXT_PUBLIC_CLERK_SIGN_IN_URL=http://localhost:3000/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=http://localhost:3000/sign-up
PAYLOAD_SECRET=your-payload-secret-key
DATABASE_URI=mongodb://localhost:27017/pl2
CLERK_WEBHOOK_SECRET=your-clerk-webhook-secret
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and pnpm
- MongoDB instance
- Clerk account and application

### 1. Clerk Dashboard Setup
1. Create a new Clerk application at https://dashboard.clerk.com/
2. Configure domains:
   - Primary domain: `localhost:3000`
   - Add satellite domains: `localhost:3001`, `localhost:3002`
3. Set up webhooks for user synchronization:
   - Endpoint: `http://localhost:3001/api/clerk-webhook`
   - Endpoint: `http://localhost:3002/api/clerk-webhook`
   - Events: `user.created`, `user.deleted`

### 2. Environment Configuration
1. Copy `.env.local.example` to `.env.local` in each application
2. Update with your Clerk keys and database URLs
3. Generate secure secrets for PAYLOAD_SECRET and CLERK_WEBHOOK_SECRET

### 3. Database Setup
Ensure MongoDB is running with separate databases:
- `pl1`: mongodb://localhost:27017/pl1
- `pl2`: mongodb://localhost:27017/pl2

### 4. Installation and Startup
```bash
# Install dependencies
cd clerk-center && pnpm install
cd ../pl1 && pnpm install
cd ../pl2 && pnpm install

# Start applications (in separate terminals)
cd clerk-center && pnpm dev    # Port 3000
cd pl1 && pnpm dev             # Port 3001
cd pl2 && pnpm dev             # Port 3002
```

## Authentication Flow

### Frontend User Authentication
1. User visits protected page on satellite app (e.g., `/dashboard`)
2. Middleware redirects to primary server sign-in
3. User authenticates on primary server
4. Primary server redirects back to satellite app
5. User gains access to protected content

### PayloadCMS Admin Authentication
- Separate from Clerk authentication
- Access via `/admin` on each satellite application
- Uses PayloadCMS built-in authentication system

## User Management

### Frontend Users
- Stored in `frontend-users` collection
- Contains only `clerkId` and `email` (minimal data)
- All other user data remains in Clerk
- Synchronized via webhooks

### Admin Users
- Stored in `users` collection
- Full PayloadCMS authentication
- Separate from frontend users

## Security Considerations

1. **Environment Variables**: Keep all secrets secure and never commit to version control
2. **Webhook Security**: Verify webhook signatures using CLERK_WEBHOOK_SECRET
3. **Route Protection**: Middleware only protects frontend routes, not admin routes
4. **CORS**: Properly configured allowedRedirectOrigins in primary server

## Troubleshooting

### Common Issues
1. **Authentication Loops**: Check environment variable configuration
2. **Webhook Failures**: Verify webhook secret and endpoint URLs
3. **Database Errors**: Ensure MongoDB is running and accessible
4. **CORS Errors**: Verify allowedRedirectOrigins in clerk-center

### Testing the Implementation
1. Start all three applications
2. Visit http://localhost:3001 and http://localhost:3002
3. Test sign-in flow from satellite applications
4. Verify user synchronization in PayloadCMS admin
5. Test protected routes (/dashboard, /profile)

## Production Deployment

### Domain Configuration
Update environment variables with production domains:
```bash
# Primary server
NEXT_PUBLIC_CLERK_DOMAIN=auth.yourdomain.com

# Satellite applications
NEXT_PUBLIC_CLERK_SIGN_IN_URL=https://auth.yourdomain.com/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=https://auth.yourdomain.com/sign-up
```

### DNS Setup
Configure CNAME records for satellite domains in Clerk Dashboard for production SSL certificates.

## Best Practices

1. **Data Minimization**: Store only necessary data in PayloadCMS, keep user data in Clerk
2. **Error Handling**: Implement proper error handling for authentication failures
3. **Monitoring**: Monitor webhook endpoints and authentication flows
4. **Testing**: Test authentication flows across all applications regularly

## Support and Resources

- [Clerk Documentation](https://clerk.com/docs)
- [PayloadCMS Documentation](https://payloadcms.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
