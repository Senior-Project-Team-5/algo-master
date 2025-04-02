import { redirect } from "next/navigation";
import { getCachedUserId, getUserProgress } from "@/db/queries";
import TimedModeClient from "./components/TimedModeClient";

export default async function TimedModePage() {
  const userId = await getCachedUserId();
  if (!userId) {
    redirect("/sign-in");
  }

  // Get user progress to check if they have completed topics
  const userProgress = await getUserProgress();
  
  // Check if user has completed any topics
  const hasCompletedTopics = userProgress?.some(progress => progress.completed) || false;
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Timed Mode</h1>
      {!hasCompletedTopics ? (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8">
          <p className="text-amber-700">
            <span className="font-bold">Note:</span> You need to complete at least one topic in the roadmap before attempting timed mode quizzes.
          </p>
          <a href="/roadmap" className="text-blue-600 hover:underline mt-2 inline-block">
            Go to Roadmap →
          </a>
        </div>
      ) : (
        <TimedModeClient hasCompletedTopics={hasCompletedTopics} />
      )}
    </div>
  );
}