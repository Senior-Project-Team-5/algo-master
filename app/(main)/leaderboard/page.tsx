"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Separator } from "@/components/ui/seperator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const LeaderboardPage = () => {
  const [currentLeaderboard, setCurrentLeaderboard] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left

  const leaderboards = [
    [
      { userId: "1", userName: "John Smith", userImageSrc: "/user2.png", points: 32 },
      { userId: "2", userName: "Jack Smith", userImageSrc: "/user3.png", points: 32 },
      { userId: "3", userName: "Mary Smith", userImageSrc: "/user1.png", points: 30 },
      { userId: "4", userName: "Michael Smith", userImageSrc: "/user4.png", points: 25 },
      { userId: "5", userName: "Jane Smith", userImageSrc: "/user5.png", points: 24 },
      { userId: "6", userName: "Me", userImageSrc: "/user6.png", points: 17 },
      { userId: "7", userName: "Lisa Smith", userImageSrc: "/user7.png", points: 16 },
      { userId: "8", userName: "May Smith", userImageSrc: "/user8.png", points: 15 },
      { userId: "9", userName: "Chris Smith", userImageSrc: "/user9.png", points: 14 },
    ],
    [
      { userId: "10", userName: "Alice Smith", userImageSrc: "/user10.png", points: 40 },
      { userId: "11", userName: "Bob Smith", userImageSrc: "/user11.png", points: 38 },
      { userId: "12", userName: "Charlie Smith", userImageSrc: "/user12.png", points: 35 },
      { userId: "13", userName: "David Smith", userImageSrc: "/user13.png", points: 30 },
      { userId: "14", userName: "Eve Smith", userImageSrc: "/user14.png", points: 28 },
      { userId: "15", userName: "Frank Smith", userImageSrc: "/user15.png", points: 25 },
      { userId: "16", userName: "Grace Smith", userImageSrc: "/user16.png", points: 20 },
      { userId: "17", userName: "Hank Smith", userImageSrc: "/user17.png", points: 18 },
      { userId: "18", userName: "Ivy Smith", userImageSrc: "/user18.png", points: 15 },
    ],
  ];

  const handleNext = () => {
    setDirection(1);
    setCurrentLeaderboard((prev) => (prev + 1) % leaderboards.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentLeaderboard((prev) => (prev - 1 + leaderboards.length) % leaderboards.length);
  };

  const leaderboard = leaderboards[currentLeaderboard];

  return (
    <div className="relative flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress activeCourse="Linked Lists" points={8} />
      </StickyWrapper>
      <FeedWrapper>
        <div className="relative w-full flex flex-col items-center">
          <Image src="/leaderboard.svg" alt="Leaderboard" height={90} width={90} />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">Leaderboard</h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            See where you stand among other learners in the community.
          </p>
          <Separator className="mb-4 h-0.5 rounded-full" />

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-3xl font-bold p-4 bg-gray-200 rounded-full hover:bg-gray-300 transition-all"
          >
            {"<"}
          </button>

          {/* Leaderboard Content with Animation */}
          <motion.div
            key={currentLeaderboard} // Key change triggers animation
            initial={{ x: direction * 200, opacity: 0 }} // Slide from left/right
            animate={{ x: 0, opacity: 1 }} // Animate to visible state
            exit={{ x: direction * -200, opacity: 0 }} // Exit smoothly
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full"
          >
            {/* Top 3 Leaders */}
            <div className="flex justify-center items-end gap-8 mb-8">
              {leaderboard.slice(0, 3).map((user, index) => {
                const sizeClasses = [
                  "h-28 w-28 border-yellow-400", // 1st place
                  "h-24 w-24 border-gray-400", // 2nd place
                  "h-20 w-20 border-orange-700", // 3rd place
                ];
                const positionClasses = [
                  "order-2 -mb-4", // 1st place
                  "order-1 -mb-8", // 2nd place
                  "order-3 -mb-8", // 3rd place
                ];
                return (
                  <div key={user.userId} className={`flex flex-col items-center ${positionClasses[index]}`}>
                    <Avatar className={`border-4 ${sizeClasses[index]}`}>
                      <AvatarImage className="object-cover" src={user.userImageSrc} />
                    </Avatar>
                    <p className="font-bold text-neutral-800 mt-2 truncate w-28 text-center">{user.userName}</p>
                    <p className="text-muted-foreground">{user.points} Q</p>
                  </div>
                );
              })}
            </div>

            <Separator className="mb-4 h-0.5 rounded-full" />

            {/* Rest of the Leaderboard */}
            <div className="w-full">
              {leaderboard.slice(3).map((user, index) => (
                <div
                  key={user.userId}
                  className={`flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/50 ${
                    user.userId === "6" ? "border-2 border-blue-500" : ""
                  }`}
                >
                  <p className="font-bold text-lime-700 mr-4">{index + 4}th</p>
                  <Avatar className="border h-12 w-12 ml-3 mr-6">
                    <AvatarImage className="object-cover" src={user.userImageSrc} />
                  </Avatar>
                  <p className="font-bold text-neutral-800 flex-1">{user.userName}</p>
                  <p className="text-muted-foreground">{user.points} Q</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-3xl font-bold p-4 bg-gray-200 rounded-full hover:bg-gray-300 transition-all"
          >
            {">"}
          </button>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LeaderboardPage;