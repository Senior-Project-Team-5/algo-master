import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { getUserAchievements } from "@/db/queries";

export default async function Dashboard() {
    {/* insert constants, data: mode (timed or infinite), section id, section name, completion status
        completion status could be how many questions they got wrong or right 
        --> in timed mode, how many questions completed
        --> in infinite mode, how long they take the quiz and how many questions completed*/}
    
    const tasks = [
        { mode: "Timed", section_id: "1.1", section_name: "Introduction to Strings & Arrays", duration: "15 mins", progress: "15 questions completed" },
        { mode: "Infinite", section_id: "1.3", section_name: "Array & String Coding Algorithms", duration: "1 hr", progress: "32 questions completed" },
        { mode: "Infinite", section_id: "1.3", section_name: "Array & String Coding Algorithms", duration: "18 mins", progress: "12 questions completed" },
        { mode: "Infinite", section_id: "1.3", section_name: "Array & String Coding Algorithms", duration: "20 mins", progress: "12 questions completed" },
        { mode: "Timed", section_id: "1.2", section_name: "Array & String Manipulation", duration: "15 mins", progress: "12 questions completed" },
        { mode: "Timed", section_id: "1.2", section_name: "Array & String Manipulation", duration: "15 mins", progress: "18 questions completed" },
        { mode: "Infinite", section_id: "1.3", section_name: "Array & String Coding Algorithms", duration: "30 mins", progress: "25 questions completed" },
        { mode: "Infinite", section_id: "1.3", section_name: "Array & String Coding Algorithms", duration: "40 mins", progress: "27 questions completed" },
        
     ];
    
    return (
      <div className="flex flex-col md:flex-row p-6 bg-white min-h-screen">
        <div className="flex-1 p-6">
          <div>
            <h1 className="text-3xl text-[#2E588D] font-extrabold mb-4">Attempt History</h1>
            <img/>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                    <tr className="bg-gray-100 border-b">
                    <th className="px-6 py-3 text-left text-gray-600 font-medium">Game Mode</th>
                    <th className="px-6 py-3 text-left text-gray-600 font-medium">Topic Number</th>
                    <th className="px-6 py-3 text-left text-gray-600 font-medium">Topic</th>
                    <th className="px-6 py-3 text-left text-gray-600 font-medium">Duration</th>
                    <th className="px-6 py-3 text-left text-gray-600 font-medium">Progress</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-gray-700">{task.mode}</td>
                        <td className="px-6 py-4 text-gray-700">{task.section_id}</td>
                        <td className="px-6 py-4 text-gray-700">{task.section_name}</td>
                        <td className="px-6 py-4 text-gray-700">{task.duration}</td>
                        <td className="px-6 py-4">
                            <span className="px-3 py-1 text-white bg-[#BA6532] rounded-full">{task.progress}</span>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
          </div>
        </div> 
      </div>
    );
  }
