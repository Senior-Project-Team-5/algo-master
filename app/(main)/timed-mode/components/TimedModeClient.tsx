"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Brain, Award } from "lucide-react";
import TimedQuiz from "./TimedQuiz";

interface TimedModeClientProps {
  hasCompletedTopics: boolean;
}

type Duration = "FIVE_MINUTES" | "TEN_MINUTES" | "TWENTY_MINUTES";

const TIME_MINUTES: Record<Duration, number> = {
  "FIVE_MINUTES": 5,
  "TEN_MINUTES": 10,
  "TWENTY_MINUTES": 20
};

const TimedModeClient: React.FC<TimedModeClientProps> = ({ hasCompletedTopics }) => {
  const [selectedDuration, setSelectedDuration] = useState<Duration | null>(null);
  const [startQuiz, setStartQuiz] = useState(false);

  if (!hasCompletedTopics) {
    return null;
  }

  if (startQuiz && selectedDuration) {
    return (
      <TimedQuiz 
        durationMinutes={TIME_MINUTES[selectedDuration]} 
        durationType={selectedDuration} 
        onExit={() => {
          setStartQuiz(false);
          setSelectedDuration(null);
        }}
      />
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-700 mb-4">
          Challenge yourself with timed quizzes on topics you've already completed in the roadmap.
          Choose a time limit and answer as many questions as you can before time runs out!
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-blue-700">
            <span className="font-bold">How it works:</span> Questions will be randomly selected from topics you've 
            already completed in the roadmap. The timer pauses during question loading.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TimedModeCard 
          title="5 Minute Sprint" 
          description="Quick challenge - perfect for a short break"
          icon={<Clock className="h-8 w-8 text-green-500" />}
          onClick={() => setSelectedDuration("FIVE_MINUTES")}
          isSelected={selectedDuration === "FIVE_MINUTES"}
        />
        
        <TimedModeCard 
          title="10 Minute Challenge" 
          description="Balanced time for focused problem solving"
          icon={<Brain className="h-8 w-8 text-blue-500" />}
          onClick={() => setSelectedDuration("TEN_MINUTES")}
          isSelected={selectedDuration === "TEN_MINUTES"}
        />
        
        <TimedModeCard 
          title="20 Minute Marathon" 
          description="Extended session for deep learning"
          icon={<Award className="h-8 w-8 text-purple-500" />}
          onClick={() => setSelectedDuration("TWENTY_MINUTES")}
          isSelected={selectedDuration === "TWENTY_MINUTES"}
        />
      </div>

      <div className="mt-8 flex justify-center">
        <Button 
          size="lg" 
          disabled={!selectedDuration}
          onClick={() => setStartQuiz(true)}
          className="px-8 py-6 text-lg"
        >
          Start Timed Quiz
        </Button>
      </div>
    </div>
  );
};

interface TimedModeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
}

const TimedModeCard: React.FC<TimedModeCardProps> = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  isSelected 
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button 
          variant={isSelected ? "default" : "primary"} 
          className="w-full"
          onClick={onClick}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TimedModeClient;