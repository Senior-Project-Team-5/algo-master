"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PostquizProps {
  topicID: string;
}

const Postquiz: React.FC<PostquizProps> = ({ topicID }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Call API to mark quiz as completed
      const response = await fetch("/api/quiz/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          score: 10,
          topicID,
          completed: true
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to mark quiz as completed");
      }
      
      // Redirect to roadmap
      router.push("/roadmap");
    } catch (error) {
      console.error("Error completing quiz:", error);
      router.push("/roadmap");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="postquiz-container">
      <h1>
        Congratulations! You've completed the quiz
      </h1>
      <p>You've reached the goal of 10 points.</p>
      
      <Button 
        onClick={handleComplete}
        disabled={isLoading}
        className="return-link"
        variant={isLoading ? "secondary" : "primary"}
      >
        {isLoading ? "Saving progress..." : "Return to Roadmap"}
      </Button>
    </div>
  );
};

export default Postquiz;
