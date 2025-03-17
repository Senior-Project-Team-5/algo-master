"use client";

import { useState, useEffect, useRef } from "react";
import Prequiz from "./Prequiz/Prequiz";
import Quiz from "./Quiz/Quiz";
import { Button } from "@/components/ui/button";
import Postquiz from "./Postquiz/Postquiz";

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
  initialPoints: number;
}

const QuizClient: React.FC<QuizClientProps> = ({ topicParam, topicID, initialPoints }) => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizItem | null>(null);
  const [quizStatus, setQuizStatus] = useState<number>(0); // 0: not started, 1: start quiz, 2: ended quiz
  const [language, setLanguage] = useState<string>("python");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchingRef = useRef<boolean>(false);

  // Function to get a single quiz question from GEMINI
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
        body: JSON.stringify({ query: decodeURIComponent(topicParam), language }),
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

      {quizStatus == 2 && <Postquiz />}
    </>
  );
};

export default QuizClient;
