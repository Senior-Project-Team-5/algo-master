import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { getUserAchievements, getUserInfiniteModeHistory, getUserTimedModeHistory } from "@/db/queries";
import { userInfiniteModeTable } from "@/db/schema";


interface UserRank {
  userId: string;
  userImageSrc: string;
  userName: string;
  points: number;
  position: number;
}

export default async function Dashboard() {
  const userAchievements = await getUserAchievements();
  const userInfiniteModeHistory = await getUserInfiniteModeHistory() || [];
  const userTimedModeHistory = await getUserTimedModeHistory() || [];

  // Statistics Tracking Variables
  const unitsCompleted = userAchievements?.units_completed || 0
  const numIncorrect = userAchievements?.total_incorrect || 0

  const wrong20OrMore = numIncorrect >= 20
  const wrong20OrMoreProgress = wrong20OrMore ? 100 : (numIncorrect/ 20) * 100

  const percentCorrect = Math.round((userAchievements?.total_correct ?? 0) / ((userAchievements?.total_correct ?? 0) + (userAchievements?.total_incorrect ?? 0)) * 100);


  // Roadmap Units Tracking Variables
  const quizNovice = unitsCompleted > 5
  const quizNoviceProgress = quizNovice ? 100 : (unitsCompleted/ 5) * 100

  const quizMaster = unitsCompleted > 15 
  const quizMasterProgress = quizMaster ? 100 : (unitsCompleted/ 15) * 100

  const quizExpert = unitsCompleted == 26 
  const quizExpertProgress = quizExpert ? 100 : (unitsCompleted/ 26) * 100

  // Infinite Mode Tracking Variables
  const maxCorrectI = Math.max(...userInfiniteModeHistory.map(game => game.correct_answers));

  const completeMoreThan30 = maxCorrectI >= 30;
  const completeMoreThan30Progress = completeMoreThan30 ? 100 : (maxCorrectI/ 30) * 100

  // Timed Mode Tracking Variables
  const maxCorrectT = Math.max(
    ...userTimedModeHistory
      .filter(game => game.duration === "FIVE_MINUTES")
      .map(game => game.correct_answers)
  );
  const completeMoreThan15 = maxCorrectT >= 15;
  const completeMoreThan15Progress = completeMoreThan15 ? 100 : (maxCorrectT/ 15) * 100
 

    return (
      <div className="flex flex-col md:flex-row p-6 bg-white min-h-screen">
        <div className="flex-1 p-6">
          {/* Statistics Section */}
          <h3 className="text-2xl text-[#2E588D] font-extrabold mb-4">Statistics</h3>
          <div className="gap-4 mb-6 ">
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 border-black">
              <span className="text-orange-500 text-3xl">
                <img src="percentage.png"/>
              </span>
              <div>
                <p className="text-2xl font-bold">{`${percentCorrect}%`}</p>
                <p className="text-gray-500">Percentage of Correct Answers</p>
                <p className="text-gray-500 text-sm">Total Correct: {userAchievements?.total_correct}</p>
                <p className="text-gray-500 text-sm">Total Incorrect: {userAchievements?.total_incorrect}</p>
              </div>
            </div>
            {/*
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
*/}
          </div>
  
          {/* Roadmap Achievements */}
          <h3 className="text-2xl text-[#2E588D] font-extrabold mb-4">Achievements</h3>
          <div className="overflow-y-auto">

            <div className={`bg-${quizNovice ? "green-100": "white"} p-4 rounded-lg shadow-md mb-4 flex items-center border-black`}>
              <div className="mr-4">
                  <span >
                      < img className="w-40 h-40 rounded-md" src="QuizNovice.jpg" />
                  </span>
              </div>
              <div className="flex-1">
                  <div className="flex justify-between">
                  <div>
       
                      <h4 className="font-semibold mt-1">Quiz Novice</h4>
                      <p className="text-gray-500 text-sm">Complete 5 Quizzes</p>
                  </div>
                  <p className="text-gray-500">{quizNovice ? "5/5" : `${unitsCompleted}/5`}</p>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div className="bg-[#bb6632] h-2 rounded-full" style={{ width: `${quizNoviceProgress}%` }}></div>
                  </div>
              </div>
            </div>

            <div className={`bg-${quizMaster ? "green-100": "white"} p-4 rounded-lg shadow-md mb-4 flex items-center border-black`}>
              <div className="mr-4">
                  <span >
                      < img className="w-40 h-40 rounded-md" src="QuizMaster.jpg"/>
                  </span>
              </div>
              <div className="flex-1">
                  <div className="flex justify-between">
                  <div>
                      <h4 className="font-semibold mt-1">Quiz Master</h4>
                      <p className="text-gray-500 text-sm">Complete 15 Quizzes</p>
                  </div>
                  <p className="text-gray-500">{quizMaster ? "15/15" : `${unitsCompleted}/15`}</p>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div className="bg-[#bb6632] h-2 rounded-full" style={{ width: `${quizMasterProgress}%` }}></div>
                  </div>
              </div>
            </div>
            
            <div className={`bg-${quizExpert ? "green-100": "white"} p-4 rounded-lg shadow-md mb-4 flex items-center border-black`}>
              <div className="mr-4">
                  <span >
                      < img className="w-40 h-40 rounded-md" src="QuizExpert.jpg"/>
                  </span>
              </div>
              <div className="flex-1">
                  <div className="flex justify-between">
                  <div>
                      <h4 className="font-semibold mt-1">Quiz Expert</h4>
                      <p className="text-gray-500 text-sm">Complete All Quizzes</p>
                  </div>
                  <p className="text-gray-500">{quizExpert ? "26/26" : `${unitsCompleted}/26`}</p>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div className="bg-[#bb6632] h-2 rounded-full" style={{ width: `${quizExpertProgress}%` }}></div>
                  </div>
              </div>
            </div>

            <div className={`bg-${wrong20OrMore ? "green-100": "white"} p-4 rounded-lg shadow-md mb-4 flex items-center border-black`}>
              <div className="mr-4">
                  <span >
                      < img className="w-40 h-40 rounded-md" src="SillyGoose.jpg"/>
                  </span>
              </div>
              <div className="flex-1">
                  <div className="flex justify-between">
                  <div>
                      <h4 className="font-semibold mt-1">Silly Goose</h4>
                      <p className="text-gray-500 text-sm">Answer 20 Questions Wrong</p>
                  </div>
                  <p className="text-gray-500">{wrong20OrMore ? "20/20" : `${numIncorrect}/20`}</p>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div className="bg-[#bb6632] h-2 rounded-full" style={{ width: `${wrong20OrMoreProgress}%` }}></div>
                  </div>
              </div>
            </div>

            {/* Infinite Mode Achievements*/}

            <div className={`bg-${completeMoreThan30 ? "green-100": "white"} p-4 rounded-lg shadow-md mb-4 flex items-center border-black`}>
              <div className="mr-4">
                  <span >
                      < img className="w-40 h-40 rounded-md" src="TheNile.jpg"/>
                  </span>
              </div>
              <div className="flex-1">
                  <div className="flex justify-between">
                  <div>
                      <h4 className="font-semibold mt-1">To Infinity & Beyond</h4>
                      <p className="text-gray-500 text-sm">Answer 30 Auestions Correctly in Infinite Mode</p>
                  </div>
                  <p className="text-gray-500">{completeMoreThan30 ? "30/30" : `${maxCorrectI}/30`}</p>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div className="bg-[#bb6632] h-2 rounded-full" style={{ width: `${completeMoreThan30Progress}%` }}></div>
                  </div>
              </div>
            </div>

             {/* Timed Mode Achievements*/}

             <div className={`bg-${completeMoreThan30 ? "green-100": "white"} p-4 rounded-lg shadow-md mb-4 flex items-center border-black`}>
              <div className="mr-4">
                  <span >
                      < img className="w-40 h-40 rounded-md" src="Cheetah.jpg"/>
                  </span>
              </div>
              <div className="flex-1">
                  <div className="flex justify-between">
                  <div>
                      <h4 className="font-semibold mt-1">Can't Catch Me</h4>
                      <p className="text-gray-500 text-sm">Answer 15 Questions Correctly in Timed Mode in 5 Minutes</p>
                  </div>
                  <p className="text-gray-500">{completeMoreThan30 ? "15/15" : `${maxCorrectT}/15`}</p>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div className="bg-[#bb6632] h-2 rounded-full" style={{ width: `${completeMoreThan30Progress}%` }}></div>
                  </div>
              </div>
            </div>



            {/*
      
            <div className="bg-white p-4 rounded-lg shadow-md flex item-center border-black">
              <div className="mr-4">
                  <span >
                      < img className="w-40 h-40 rounded-md" src="MVP.jpg"/>
                  </span>
              </div>
              <div className="flex-1">
                  <div className="flex justify-between">
                  <div>
                      <h4 className="font-semibold mt-1">MVP</h4>
                      <p className="text-gray-500 text-sm">End the week at the top of the leaderboard 5 times</p>
                  </div>
                  <p className="text-gray-500">0/5</p>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                      <div className="bg-[#2E588D] h-2 rounded-full" style={{ width: "0%" }}></div>
                  </div>
              </div>
            </div>*/}
            
          </div>
        </div> 
      </div>
    );
  }
  
