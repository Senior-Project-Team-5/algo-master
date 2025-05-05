import { getUserAchievements } from "@/db/queries";


// Server component to fetch and display progress bar
export default async function ProgressBar() {
  const userAchievements = await getUserAchievements(); // Get the user progress data

  const unitsCompleted = userAchievements?.units_completed || 0

  // Calculate the percentage
  const progress = (unitsCompleted / 26) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-lg h-6 overflow-hidden">
    <div
      className="bg-[#bb6632] h-full text-white text-sm font-medium flex items-center justify-center transition-all duration-300"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ width: `${progress}%` }}
    >
      {Math.round(progress)}% Complete
    </div>
  </div>
  );
}
