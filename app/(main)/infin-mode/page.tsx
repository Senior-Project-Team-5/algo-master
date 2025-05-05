import { redirect } from "next/navigation";
import { getCachedUserId, getUserProgress } from "@/db/queries";
import InfinModeClient from "./components/InfinModeClient";

export default async function InfinModePage() {
  const userId = await getCachedUserId();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl text-[#2E588D] font-bold mb-6">Infinite Mode</h1>
      <InfinModeClient />

    </div>
  );
}