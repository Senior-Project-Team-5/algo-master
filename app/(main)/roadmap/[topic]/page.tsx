/*
    There are 2 different ways that we can handle the PreQuiz and Quiz routes:
    1) Have the PreQuiz and Quiz be separate routes
    Ex: /roadmap/[topic]/prequiz/quiz
        - The drawback behind this is that we need to transfer the quiz between these 2 pages since the quiz is generated in /roadmap/[topic] 
        - We would need to utilize query parameters (which is not not efficient since the quiz is very big), or more tech like LocalStorage or React Context (which adds complexity)
    
    2) Have the PreQuiz and Quiz be in the same route
    Ex: /roadmap/[topic] will contain both the PreQuiz and the Quiz
        - This is the solution that was implemented
        - The decision behind this is that it makes it easy to transfer the quiz between the PreQuiz and Quiz through React Props and it reduces the number of pages

    This page currently functions in the following manner:
    1) Fetch the quiz from GEMINI as the page is being rendered (through useEffect)
    2) Initially display the PreQuiz which contains the prompts
    3) User clicks on Start (WARNING: Needs to be error handled to force user to wait until the quiz has been obtained)
    4) After user clicks on start, switch from the PreQuiz component to the Quiz component
    5) Display the first question 
    6) User clicks on Next
    7) Display the next questions

    NEEDS TO BE DONE:
    1) Keep track of score
    2) Have the user be able to click on an answer
    3) Hide the correct answer and reveal it afer a user selects an answer
    4) Improve the API call so that the code is separate from the question
    5) Keep track of end of quiz
*/
"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Prequiz from "./components/Prequiz/Prequiz";
import Quiz from "./components/quiz/Quiz";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Postquiz from "./components/Postquiz/Postquiz";

interface MultipleChoice {
  choice: string;
  explanation: string;
}

interface QuizItem {
  question: string;
  choices: MultipleChoice[];
  answer: string;
  resources: string;
  code: string;
}

const topic: React.FC = () => {
  const { topic } = useParams<{ topic: string }>(); // Get dynamic route parameter
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [quizStatus, setQuizStatus] = useState<number>(0); // 0: not started, 1: start quiz, 2: ended quiz
  const [language, setLanguage] = useState<string>("python");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchingRef = useRef<boolean>(false);

  // Function to get the quiz from GEMINI
  const fetchQuiz = async () => {
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
        body: JSON.stringify({ query: decodeURI(topic), language }),
      });
      const data = await response.json();
      const questions = JSON.parse(data.answer);
      setQuiz(questions);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  };

  // Runs when language changes
  useEffect(() => {
    fetchQuiz();
  }, [language]);

  return (
    <>
      {quizStatus == 0 && (
        <div>
          <Prequiz topic={topic} />
          <Button
            disabled={isLoading}
            onClick={() => {
              if (!isLoading) {
                setQuiz([]);
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
                setQuiz([]);
                setLanguage("Python");
              }
            }}
          >
            Python
          </Button>
          <Button
            variant="primary"
            disabled={quiz.length == 0 || isLoading}
            onClick={() => setQuizStatus(1)}
          >
            {isLoading ? "Loading..." : "Start"}
          </Button>
        </div>
      )}

      {quizStatus == 1 && <Quiz quiz={quiz} setQuizStatus={setQuizStatus} />}

      {quizStatus == 2 && <Postquiz />}
    </>
  );
};

export default topic;
