import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import "./Quiz.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useRouter } from "next/navigation";

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

interface QuestionsProps {
  initialQuestion: QuizItem;
  setQuizStatus: React.Dispatch<React.SetStateAction<number>>;
  topic: string;
  language: string;
  topicID: string;
  initialPoints: number;
}

const Quiz: React.FC<QuestionsProps> = ({ initialQuestion, setQuizStatus, topic, language, topicID, initialPoints }) => {
  const router = useRouter();
  // Question variables
  const [questionNumber, setQuestionNumber] = useState(1);
  const [question, setQuestion] = useState(initialQuestion.question);
  const [code, setCode] = useState(initialQuestion.code);
  const [choices, setChoices] = useState(initialQuestion.choices);
  const [correctAnswer, setCorrectAnswer] = useState(initialQuestion.answer);
  
  const [resources, setResources] = useState(initialQuestion.resources);

  // Tracking variables
  const [isCorrect, setIsCorrect] = useState<boolean | null>();
  const [isAnswered, setIsAnswered] = useState(false);
  const [explanation, setExplanation] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize score with initialPoints instead of 0
  const [score, setScore] = useState(initialPoints);
  
  // Log initial points for debugging
  useEffect(() => {
    console.log("Quiz initialized with points:", initialPoints);
  }, [initialPoints]);

  const checkAnswer = (
    event: React.MouseEvent<HTMLButtonElement>,
    choice: string,
    explanation: string
  ) => {
    setIsAnswered(true);
    const correct = choice === correctAnswer;
    console.log("Correct answer:", correctAnswer, "User choice:", choice, "Is correct:", correct);
    setIsCorrect(correct);
    setExplanation(explanation);
    
    // Update score: +1 for correct, -1 for incorrect, keep between 0 and 10
    if (correct) {
      setScore(Math.min(score + 1, 10)); // Add 1 point but don't exceed 10
    } else {
      setScore(Math.max(score - 1, 0)); // Subtract 1 point but don't go below 0
    }
  };

  const fetchNextQuestion = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: decodeURIComponent(topic), language }),
      });
      
      const data = await response.json();
      const nextQuestion = JSON.parse(data.answer);
      
      // Set variables to next question
      setQuestion(nextQuestion.question);
      setCode(nextQuestion.code || "");
      setChoices(nextQuestion.choices);
      setCorrectAnswer(nextQuestion.answer);
      setResources(nextQuestion.resources);
      
      // Reset tracking variables
      setIsAnswered(false);
      setIsCorrect(null);
      setExplanation(null);
      
      // Increment question number
      setQuestionNumber(questionNumber + 1);
    } catch (error) {
      console.error("Error fetching next question:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = () => {
    if (score >= 10) {
      setQuizStatus(2);
      return;
    }
    
    fetchNextQuestion();
  };

  const saveProgressAndExit = async () => {
    try {
      // Save progress via API
      const response = await fetch("/api/quiz/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          score,
          topicID
        }),
      });
      
      const data = await response.json();
      console.log(data);

      // Redirect to roadmap
      router.push("/roadmap");
    } catch (error) {
      console.error("Error saving progress:", error);
      router.push("/roadmap");
    }
  };

  return (
    <div className="question">
      <div className="quiz-header">
        <h2 className="score-indicator">Score: {score}/10</h2>
        <Button 
          variant="danger" 
          className="exit-button"
          onClick={saveProgressAndExit}
        >
          Exit Quiz
        </Button>
      </div>
      <h3 className="question-number">Question {questionNumber}</h3>
      <h1 className="question-question">{question}</h1>
      
      {code && (
        <div className="my-4">
          <SyntaxHighlighter
            language={language.toLowerCase()}
            style={vscDarkPlus}
            customStyle={{
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
          }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      )}

      {isLoading ? (
        <div className="loading">
          <p>Loading next question...</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default Quiz;
