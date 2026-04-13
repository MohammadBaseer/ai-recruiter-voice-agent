import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncUser } from "@/lib/actions/syncUser";
import DashboardClient from "./DashboardClient";

/**
 * Server component — runs on every dashboard load.
 * 1. Redirects unauthenticated users to /sign-in
 * 2. Saves the user into MongoDB via syncUser (upsert)
 *    — this is the reliable primary path; the Clerk webhook is a backup
 *      that only works when the endpoint is publicly accessible.
 * 3. Passes plain user data down to the client component.
 */
export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Sync to MongoDB — create or update, never errors out the page
  const dbUser = await syncUser();

  // Also get the Clerk profile for fresh imageUrl / names
  const clerkUser = await currentUser();

  const firstName = clerkUser?.firstName ?? dbUser?.firstName ?? null;
  const lastName = clerkUser?.lastName ?? dbUser?.lastName ?? null;
  const email =
    clerkUser?.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ??
    dbUser?.email ??
    "";
  const imageUrl = clerkUser?.imageUrl ?? dbUser?.imageUrl ?? "";

  return (
    <DashboardClient
      firstName={firstName}
      lastName={lastName}
      email={email}
      imageUrl={imageUrl}
      dbId={dbUser?._id?.toString() ?? ""}
    />
  );
}
