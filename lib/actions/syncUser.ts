"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";
import User, { IUser } from "@/lib/models/User";

/**
 * Upserts the currently authenticated Clerk user into MongoDB.
 *
 * Called server-side on every dashboard load so the record always exists,
 * regardless of whether the Clerk webhook fired (webhooks need a public URL
 * and can fail — this is the reliable primary path).
 *
 * Returns the MongoDB user document, or null if not authenticated.
 */
export async function syncUser(): Promise<IUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  try {
    await connectToDatabase();

    const email =
      clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress ??
      clerkUser.emailAddresses[0]?.emailAddress ??
      "";

    // upsert: create on first login, update on subsequent logins
    // First try to find by clerkId
    let user = await User.findOne({ clerkId: userId });

    if (user) {
      // Update existing user
      user.email = email;
      user.firstName = clerkUser.firstName ?? undefined;
      user.lastName = clerkUser.lastName ?? undefined;
      user.imageUrl = clerkUser.imageUrl ?? undefined;
      await user.save();
    } else {
      // Check if user exists by email (to avoid duplicate key error)
      user = await User.findOne({ email });
      
      if (user) {
        // Update existing user with this email and add clerkId
        user.clerkId = userId;
        user.firstName = clerkUser.firstName ?? undefined;
        user.lastName = clerkUser.lastName ?? undefined;
        user.imageUrl = clerkUser.imageUrl ?? undefined;
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          clerkId: userId,
          email,
          firstName: clerkUser.firstName ?? undefined,
          lastName: clerkUser.lastName ?? undefined,
          imageUrl: clerkUser.imageUrl ?? undefined,
          role: "user",
        });
      }
    }

    return user;
  } catch (error) {
    // Log but don't crash the page — user can still use the app
    console.error("[syncUser] Failed to sync user to MongoDB:", error);
    return null;
  }
}
