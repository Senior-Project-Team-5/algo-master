import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";

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

const Quiz: React.FC<QuestionsProps> = ({ 
  initialQuestion, 
  setQuizStatus, 
  topic, 
  language, 
  topicID, 
  initialPoints 
}) => {
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
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  
  // Animation state
  const [showContent, setShowContent] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  
  // Initialize score with initialPoints
  const [score, setScore] = useState(initialPoints);
  
  // Calculate progress percentage (score out of 10)
  const progressPercentage = (score / 10) * 100;
  
  useEffect(() => {
    console.log("Quiz initialized with points:", initialPoints);
  }, [initialPoints]);

  const checkAnswer = (choice: string, explanation: string) => {
    setIsAnswered(true);
    setSelectedChoice(choice);
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
      setSelectedChoice(null);
      
      // Increment question number
      setQuestionNumber(questionNumber + 1);
      
      // Animation direction for new content (coming from left)
      setDirection(-1);
      
      // Hide loading and show content again
      setShowLoading(false);
      setTimeout(() => {
        setShowContent(true);
        setIsLoading(false);
      }, 100);
    } catch (error) {
      console.error("Error fetching next question:", error);
      setShowLoading(false);
      setTimeout(() => {
        setShowContent(true);
        setIsLoading(false);
      }, 100);
    }
  };

  const nextQuestion = () => {
    if (score >= 10) {
      setQuizStatus(2);
      return;
    }
    
    // Animation direction for exit (going to right)
    setDirection(1);
    
    // Hide current content
    setShowContent(false);
    
    // After exit animation completes, show loading state
    setTimeout(() => {
      setShowLoading(true);
      setIsLoading(true);
      
      // Start fetching next question
      fetchNextQuestion();
    }, 500);
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

  // Animation variants
  const contentVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  const loadingVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-4 rounded-full bg-gray-200 h-3">
        <div 
          className="h-3 rounded-full bg-green-400 transition-all duration-500" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span className="font-medium">Question {questionNumber}</span>
          <span>{score} / 10 pts</span>
        </div>
      </div>

      {/* Quiz Header with Score and Exit Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{decodeURIComponent(topic)} Quiz</h2>
        <Button 
          variant="danger"
          className="text-sm px-4 py-1 text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-full"
          onClick={saveProgressAndExit}
        >
          Exit Quiz
        </Button>
      </div>
      
      {/* Content Container with Animation Wrapper */}
      <div className="relative min-h-[400px]">
        {/* Loading State */}
        <AnimatePresence>
          {showLoading && (
            <motion.div 
              className="absolute inset-0 flex flex-col justify-center items-center bg-white shadow-lg rounded-lg p-12 z-10"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={loadingVariants}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600 font-medium">Generating Question...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Card */}
        <AnimatePresence mode="wait" custom={direction}>
          {showContent && (
            <motion.div 
              className="bg-white shadow-lg rounded-lg overflow-hidden mb-6"
              key={questionNumber}
              custom={direction}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={contentVariants}
            >
              <div className="bg-gray-100 p-4 border-b">
                <h2 className="text-lg font-medium">{question}</h2>
              </div>
              
              {/* Code Section */}
              {code && (
                <div className="p-4">
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

              {/* Multiple Choice Options */}
              <div className="grid grid-cols-1 gap-4 p-4">
                {choices.map((item, index) => (
                  <button
                    key={index}
                    className={`p-3 rounded-lg border text-left font-medium transition-all ${
                      isAnswered 
                        ? selectedChoice === item.choice
                          ? item.choice === correctAnswer
                            ? "bg-green-500 text-white border-green-600"
                            : "bg-red-500 text-white border-red-600"
                          : item.choice === correctAnswer
                            ? "bg-green-500 text-white border-green-600"
                            : "bg-gray-100 border-gray-300"
                        : selectedChoice === item.choice
                          ? "bg-blue-100 border-blue-400"
                          : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                    }`}
                    onClick={() => !isAnswered && checkAnswer(item.choice, item.explanation)}
                    disabled={isAnswered}
                  >
                    <div className="flex items-center">
                      {isAnswered && (
                        <span className="mr-2">
                          {item.choice === correctAnswer ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : selectedChoice === item.choice ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          ) : null}
                        </span>
                      )}
                      {item.choice}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Explanation Card (only visible after submission) */}
        <AnimatePresence mode="wait" custom={direction}>
          {showContent && isAnswered && explanation && (
            <motion.div 
              className="bg-white shadow-lg rounded-lg overflow-hidden mb-6"
              key={`explanation-${questionNumber}`}
              custom={direction}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={contentVariants}
            >
              <div className="bg-gray-100 p-4 border-b">
                <h2 className="text-lg font-medium">Explanation</h2>
              </div>
              <div className="p-4">
                <p className="mb-4">{explanation}</p>
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-medium">Resources:</p>
                  <p>
                    <a href={resources} target="_blank" className="text-blue-500 hover:underline">
                      {resources}
                    </a>
                  </p>
                </div>
                <div className="mt-6 text-center">
                  <button 
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-colors"
                    onClick={nextQuestion}
                  >
                    Next Question
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;