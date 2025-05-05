import { getUserTimedModeHistory, getUserInfiniteModeHistory, getUserExamHistory } from "@/db/queries";
import HistoryClient from "./HistoryClient";

export default async function Page() {
  const userTimedModeHistory = await getUserTimedModeHistory() || []
  const userInfiniteModeHistory = await getUserInfiniteModeHistory() || []
  const userExamHistory = await getUserExamHistory() || []

  const updatedUserTimedModeHistory = userTimedModeHistory.map(({ duration,...rest }) => ({
    type: duration,
    mode: "Timed",
    ...rest,
  }));

  const updatedUserInfiniteModeHistory = userInfiniteModeHistory.map(({ difficulty,...rest }) => ({
    type: difficulty,
    mode: "Infinite",
    topics_covered: undefined,
    ...rest,
  }));

  const updatedUserExamHistory = userExamHistory.map(({ exam_topic, score, ...rest }) => ({
    type: exam_topic,
    mode: "Exam",
    topics_covered: undefined,
    points: score,
    ...rest,
  }));

  const userModeHistory = [...updatedUserTimedModeHistory, ...updatedUserInfiniteModeHistory, ...updatedUserExamHistory]

  return <HistoryClient userModeHistory={userModeHistory} />
}
