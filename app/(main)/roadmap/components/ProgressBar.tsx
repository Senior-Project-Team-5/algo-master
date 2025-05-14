import { getUserAchievements } from "@/db/queries";


// Server component to fetch and display progress bar
export default async function ProgressBar() {
  const userAchievements = await getUserAchievements(); // Get the user progress data

  const unitsCompleted = userAchievements?.units_completed || 0

  // Calculate the percentage
  const progress = (unitsCompleted / 26) * 100;

  return (
    <div className="text-black text-sm font-medium flex flex-col items-center gap-2">
      <div className="w-full bg-gray-200 rounded-lg h-6 overflow-hidden flex items-center">
        <div
          className="bg-[#bb6632] h-full flex items-center justify-center transition-all duration-300"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: `${progress}%` }}
        >
        </div>
      </div>
      <div>{Math.round(progress)}% Complete</div>
    </div>
  );
}
