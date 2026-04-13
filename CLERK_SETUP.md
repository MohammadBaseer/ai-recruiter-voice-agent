# Clerk Authentication Setup Guide

This guide explains how to set up Clerk authentication for the AI Recruiter Voice Agent application.

## Prerequisites

You need a Clerk account. Go to [Clerk Dashboard](https://dashboard.clerk.com) and create a free account.

## Step 1: Create a Clerk Application

1. Log in to [Clerk Dashboard](https://dashboard.clerk.com)
2. Click "Add Application" or select an existing application
3. Choose "Next.js" as the framework
4. Configure your application settings

## Step 2: Get Your API Keys

1. In your Clerk Dashboard, go to **API Keys** in the left sidebar
2. Copy the following keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

## Step 3: Configure Environment Variables

Update the `.env` file with your Clerk keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Step 4: Set Up Webhooks

To save user information to your database when they sign up, you need to configure webhooks:

### 4.1 Get Webhook Signing Secret

1. In Clerk Dashboard, go to **Webhooks** in the left sidebar
2. Click "Add Endpoint"
3. Enter the endpoint URL: `https://your-domain.com/api/clerk-webhook`
   - For local development, use a tool like [ngrok](https://ngrok.com) to expose your localhost
   - Example: `https://your-subdomain.ngrok.io/api/clerk-webhook`
4. Select the following events to listen to:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Click "Add Endpoint"
6. Copy the **Signing Secret** (starts with `whsec_`)

### 4.2 Add Webhook Secret to Environment Variables

Add the webhook secret to your `.env` file:

```env
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Step 5: Configure Allowed Origins (for local development)

1. In Clerk Dashboard, go to **User & Authentication** → **Settings**
2. Scroll down to **Allowed Origins**
3. Add `http://localhost:3000` for local development

## Step 6: Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/sign-up` to create a new account

3. After signing up, the webhook will automatically save the user to your MongoDB database

4. Verify the user was created by checking your MongoDB database

## File Structure

Here's what was implemented:

```
ai-recruiter-voice-agent/
├── middleware.ts                    # Clerk middleware for route protection
├── app/
│   ├── layout.tsx                   # Updated with ClerkProvider
│   ├── sign-in/[[...sign-in]]/
│   │   └── page.tsx                 # Sign-in page
│   ├── sign-up/[[...sign-up]]/
│   │   └── page.tsx                 # Sign-up page
│   └── api/
│       └── clerk-webhook/
│           └── route.ts             # Webhook handler for user events
└── lib/
    └── models/
        └── User.ts                  # User model for MongoDB
```

## Features Implemented

### 1. Authentication Pages
- **Sign-in page** (`/sign-in`) - Custom styled Clerk sign-in component
- **Sign-up page** (`/sign-up`) - Custom styled Clerk sign-up component

### 2. Route Protection
- Middleware protects all routes except:
  - `/` (home page)
  - `/sign-in` and `/sign-up`
  - `/api/clerk-webhook`

### 3. User Data Sync
The webhook handler (`/api/clerk-webhook`) automatically:
- Creates a user in MongoDB when they sign up (`user.created`)
- Updates user information when their profile changes (`user.updated`)
- Deletes user when their account is deleted (`user.deleted`)

### 4. User Model
The User model stores:
- `clerkId` - Unique Clerk user ID
- `email` - User's email address
- `firstName` - User's first name
- `lastName` - User's last name
- `imageUrl` - User's profile image
- `role` - User role (user/admin)

## Testing Locally with ngrok

For webhook testing during local development:

1. Install ngrok:
   ```bash
   npm install -g ngrok
   ```

2. Start your development server:
   ```bash
   npm run dev
   ```

3. In a new terminal, run ngrok:
   ```bash
   ngrok http 3000
   ```

4. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

5. Update your Clerk webhook endpoint URL to: `https://abc123.ngrok.io/api/clerk-webhook`

## Troubleshooting

### Webhook Not Working
- Ensure ngrok is running and the URL is correct
- Verify the webhook signing secret is correct
- Check the Clerk webhook logs in the Dashboard

### Authentication Not Working
- Verify API keys are correct (no extra spaces)
- Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` starts with `pk_`
- Ensure `CLERK_SECRET_KEY` starts with `sk_`

### User Not Saved to Database
- Ensure MongoDB is running
- Check the webhook logs in Clerk Dashboard
- Verify `CLERK_WEBHOOK_SECRET` is set correctly

## Production Deployment

For production:

1. Use live keys (not test keys) from Clerk
2. Set up proper webhook endpoint with your production domain
3. Configure allowed origins in Clerk Dashboard
4. Use environment variables in your hosting platform (Vercel, etc.)

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Webhooks](https://clerk.com/docs/webhooks/overview)