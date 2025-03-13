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
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Prequiz from "./components/Prequiz/Prequiz";
import Quiz from "./components/Quiz/Quiz";
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

  // Function to get the quiz from GEMINI
  const fetchQuiz = async () => {
    try {
      const response = await fetch("/api/generateQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language }),
      });
      const data = await response.json();
      const questions = JSON.parse(
        data.response.candidates[0].content.parts[0].text
      );
      console.log(questions);
      setQuiz(questions);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  // Runs immediately when the page is being rendered
  useEffect(() => {
    fetchQuiz();
  }, [language]);

  return (
    <>
      {quizStatus == 0 && (
        <div>
          <Prequiz topic={topic} />
          <Button
            disabled={quiz.length == 0}
            onClick={() => {
              setQuiz([]);
              setLanguage("C++");
            }}
          >
            C++
          </Button>
          <Button
            disabled={quiz.length == 0}
            onClick={() => {
              setQuiz([]);
              setLanguage("Python");
            }}
          >
            Python
          </Button>
          <Button
            variant="primary"
            disabled={quiz.length == 0}
            onClick={() => setQuizStatus(1)}
          >
            Start{" "}
          </Button>
        </div>
      )}

      {quizStatus == 1 && <Quiz quiz={quiz} setQuizStatus={setQuizStatus} />}

      {quizStatus == 2 && <Postquiz />}
    </>
  );
};

export default topic;
