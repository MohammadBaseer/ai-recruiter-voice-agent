import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncUser } from "@/lib/actions/syncUser";
import CandidatesClient from "./CandidatesClient";

export default async function CandidatesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const dbUser = await syncUser();
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
    <CandidatesClient
      firstName={firstName}
      lastName={lastName}
      email={email}
      imageUrl={imageUrl}
    />
  );
}
