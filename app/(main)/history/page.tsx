import { Dialog, Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { getUserTimedModeHistory, getUserInfiniteModeHistory } from "@/db/queries";

export default async function Dashboard() {

  const userTimedModeHistory = await getUserTimedModeHistory() || []
  const userInfiniteModeHistory =  await getUserInfiniteModeHistory() || []

  console.log(userInfiniteModeHistory)
  const updatedUserTimedModeHistory = userTimedModeHistory.map(({ duration,...rest }) => ({
    type: duration,
    mode: "Timed",
    ...rest,
  }));

  const updatedUserInfiniteModeHistory = userInfiniteModeHistory.map(({ difficulty,...rest }) => ({
    type: difficulty,
    mode: "Infinite",
    topics_covered: [],
    ...rest,
  }));

  const userModeHistory = [...updatedUserTimedModeHistory, ...updatedUserInfiniteModeHistory]
  console.log(userModeHistory)

  

  return (
    <div className="flex flex-col md:flex-row p-6 bg-white min-h-screen">
      <div className="flex-1 p-6">
        <h1 className="text-3xl text-[#2E588D] font-extrabold mb-4">Attempt History</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Date</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Mode</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Type</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Points</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Correct Answers</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Wrong Ansers</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Accuracy</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Topics</th>

              </tr>
            </thead>
            <tbody>
              {userModeHistory.map((task, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{task.date_taken}</td>
                  <td className="px-6 py-4 font-mono text-gray-700">{task.mode}</td>
                  <td className="px-6 py-4 font-mono text-gray-700">{task.type}</td>
                  <td className="px-6 py-4 text-gray-700">{task.points}</td>
                  <td className="px-6 py-4 text-gray-700">{task.correct_answers}</td>
                  <td className="px-6 py-4 text-gray-700">{task.incorrect_answers}</td>
                  <td className="px-6 py-4 text-gray-700">{`${task.accuracy_percentage}%`}</td>
                  {task.topics_covered != null && task.topics_covered?.map((topic, index) =>(
                    <td className="text-xs w-48 " key={index} style={{ display: "block" }}>{topic}</td>
                  ))}
      
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
              
     
    </div>
  );
}
