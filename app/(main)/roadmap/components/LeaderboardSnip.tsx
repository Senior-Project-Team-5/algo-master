import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/seperator"; // Adjust if necessary

type User = {
  userId: string;
  userName: string;
  userImageSrc: string;
  points: number;
};

const LeaderboardSnippet = ({ leaderboard }: { leaderboard: User[] }) => {
  return (
    <div className="p-4 bg-white rounded-lg w-80">
      <h2 className="mb-4 text-xl font-bold text-center text-neutral-800">Leaderboard</h2>
      <Separator className="mb-4" />
      
      {/* Scrollable List of Users */}
      <div className="overflow-y-auto max-h-80">
        {leaderboard.map((user) => (
            <div
            key={user.userId}
            className={`flex items-center gap-4 p-2 mb-2 border-2 rounded-xl ${user.userId === "6" ? "border-2 border-blue-500" : ""}`}
            >
                <Avatar className="border-2 border-yellow-500 w-14 h-14">
                <AvatarImage src={user.userImageSrc} className="object-cover" />
                </Avatar>
                <div className="flex flex-col">
                    <p className="text-xs font-semibold text-neutral-800">{user.userName}</p>
                    <p className="text-xs text-muted-foreground">{user.points} points</p>
                </div>
            </div>
        ))}
      </div>
      
      <Separator className="mt-4" />
      <div className="mt-3 text-sm text-center text-blue-500">
        <a href="/leaderboard" className="hover:underline">See Full Leaderboard</a>
      </div>
    </div>
  );
};

export default LeaderboardSnippet;
