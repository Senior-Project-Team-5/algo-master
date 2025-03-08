import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";
import { Unit } from "./components/unit";
import 'bootstrap/dist/css/bootstrap.css';
import { getUserProgress } from "@/db/queries";
import React, { useState, useEffect } from "react";
import ProgressBar from "./components/ProgressBar";
import { Separator } from "@/components/ui/seperator";
import LeaderboardSnip from "./components/LeaderboardSnip";
import "../../globals.css";
// import { getTopics } from "@/db/queries";



// hard coded topic sections
const topicSections = [
    {
        id: 1,
        topic_name: "Arrays & Strings",
    },
    {
        id: 2,
        topic_name: "Hashmaps & Sets",
    },
    {
        id: 3,
        topic_name: "Stacks & Queues",
    },
    {
        id: 4,
        topic_name: "Linked Lists",
    },
    {
        id: 5,
        topic_name: "Binary Search",
    },
    {
        id: 6,
        topic_name: "Sliding Window",
    },
    {
        id: 7,
        topic_name: "Trees",
    },
    {
        id: 8,
        topic_name: "Heaps",
    },
    {
        id: 9,
        topic_name: "Backtracking",
    },
    {
        id: 10,
        topic_name: "Graphs",
    },
    {
        id: 11,
        topic_name: "Dynamic Programming",
    }
]

const HomePage = async () => {
    // const topics = await getTopics();
    const leaderboard = [
            { userId: "1", userName: "John Smith", userImageSrc: "/user2.png", points: 32 },
            { userId: "2", userName: "Jack Smith", userImageSrc: "/user3.png", points: 32 },
            { userId: "3", userName: "Mary Smith", userImageSrc: "/user1.png", points: 30 },
            { userId: "4", userName: "Michael Smith", userImageSrc: "/user4.png", points: 25 },
            { userId: "5", userName: "Jane Smith", userImageSrc: "/user5.png", points: 24 },
            { userId: "6", userName: "Me", userImageSrc: "/user6.png", points: 17 },
            { userId: "7", userName: "Lisa Smith", userImageSrc: "/user7.png", points: 16 },
            { userId: "8", userName: "May Smith", userImageSrc: "/user8.png", points: 15 },
            { userId: "9", userName: "Chris Smith", userImageSrc: "/user9.png", points: 14 },
        // Add more users as needed
      ];

    return ( 
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress 
                    activeCourse="Linked Lists"
                    points={8}
                />
                <div className="progress-sub">
                    <p className="font-bold text-progress">Your Progress</p>
                    <ProgressBar />
                </div>
                <div className="leaderboard-sub">
                    <LeaderboardSnip leaderboard={leaderboard} />
                </div>
            </StickyWrapper>

            <FeedWrapper>
                <Header title="Data Structures and Algorithms" />
                {topicSections?.map((topicSection) => (
                    <Unit key={topicSection.id} id={topicSection.id} topic_name={topicSection.topic_name} />
                ))}
            </FeedWrapper>
        </div>
     );
}

export default HomePage;
