import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import "./Quiz.css";

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

interface QuestionsProps {
  quiz: QuizItem[];
  setQuizStatus: React.Dispatch<React.SetStateAction<number>>;
}

const Quiz: React.FC<QuestionsProps> = ({ quiz, setQuizStatus }) => {
  // Question variables (on render, set these to first question)
  const [questionNumber, setQuestionNumber] = useState(1);
  const [question, setQuestion] = useState(quiz[0].question);
  const [code, setCode] = useState(quiz[0].code);
  const [choices, setChoices] = useState(quiz[0].choices);
  const [correctAnswer, setCorrectAnswer] = useState(quiz[0].answer);
  const [resources, setResources] = useState(quiz[0].resources);

  // Tracking variables
  const [isCorrect, setIsCorrect] = useState<boolean | null>();
  const [isAnswered, setIsAnswered] = useState(false);
  const [explanation, setExplanation] = useState<string | null>();

  const checkAnswer = (
    event: React.MouseEvent<HTMLButtonElement>,
    choice: string,
    explanation: string
  ) => {
    setIsAnswered(true);
    choice == correctAnswer ? setIsCorrect(true) : setIsCorrect(false);
    setExplanation(explanation);
  };

  const nextQuestion = () => {
    if (questionNumber == quiz.length) {
      setQuizStatus(2);
      return;
    }
    // Reset tracking variables
    setIsAnswered(false);
    setIsCorrect(null);
    setExplanation(null);

    // Set variables to next questions
    setQuestionNumber(questionNumber + 1);
    setQuestion(quiz[questionNumber].question);
    setCode(quiz[questionNumber].code);
    setChoices(quiz[questionNumber].choices);
    setCorrectAnswer(quiz[questionNumber].answer);
    setResources(quiz[questionNumber].resources);
  };

  return (
    <div className="question">
      <h1 className="question-question">{question}</h1>
      <div className="question-code">
        <pre>
          <code>{code}</code>
        </pre>
      </div>

      <ul>
        {choices.map((item, index) => (
          <li className="question-choice" key={index}>
            <Button
              style={{
                backgroundColor: isAnswered
                  ? item.choice == correctAnswer
                    ? "green"
                    : "red"
                  : "transparent",
                color: isAnswered ? "white" : "black",
              }}
              onClick={(event) => {
                checkAnswer(event, item.choice, item.explanation);
              }}
              disabled={isAnswered}
            >
              {item.choice}
            </Button>
          </li>
        ))}
      </ul>

      {isAnswered && (
        <div className="question-post">
          <div className="question-post-text">
            <div className="question-post-text-explanation">{explanation}</div>
            <div className="question-post-text-resources">
              <br />
              Check out these resource(s) <br />
              <a href={resources} target="_blank" style={{ color: "blue" }}>
                {resources}
              </a>
            </div>
          </div>
          <Button
            variant="primary"
            className="question-post-next"
            onClick={nextQuestion}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
