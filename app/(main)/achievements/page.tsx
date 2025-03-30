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
          <div className="overflow-y-auto max-h-96">

            <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center border-black">
              <div className="mr-4">
                  <span >
                      < img className="w-40 h-40 rounded-md" src="QuizNovice.jpg" />
                  </span>
              </div>
              <div className="flex-1">
                  <div className="flex justify-between">
                  <div>
                      <span className="bg-[#2E588D] text-white text-xs px-2 py-1 rounded-md">Tier I</span>
                      <h4 className="font-semibold mt-1">Quiz Novice</h4>
                      <p className="text-gray-500 text-sm">Complete 3 Quizzes</p>
                  </div>
                  <p className="text-gray-500">2/3</p>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div className="bg-[#2E588D] h-2 rounded-full" style={{ width: "67%" }}></div>
                  </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center border-black">
              <div className="mr-4">
                  <span >
                      < img className="w-40 h-40 rounded-md" src="QuizMaster.jpg"/>
                  </span>
              </div>
              <div className="flex-1">
                  <div className="flex justify-between">
                  <div>
                      <span className="bg-[#2E588D] text-white text-xs px-2 py-1 rounded-md">Tier I</span>
                      <h4 className="font-semibold mt-1">Quiz Master</h4>
                      <p className="text-gray-500 text-sm">Complete 10 Quizzes</p>
                  </div>
                  <p className="text-gray-500">2/10</p>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div className="bg-[#2E588D] h-2 rounded-full" style={{ width: "20%" }}></div>
                  </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center border-black">
              <div className="mr-4">
                  <span >
                      < img className="w-40 h-40 rounded-md" src="QuizExpert.jpg"/>
                  </span>
              </div>
              <div className="flex-1">
                  <div className="flex justify-between">
                  <div>
                      <span className="bg-[#2E588D] text-white text-xs px-2 py-1 rounded-md">Tier I</span>
                      <h4 className="font-semibold mt-1">Quiz Expert</h4>
                      <p className="text-gray-500 text-sm">Complete 50 Quizzes</p>
                  </div>
                  <p className="text-gray-500">2/50</p>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div className="bg-[#2E588D] h-2 rounded-full" style={{ width: "4%" }}></div>
                  </div>
              </div>
            </div>
    
            <div className="bg-white p-4 rounded-lg shadow-md flex item-center border-black">
              <div className="mr-4">
                  <span >
                      < img className="w-40 h-40 rounded-md" src="Streak.jpg"/>
                  </span>
              </div>
              <div className="flex-1">
                  <div className="flex justify-between">
                  <div>
                      <span className="bg-[#2E588D] text-white text-xs px-2 py-1 rounded-md">Tier I</span>
                      <h4 className="font-semibold mt-1">The Streaker</h4>
                      <p className="text-gray-500 text-sm">Complete a Quiz 7 days in a row</p>
                  </div>
                  <p className="text-gray-500">1/7</p>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div className="bg-[#2E588D] h-2 rounded-full" style={{ width: "14%" }}></div>
                  </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex item-center border-black">
              <div className="mr-4">
                  <span >
                      < img className="w-40 h-40 rounded-md" src="Cheetah.jpg"/>
                  </span>
              </div>
              <div className="flex-1">
                  <div className="flex justify-between">
                  <div>
                      <span className="bg-[#2E588D] text-white text-xs px-2 py-1 rounded-md">Tier I</span>
                      <h4 className="font-semibold mt-1">The Cheetah</h4>
                      <p className="text-gray-500 text-sm">Answer 20 questions correctly in timed mode.</p>
                  </div>
                  <p className="text-gray-500">12/20</p>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div className="bg-[#2E588D] h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex item-center border-black">
              <div className="mr-4">
                  <span >
                      < img className="w-40 h-40 rounded-md" src="TheNile.jpg"/>
                  </span>
              </div>
              <div className="flex-1">
                  <div className="flex justify-between">
                  <div>
                      <span className="bg-[#2E588D] text-white text-xs px-2 py-1 rounded-md">Tier I</span>
                      <h4 className="font-semibold mt-1">The River Nile</h4>
                      <p className="text-gray-500 text-sm">Answer 50 questions in one infinite mode game</p>
                  </div>
                  <p className="text-gray-500">22/50</p>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div className="bg-[#2E588D] h-2 rounded-full" style={{ width: "44%" }}></div>
                  </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex item-center border-black">
              <div className="mr-4">
                  <span >
                      < img className="w-40 h-40 rounded-md" src="SillyGoose.jpg"/>
                  </span>
              </div>
              <div className="flex-1">
                  <div className="flex justify-between">
                  <div>
                      <span className="bg-[#2E588D] text-white text-xs px-2 py-1 rounded-md">Tier I</span>
                      <h4 className="font-semibold mt-1">Silly Goose</h4>
                      <p className="text-gray-500 text-sm">Answer 25 questions incorrectly</p>
                  </div>
                  <p className="text-gray-500">5/25</p>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div className="bg-[#2E588D] h-2 rounded-full" style={{ width: "20%" }}></div>
                  </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex item-center border-black">
              <div className="mr-4">
                  <span >
                      < img className="w-40 h-40 rounded-md" src="MVP.jpg"/>
                  </span>
              </div>
              <div className="flex-1">
                  <div className="flex justify-between">
                  <div>
                      <span className="bg-[#2E588D] text-white text-xs px-2 py-1 rounded-md">Tier I</span>
                      <h4 className="font-semibold mt-1">MVP</h4>
                      <p className="text-gray-500 text-sm">End the week at the top of the leaderboard 5 times</p>
                  </div>
                  <p className="text-gray-500">0/5</p>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div className="bg-[#2E588D] h-2 rounded-full" style={{ width: "0%" }}></div>
                  </div>
              </div>
            </div>
            
          </div>
        </div> 
      </div>
    );
  }
  
