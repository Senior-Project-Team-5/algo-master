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

interface QuizItem {
  question_no_code: string;
  choices: string[];
  answer: string;
  resources: string;
}

const topic: React.FC = () => {
  const { topic } = useParams<{topic : string}>(); // Get dynamic route parameter
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [startQuiz, setStartQuiz] = useState(false);

  // Function to get the quiz from GEMINI
  const fetchQuiz = async () => {
    try {
      const response = await fetch("/api/generateQuiz", {
        method: "POST",
      });
      const data = await response.json();
      const questions = JSON.parse(data.response.candidates[0].content.parts[0].text);
      console.log(questions);
      setQuiz(questions);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  // Runs immediately when the page is being rendered
  useEffect(() => {
    fetchQuiz();
  }, []);

  return (
    <>
      {!startQuiz && <div>
        <Prequiz topic={topic} />
        <Button variant="primary" onClick={() => setStartQuiz(true)}>Start </Button>
      </div>}

      {startQuiz && <Quiz quiz={quiz }/>}
    </>
  );
};

export default topic;