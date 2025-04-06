import { redirect } from "next/navigation";
import {
  getCachedUserId,
  getUserProgress,
  getTopicName,
  getOneUserProgress,
  getUserAchievements,
} from "@/db/queries";
import db from "@/db";
import { userProgressTable, userAchievementTable } from "@/db/schema";
import QuizClient from "./components/QuizClient";

export default async function TopicPage({
  params,
}: {
  params: { topic: string };
}) {
  const userId = await getCachedUserId();
  const { topic } = await params;
  const decodedTopic = decodeURIComponent(topic);

  // Get topic section from URL
  const topicSection = await getTopicName(decodedTopic);
  console.log(topicSection);

  // Get user Progress
  const userProgress = await getUserProgress();

  // Get user Achievemnt
  const userAchievement = await getUserAchievements();

  if (!userId || !topicSection || !userProgress) {
    redirect("/roadmap");
  }

  // If there's a prerequisite, check if it's completed
  // DA YUAN: Is this conditional check nececssary since user can only select units that they've completed or the next unit to be completed
  if (topicSection.prerequisite_id) {
    const prerequisiteCompleted = userProgress.some(
      (progress) =>
        progress.topic_section === topicSection.prerequisite_id &&
        progress.completed
    );

    if (!prerequisiteCompleted) {
      redirect("/roadmap");
    }
  }

  // check if the user is in-progress for this current topic quiz,
  // fetch the user progress data for this quiz section
  const quizProgress = await getOneUserProgress(topicSection.section_id);

  const topicID = topicSection.section_id;
  console.log(topicID);
  console.log(quizProgress);

  // Default points to 0
  let initialPoints = 0;
  let numCorrect = 0;
  let numIncorrect = 0;

  // if the user has not started the quiz, create a new user progress entry
  if (!quizProgress) {
    await db.insert(userProgressTable).values({
      userID: userId,
      topic_section: topicSection.section_id,
      completed: false,
      points: 0,
      num_correct: 0,
      num_incorrect: 0,
    });
    console.log(
      "New user progress entry created for quiz section",
      topicSection.section_id
    );
  } else {
    // If user has existing progress, get their points
    initialPoints = quizProgress.points;
    numCorrect = quizProgress.num_correct;
    numIncorrect = quizProgress.num_incorrect;
    console.log("User has existing progress with points:", initialPoints);
  }

  // if the user is new, create a new user achievement entry
  if (!userAchievement) {
    await db.insert(userAchievementTable).values({
      userID: userId,
      units_completed: 0,
    });
    console.log("New user achievement entry created");
  }

  // Pass both topicID and initialPoints to QuizClient
  return (
    <QuizClient
      topicParam={topic}
      topicID={topicID}
      topicCategory={topicSection.topic_category}
      initialPoints={initialPoints}
      numCorrectAnswer={numCorrect}
      numIncorrectAnswer={numIncorrect}
    />
  );
}
