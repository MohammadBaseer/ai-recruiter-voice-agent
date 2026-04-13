import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  // Create new Svix instance to verify webhook
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Error: Missing Svix headers' },
      { status: 400 }
    );
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return NextResponse.json(
      { error: 'Error: Verification error' },
      { status: 400 }
    );
  }

  const { type, data } = evt;
  const eventType = type;

  // Handle user.created event
  if (eventType === 'user.created') {
    const userData = data as { 
      id: string; 
      email_addresses?: Array<{ email_address: string }>; 
      first_name?: string; 
      last_name?: string; 
      image_url?: string; 
    };
    const { id, email_addresses, first_name, last_name, image_url } = userData;

    try {
      await connectToDatabase();

      // Check if user already exists
      const existingUser = await User.findOne({ clerkId: id });
      if (existingUser) {
        return NextResponse.json(
          { message: 'User already exists' },
          { status: 200 }
        );
      }

      // Create new user in database
      const user = await User.create({
        clerkId: id,
        email: (email_addresses && email_addresses[0])?.email_address || '',
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
        role: 'user',
      });

      console.log('User created in database:', user);

      return NextResponse.json(
        { message: 'User created successfully', user },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error creating user in database:', error);
      return NextResponse.json(
        { error: 'Error creating user in database' },
        { status: 500 }
      );
    }
  }

  // Handle user.updated event
  if (eventType === 'user.updated') {
    const userData = data as { 
      id: string; 
      email_addresses?: Array<{ email_address: string }>; 
      first_name?: string; 
      last_name?: string; 
      image_url?: string; 
    };
    const { id, email_addresses, first_name, last_name, image_url } = userData;

    try {
      await connectToDatabase();

      const updatedUser = await User.findOneAndUpdate(
        { clerkId: id },
        {
          email: (email_addresses && email_addresses[0])?.email_address || '',
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
        { new: true, runValidators: true }
      );

      if (updatedUser) {
        console.log('User updated in database:', updatedUser);
        return NextResponse.json(
          { message: 'User updated successfully', user: updatedUser },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { message: 'User not found to update' },
        { status: 404 }
      );
    } catch (error) {
      console.error('Error updating user in database:', error);
      return NextResponse.json(
        { error: 'Error updating user in database' },
        { status: 500 }
      );
    }
  }

  // Handle user.deleted event
  if (eventType === 'user.deleted') {
    const { id } = data;

    try {
      await connectToDatabase();

      const deletedUser = await User.findOneAndDelete({ clerkId: id });

      if (deletedUser) {
        console.log('User deleted from database:', deletedUser);
        return NextResponse.json(
          { message: 'User deleted successfully' },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { message: 'User not found to delete' },
        { status: 404 }
      );
    } catch (error) {
      console.error('Error deleting user from database:', error);
      return NextResponse.json(
        { error: 'Error deleting user from database' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
}