import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";

export default function Dashboard() {
    return (
      <div className="flex flex-col md:flex-row p-6 bg-white min-h-screen">
        {/* Sidebar */}
        <div className="w-full height:100vh md:w-1/4 p-4 bg-gray-100 rounded-2xl shadow-md">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xl text-black font-bold">Me</span>
            </div>
            <h2 className="text-3xl text-black font-extrabold mt-2">Me</h2>
            <p className="text-black">Joined December 2024</p>
          </div>
        </div>
  

        <div className="flex-1 p-6">
          {/* Statistics Section */}
          <h3 className="text-2xl text-[#2E588D] font-extrabold mb-4">Statistics</h3>
          <div className="grid grid-cols-2 gap-4 mb-6 ">
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 border-black">
              <span className="text-orange-500 text-3xl">
                <img src="Fire.png"/>
              </span>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-gray-500">Day Streak</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 border-black">
              <span className="text-yellow-500 text-3xl">
              < img src="Trophy.png"/>
              </span>
              <div>
                <p className="text-2xl font-bold">7th</p>
                <p className="text-gray-500">Highest Rank</p>
              </div>
            </div>
          </div>
  
          {/* Achievements Section */}
          <h3 className="text-2xl text-[#2E588D] font-extrabold mb-4">Achievements</h3>
  
          <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center border-black">
            <div className="mr-4">
                <span >
                    < img src="QuizMaster.png"/>
                </span>
            </div>
            <div className="flex-1">
                <div className="flex justify-between">
                <div>
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-md">Tier I</span>
                    <h4 className="font-semibold mt-1">Quiz Master</h4>
                    <p className="text-gray-500 text-sm">Complete 3 Quizzes</p>
                </div>
                <p className="text-gray-500">2/3</p>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "67%" }}></div>
                </div>
            </div>
          </div>
  
          <div className="bg-white p-4 rounded-lg shadow-md flex item-center border-black">
            <div className="mr-4">
                <span >
                    < img src="Streak.png"/>
                </span>
            </div>
            <div className="flex-1">
                <div className="flex justify-between">
                <div>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-md">Tier I</span>
                    <h4 className="font-semibold mt-1">The Streaker</h4>
                    <p className="text-gray-500 text-sm">Complete a Quiz 3 days in a row</p>
                </div>
                <p className="text-gray-500">1/3</p>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: "33%" }}></div>
                </div>
            </div>
          </div>
        </div> 
      </div>
    );
  }
  
