import { getUserProgress } from "@/db/queries";
import 'bootstrap/dist/css/bootstrap.css';

// Server component to fetch and display progress bar
export default async function ProgressBar() {
  const data = await getUserProgress(); // Get the user progress data

  if (!data || data.length === 0) {
    return <div>Loading...</div>; // or a custom error message
  }

  const totalLessons = data.length; // Total number of lessons
  const completedLessons = data.filter((lesson) => lesson.completed).length; // Number of completed lessons

  // Calculate the percentage
  const progress = (completedLessons / totalLessons) * 100;

  return (
    <div className="progress">
      <div
        className="progress-bar progress-bar-warning progress-bar-striped"
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
