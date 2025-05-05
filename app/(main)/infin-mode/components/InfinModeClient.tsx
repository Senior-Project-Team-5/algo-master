"use client";

import { useState} from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Brain, Award } from "lucide-react";
import InfinQuiz from "./InfinQuiz";

interface TimedModeClientProps {
  hasCompletedTopics: boolean;
}

type Difficulty = "Easy" | "Medium" | "Hard" | "Expert";

const levelTopics = {
  Easy: [
      "Arrays",
      "Strings",
      "Linked Lists",
      "Complexities",
      "Insertion Sort",
      "Selection Sort",
  ],
  Medium: [
      "Bubble Sort",
      "Merge Sort",
      "Quick Sort",
      "Binary Search",
      "Hash Tables",
      "Stacks",
      "Queues",
  ],
  Hard: [
      "Trees",
      "Heaps",
      "Graphs",
      "Breadth-First Search",
      "Depth-First Search",
      "Recursion",
  ],
  Expert: [
      "Dijkstra's Algorithm",
      "Bellman-Ford Algorithm",
      "Greedy Algorithms",
      "Topological Sort",
      "Dynamic Programming",
      "Backtracking",
  ]
}

interface InfinModeCardProps {
  title: string;
  onClick: () => void;
  isSelected: boolean;
}

const InfinModeCard: React.FC<InfinModeCardProps> = ({ 
  title, 
  onClick, 
  isSelected 
}) => {
  const topics =  levelTopics[title as keyof typeof levelTopics];
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
        </div>
      </CardHeader>
      <CardContent>
        {topics?.map((topic) => (
          <li key={topic}>{topic}</li>
         ))}
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

const TimedModeClient = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty| null>(null);
  const [startQuiz, setStartQuiz] = useState(false);

  if (startQuiz && selectedDifficulty) {
    return (
      <InfinQuiz 
        onExit={() => {
          setStartQuiz(false);
          setSelectedDifficulty(null);
        }}
        difficulty={selectedDifficulty}
      />
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-700 mb-4">
          Challenge yourself with infinite questions for various difficulties and topics.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-blue-700">
            <span className="font-bold">How it works:</span> Questions will be continously created until you decide when to quit.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfinModeCard 
          title="Easy" 
          onClick={() => setSelectedDifficulty("Easy")}
          isSelected={selectedDifficulty === "Easy"}
        />
        
        <InfinModeCard 
          title="Medium" 
          onClick={() => setSelectedDifficulty("Medium")}
          isSelected={selectedDifficulty === "Medium"}
        />
        
        <InfinModeCard 
          title="Hard" 
          onClick={() => setSelectedDifficulty("Hard")}
          isSelected={selectedDifficulty === "Hard"}
        />

        <InfinModeCard 
          title="Expert" 
          onClick={() => setSelectedDifficulty("Expert")}
          isSelected={selectedDifficulty === "Expert"}
        />
      </div>

      <div className="mt-8 flex justify-center">
        <Button 
          size="lg" 
          disabled={!selectedDifficulty}
          onClick={() => setStartQuiz(true)}
          className="px-8 py-6 text-lg"
        >
          Start Timed Quiz
        </Button>
      </div>
    </div>
  );
};


export default TimedModeClient;