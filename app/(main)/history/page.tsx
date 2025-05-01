import { getUserTimedModeHistory, getUserInfiniteModeHistory } from "@/db/queries";
import HistoryClient from "./HistoryClient";

export default async function Page() {
  const userTimedModeHistory = await getUserTimedModeHistory() || []
  const userInfiniteModeHistory = await getUserInfiniteModeHistory() || []

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

  const userModeHistory = [...updatedUserTimedModeHistory, ...updatedUserInfiniteModeHistory]

  return <HistoryClient userModeHistory={userModeHistory} />
}
