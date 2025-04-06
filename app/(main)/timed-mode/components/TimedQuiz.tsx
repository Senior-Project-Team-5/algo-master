"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ResultsModal from "./ResultsModal";

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

interface TimedQuizProps {
  durationMinutes: number;
  durationType: "FIVE_MINUTES" | "TEN_MINUTES" | "TWENTY_MINUTES";
  onExit: () => void;
}

const TimedQuiz: React.FC<TimedQuizProps> = ({ 
  durationMinutes, 
  durationType,
  onExit 
}) => {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  
  // Question data
  const [currentQuestion, setCurrentQuestion] = useState<QuizItem | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [language, setLanguage] = useState<string>("python");
  const [topicsCovered, setTopicsCovered] = useState<string[]>([]);
  
  // Stats tracking
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [score, setScore] = useState(0);
  
  // Answer state
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  
  // Animation state
  const [showContent, setShowContent] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  
  // Timer interval ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fetchingRef = useRef<boolean>(false);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer countdown logic
  useEffect(() => {
    if (timeRemaining <= 0) {
      // Time's up - show results
      endQuiz();
      return;
    }

    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeRemaining, isPaused]);

  // Fetch first question on component mount
  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    // Prevent duplicate API calls
    if (fetchingRef.current) return;
    
    fetchingRef.current = true;
    setIsPaused(true); // Pause timer while loading
    setIsLoading(true);
    setShowLoading(true); // Show loading screen
    setShowContent(false); // Hide content during loading

    try {
      const response = await fetch("/api/timed-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch question");
      }

      const data = await response.json();
      const questionData = JSON.parse(data.answer);
      
      // Add topic to list of covered topics if not already there
      if (data.topicName && !topicsCovered.includes(data.topicName)) {
        setTopicsCovered(prev => [...prev, data.topicName]);
      }
      
      setCurrentQuestion(questionData);
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      // Hide loading and show content again
      setShowLoading(false);
      setShowContent(true);
      setIsLoading(false);
      // Resume timer after loading completes
      setIsPaused(false);
      fetchingRef.current = false;
    }
  };

  const checkAnswer = (choice: string, explanation: string) => {
    setIsAnswered(true);
    setSelectedChoice(choice);
    const correct = choice === currentQuestion?.answer;
    setIsCorrect(correct);
    setExplanation(explanation);

    // Update stats
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
      setScore(prev => prev + 1);
    } else {
      setIncorrectAnswers(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    // Animation direction for exit (going to right)
    setDirection(1);

    // Hide current content
    setShowContent(false);

    // After exit animation completes, show loading state
    setTimeout(() => {
      setShowLoading(true);
      setIsLoading(true);
      setIsPaused(true); // Pause timer while loading

      // Reset answer state
      setIsAnswered(false);
      setSelectedChoice(null);
      setIsCorrect(null);
      setExplanation(null);

      // Increment question counter
      setQuestionNumber(prev => prev + 1);

      // Animation direction for new content (coming from left)
      setDirection(-1);

      // Fetch next question
      fetchQuestion();
    }, 500);
  };

  const endQuiz = async () => {
    // Pause timer
    setIsPaused(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    try {
      // Save results to database
      await fetch("/api/timed-quiz/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          duration: durationType,
          correct_answers: correctAnswers,
          incorrect_answers: incorrectAnswers,
          points: score,
          topics_covered: topicsCovered
        }),
      });
      
      // Show results
      setShowResults(true);
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  // Animation variants
  const contentVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  const loadingVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Calculate time indicator color
  const getTimeColor = () => {
    const totalSeconds = durationMinutes * 60;
    const percentRemaining = (timeRemaining / totalSeconds) * 100;
    
    if (percentRemaining > 50) return "text-green-600";
    if (percentRemaining > 25) return "text-amber-500";
    return "text-red-600";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Results Modal */}
      {showResults && (
        <ResultsModal
          duration={durationMinutes}
          correctAnswers={correctAnswers}
          incorrectAnswers={incorrectAnswers}
          score={score}
          onClose={onExit}
        />
      )}

      {/* Quiz Header with Timer and Exit Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold">{durationMinutes} Minute Quiz</h2>
          <div className="px-3 py-1 bg-gray-100 rounded-full text-sm">
            Question {questionNumber}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`text-lg font-mono font-bold ${getTimeColor()}`}>
            <span className="inline-block mr-2">⏱️</span>
            {formatTime(timeRemaining)}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={endQuiz}
          >
            End Quiz
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-100 p-3 rounded-lg mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="text-green-600">
            <span className="font-medium">Correct:</span> {correctAnswers}
          </div>
          <div className="text-red-600">
            <span className="font-medium">Incorrect:</span> {incorrectAnswers}
          </div>
        </div>
        <div>
          <span className="font-medium">Score:</span> {score} points
        </div>
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
              <p className="text-gray-600 font-medium">
                Generating Question...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Timer is paused
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Card */}
        <AnimatePresence mode="wait" custom={direction}>
          {showContent && currentQuestion && (
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
                <h2 className="text-lg font-medium">{currentQuestion.question}</h2>
              </div>

              {/* Code Section */}
              {currentQuestion.code && (
                <div className="p-4">
                  <SyntaxHighlighter
                    language={language.toLowerCase()}
                    style={vscDarkPlus}
                    customStyle={{
                      borderRadius: "0.5rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    {currentQuestion.code}
                  </SyntaxHighlighter>
                </div>
              )}

              {/* Multiple Choice Options */}
              <div className="grid grid-cols-1 gap-4 p-4">
                {currentQuestion.choices.map((item, index) => (
                  <button
                    key={index}
                    className={`p-3 rounded-lg border text-left font-medium transition-all ${
                      isAnswered
                        ? selectedChoice === item.choice
                          ? item.choice === currentQuestion.answer
                            ? "bg-green-500 text-white border-green-600"
                            : "bg-red-500 text-white border-red-600"
                          : item.choice === currentQuestion.answer
                          ? "bg-green-500 text-white border-green-600"
                          : "bg-gray-100 border-gray-300"
                        : selectedChoice === item.choice
                        ? "bg-blue-100 border-blue-400"
                        : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                    }`}
                    onClick={() =>
                      !isAnswered && checkAnswer(item.choice, item.explanation)
                    }
                    disabled={isAnswered}
                  >
                    <div className="flex items-center">
                      {isAnswered && (
                        <span className="mr-2">
                          {item.choice === currentQuestion.answer ? (
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : selectedChoice === item.choice ? (
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
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
                {currentQuestion?.resources && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="font-medium">Resources:</p>
                    <p>
                      <a
                        href={currentQuestion.resources}
                        target="_blank"
                        className="text-blue-500 hover:underline"
                        rel="noopener noreferrer"
                      >
                        {currentQuestion.resources}
                      </a>
                    </p>
                  </div>
                )}
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

export default TimedQuiz;