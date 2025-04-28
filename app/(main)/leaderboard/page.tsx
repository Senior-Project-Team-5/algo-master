"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/seperator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Trophy, Clock, Medal, Award, Crown, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface LeaderboardUser {
  userId: string;
  userName: string;
  userImageSrc: string;
  points: number;
  position: number;
}

const leaderboardTypes = [
  { id: "roadmap", name: "Roadmap Progress", icon: <Trophy className="h-5 w-5" />, label: "Sections" },
  { id: "timed-5", name: "Timed (5m)", icon: <Clock className="h-5 w-5" />, label: "Points" },
  { id: "timed-10", name: "Timed (10m)", icon: <Clock className="h-5 w-5" />, label: "Points" },
  { id: "timed-20", name: "Timed (20m)", icon: <Clock className="h-5 w-5" />, label: "Points" },
  { id: "infinite-easy", name: "Infinite Easy", icon: <Award className="h-5 w-5" />, label: "Correct Answers" },
  { id: "infinite-medium", name: "Infinite Medium", icon: <Award className="h-5 w-5" />, label: "Correct Answers" },
  { id: "infinite-hard", name: "Infinite Hard", icon: <Award className="h-5 w-5" />, label: "Correct Answers" },
  { id: "infinite-expert", name: "Infinite Expert", icon: <Crown className="h-5 w-5" />, label: "Correct Answers" },
];

const LeaderboardPage = () => {
  const [currentLeaderboardIndex, setCurrentLeaderboardIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoaded } = useUser();

  const currentLeaderboardType = leaderboardTypes[currentLeaderboardIndex];

  useEffect(() => {
    fetchLeaderboardData(currentLeaderboardType.id);
  }, [currentLeaderboardIndex]);

  const fetchLeaderboardData = async (type: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/leaderboard?type=${type}&limit=30`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      
      const data = await response.json();
      setLeaderboard(data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Could not load leaderboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentLeaderboardIndex((prev) => (prev + 1) % leaderboardTypes.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentLeaderboardIndex((prev) => (prev - 1 + leaderboardTypes.length) % leaderboardTypes.length);
  };

  const getPointsLabel = () => {
    return currentLeaderboardType.label || "Points";
  };

  const currentUserData = user && leaderboard.find(entry => entry.userId === user.id);
  const currentUserRank = currentUserData?.position || 0;

  return (
    <div className="flex flex-col items-center w-full max-w-[1000px] mx-auto">
      <div className="w-full relative">
        <div className="flex items-center justify-center gap-2 mb-4">
          {currentLeaderboardType.icon && (
            <div className="h-10 w-10 text-yellow-500 flex items-center justify-center">
              {currentLeaderboardType.icon}
            </div>
          )}
          <h1 className="text-center font-bold text-neutral-800 text-2xl">{currentLeaderboardType.name}</h1>
        </div>
        
        <p className="text-muted-foreground text-center text-lg mb-6">
          See where you stand among other learners in the community.
        </p>
        
        {/* Arrow Navigation */}
        <div className="w-full mb-8 relative">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-3xl font-bold p-4 bg-gray-200 rounded-full hover:bg-gray-300 transition-all z-10"
            aria-label="Previous leaderboard"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-3xl font-bold p-4 bg-gray-200 rounded-full hover:bg-gray-300 transition-all z-10"
            aria-label="Next leaderboard"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          {/* Leaderboard Content */}
          <div className="w-full px-16">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentLeaderboardIndex}
                initial={{ x: direction * 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction * -300, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                {loading || !isLoaded ? (
                  <div className="w-full">
                    {/* Loading state for top 3 */}
                    <div className="flex justify-center items-end gap-8 mb-8">
                      {[1, 2, 3].map((_, index) => (
                        <div key={index} className={`flex flex-col items-center ${["order-2", "order-1", "order-3"][index]}`}>
                          <Skeleton className={`rounded-full ${["h-28 w-28", "h-24 w-24", "h-20 w-20"][index]}`} />
                          <Skeleton className="h-4 w-20 mt-2" />
                          <Skeleton className="h-3 w-16 mt-1" />
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="mb-4 h-0.5 rounded-full" />
                    
                    {/* Loading state for the rest */}
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center w-full p-2 px-4 rounded-xl mb-2">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-12 w-12 rounded-full mx-4" />
                        <Skeleton className="h-4 w-32 flex-1" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center p-8">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button 
                      onClick={() => fetchLeaderboardData(currentLeaderboardType.id)} 
                      variant="outline" 
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Retry
                    </Button>
                  </div>
                ) : (
                  <div className="w-full">
                    {/* Top 3 Leaders */}
                    {leaderboard.length > 0 ? (
                      <div className="flex justify-center items-end gap-8 mb-8">
                        {leaderboard.slice(0, Math.min(3, leaderboard.length)).map((user, index) => {
                          const positionStyles = [
                            "order-2 -mb-4", // 1st place
                            "order-1 -mb-8", // 2nd place
                            "order-3 -mb-8", // 3rd place
                          ];
                          
                          const avatarStyles = [
                            "h-28 w-28 border-4 border-yellow-400", // 1st place
                            "h-24 w-24 border-4 border-gray-400", // 2nd place
                            "h-20 w-20 border-4 border-orange-700", // 3rd place
                          ];
                          
                          const medals = [
                            <div key="gold" className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-800 rounded-full p-1 shadow-md">
                              <Medal className="h-6 w-6" />
                            </div>,
                            <div key="silver" className="absolute -top-2 -right-2 bg-gray-300 text-gray-700 rounded-full p-1 shadow-md">
                              <Medal className="h-5 w-5" />
                            </div>,
                            <div key="bronze" className="absolute -top-2 -right-2 bg-orange-600 text-orange-100 rounded-full p-1 shadow-md">
                              <Medal className="h-4 w-4" />
                            </div>,
                          ];
                          
                          return (
                            <div key={user.userId} className={`flex flex-col items-center relative ${positionStyles[index]}`}>
                              <div className="relative">
                                <Avatar className={`${avatarStyles[index]} ${user?.userId === user?.id ? 'ring-2 ring-blue-500' : ''}`}>
                                  <AvatarImage className="object-cover" src={user.userImageSrc} alt={user.userName} />
                                </Avatar>
                                {medals[index]}
                              </div>
                              <p className="font-bold text-neutral-800 mt-2 truncate w-28 text-center">{user.userName}</p>
                              <p className="text-muted-foreground">{user.points} {getPointsLabel()}</p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-40">
                        <p className="text-gray-500">No data available for this leaderboard yet.</p>
                      </div>
                    )}

                    <Separator className="mb-4 h-0.5 rounded-full" />

                    {/* Rest of the Leaderboard */}
                    <div className="w-full">
                      {leaderboard.length > 3 ? (
                        leaderboard.slice(3).map((leaderboardUser, index) => (
                          <motion.div
                            key={leaderboardUser.userId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/50 transition-colors ${
                              user && leaderboardUser.userId === user.id ? "border-2 border-blue-500 bg-blue-50" : ""
                            }`}
                          >
                            <div className="w-12 font-bold text-gray-700">{index + 4}{ordinalSuffix(index + 4)}</div>
                            <Avatar className="border h-12 w-12 ml-3 mr-6">
                              <AvatarImage className="object-cover" src={leaderboardUser.userImageSrc} alt={leaderboardUser.userName} />
                            </Avatar>
                            <p className="font-bold text-neutral-800 flex-1">{leaderboardUser.userName}</p>
                            <p className="text-muted-foreground">{leaderboardUser.points} {getPointsLabel()}</p>
                          </motion.div>
                        ))
                      ) : leaderboard.length === 0 ? null : (
                        <div className="text-center p-8 text-gray-500">
                          No additional leaderboard entries available.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Current User Stats */}
        {user && currentUserData && (
          <div className="w-full max-w-md p-4 mx-auto bg-blue-50 border border-blue-200 rounded-lg shadow-sm mt-4 mb-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="border-2 border-blue-500 h-10 w-10">
                  <AvatarImage src={user.imageUrl} alt={user.fullName || user.username || "Current user"} />
                </Avatar>
                <div>
                  <p className="font-bold text-sm">Your Rank</p>
                  <p className="text-blue-700 font-medium">{currentUserRank}{ordinalSuffix(currentUserRank)} Place</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Your Score</p>
                <p className="text-xl font-bold text-blue-700">
                  {currentUserData.points} {getPointsLabel()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get ordinal suffix
function ordinalSuffix(n: number): string {
  if (n <= 0) return '';
  
  const j = n % 10;
  const k = n % 100;
  
  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }
  return 'th';
}

export default LeaderboardPage;