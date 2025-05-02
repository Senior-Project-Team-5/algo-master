"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/seperator";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy } from "lucide-react";

interface LeaderboardUser {
  userId: string;
  userName: string;
  userImageSrc: string;
  points: number;
}

const LeaderboardSnippet = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // Only fetch roadmap leaderboard data
        const response = await fetch("/api/leaderboard?type=roadmap&limit=5");
        
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        
        const data = await response.json();
        setLeaderboard(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg w-80">
        <h2 className="mb-4 text-xl font-bold text-center text-neutral-800 flex items-center justify-center">
          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
          Roadmap Progress
        </h2>
        <Separator className="mb-4" />
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-2">
              <Skeleton className="w-10 h-6" />
              <Skeleton className="w-14 h-14 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg w-80">
      <h2 className="mb-4 text-xl font-bold text-center text-neutral-800 flex items-center justify-center">
        <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
        Roadmap Progress
      </h2>
      <Separator className="mb-4" />
      
      {/* Scrollable List of Users */}
      <div className="overflow-y-auto max-h-80">
        {leaderboard.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No data available</div>
        ) : (
          leaderboard.map((leaderboardUser, index) => (
            <div
              key={leaderboardUser.userId}
              className={`flex items-center gap-3 p-2 mb-2 rounded-xl hover:bg-gray-50 transition-colors ${
                user && leaderboardUser.userId === user.id ? "border-2 border-blue-500 bg-blue-50" : ""
              }`}
            >
              <div className="font-bold text-gray-700 text-sm w-5">{index + 1}</div>
              <Avatar className="border-2 border-yellow-500 w-14 h-14">
                <AvatarImage src={leaderboardUser.userImageSrc} className="object-cover" alt={leaderboardUser.userName} />
              </Avatar>
              <div className="flex flex-col">
                <p className="text-xs font-semibold text-neutral-800">{leaderboardUser.userName}</p>
                <p className="text-xs text-muted-foreground">{leaderboardUser.points} sections completed</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <Separator className="mt-4" />
      <div className="mt-3 text-sm text-center text-blue-500">
        <a href="/leaderboard" className="hover:underline">See Full Leaderboard</a>
      </div>
    </div>
  );
};

export default LeaderboardSnippet;