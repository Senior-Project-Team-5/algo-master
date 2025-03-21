"use client";

import { useState, useEffect, useRef } from "react";
import Prequiz from "./Prequiz/Prequiz";
import Quiz from "./Quiz/Quiz";
import { Button } from "@/components/ui/button";
import Postquiz from "./Postquiz/Postquiz";
import { topicCategoryEnum } from "@/db/schema";

interface MultipleChoice {
  choice: string;
  explanation: string;
}

interface QuizItem {
  question: string;
  choices: MultipleChoice[];
  answer: string;
  explanation: string;
  resources: string;
  code: string;
}

interface QuizClientProps {
  topicParam: string;
  topicID: string;
  topicCategory: string;
  initialPoints: number;
}

// const getCategoryEnum = (topic: string): string => {
//   // Map of topic names to category enum values
//   const topicToCategoryMap: Record<string, string> = {
//     // Arrays and Strings
//     "arrays": "ARRAYS_AND_STRINGS",
//     "strings": "ARRAYS_AND_STRINGS",
//     "two pointers": "ARRAYS_AND_STRINGS",
//     "sliding window": "ARRAYS_AND_STRINGS",
    
//     // Linked Lists
//     "linked lists": "LINKED_LISTS",
//     "linked list": "LINKED_LISTS",
    
//     // Trees and Graphs
//     "trees": "TREES_AND_GRAPHS",
//     "binary trees": "TREES_AND_GRAPHS",
//     "binary search trees": "TREES_AND_GRAPHS",
//     "graphs": "TREES_AND_GRAPHS",
//     "trie": "TREES_AND_GRAPHS",
    
//     // Recursion and Dynamic Programming
//     "recursion": "RECURSION_AND_DP",
//     "dynamic programming": "RECURSION_AND_DP",
//     "memoization": "RECURSION_AND_DP",
    
//     // Sorting and Searching
//     "sorting": "SORTING_AND_SEARCHING",
//     "searching": "SORTING_AND_SEARCHING",
//     "binary search": "SORTING_AND_SEARCHING",
    
//     // Data Structures
//     "stacks": "DATA_STRUCTURES",
//     "queues": "DATA_STRUCTURES",
//     "heaps": "DATA_STRUCTURES",
//     "hash tables": "DATA_STRUCTURES",
    
//     // Other Algorithms
//     "greedy algorithms": "OTHER_ALGORITHMS",
//     "backtracking": "OTHER_ALGORITHMS",
//   };
  
//   // Normalize the topic (lowercase, remove extra spaces)
//   const normalizedTopic = topic.toLowerCase().trim();
  
//   // Find the matching category or return default
//   for (const [key, value] of Object.entries(topicToCategoryMap)) {
//     if (normalizedTopic.includes(key)) {
//       return value;
//     }
//   }
  
//   // If no match is found, return ALL_CATEGORIES or any default category
//   return "ALL_CATEGORIES";
// };

const QuizClient: React.FC<QuizClientProps> = ({ topicParam, topicID, topicCategory, initialPoints }) => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizItem | null>(null);
  const [quizStatus, setQuizStatus] = useState<number>(0); // 0: not started, 1: start quiz, 2: ended quiz
  const [language, setLanguage] = useState<string>("python");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchingRef = useRef<boolean>(false);
  
  useEffect(() => {
    console.log("Raw topicParam:", topicParam);
    console.log("Decoded topicParam:", decodeURIComponent(topicParam));
  }, [topicParam]);

  const fetchQuestion = async () => {
    // Prevent duplicate API calls
    if (fetchingRef.current) return;
    
    fetchingRef.current = true;
    setIsLoading(true);
    
    try {
      
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          query: decodeURIComponent(topicParam), 
          language,
          category: topicCategory
        }),
      });
      
      const data = await response.json();
      const questionData = JSON.parse(data.answer);
      setCurrentQuestion(questionData);
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  };

  // Runs when language changes
  useEffect(() => {
    fetchQuestion();
  }, [language]);

  const startQuiz = () => {
    if (currentQuestion) {
      setQuizStatus(1);
    }
  };

  return (
    <>
      {quizStatus == 0 && (
        <div>
          <Prequiz topic={topicParam} />
          <Button
            disabled={isLoading}
            onClick={() => {
              if (!isLoading) {
                setCurrentQuestion(null);
                setLanguage("C++");
              }
            }}
          >
            C++
          </Button>
          <Button
            disabled={isLoading}
            onClick={() => {
              if (!isLoading) {
                setCurrentQuestion(null);
                setLanguage("Python");
              }
            }}
          >
            Python
          </Button>
          <Button
            variant="primary"
            disabled={!currentQuestion || isLoading}
            onClick={startQuiz}
          >
            {isLoading ? "Loading..." : "Start"}
          </Button>
        </div>
      )}

      {quizStatus == 1 && currentQuestion && (
        <Quiz 
          initialQuestion={currentQuestion} 
          setQuizStatus={setQuizStatus} 
          topic={topicParam}
          language={language}
          topicID={topicID}
          initialPoints={initialPoints}
        />
      )}

      {quizStatus == 2 && <Postquiz topicID={topicID} />}
    </>
  );
};

export default QuizClient;