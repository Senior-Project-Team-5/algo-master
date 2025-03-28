'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Choice {
  choice: string;
  explanation: string;
}

interface QuestionData {
  question: string;
  code?: string;
  choices: Choice[];
  answer: string;
  explanation: string;
  resources: string;
}

const InfiniteQuizPage = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const difficulty = searchParams.get('difficulty') || '';
  const topicsParam = searchParams.get('topics') || '';
  const topics = topicsParam.split(',');
  const language = searchParams.get('language') || 'python';

  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState({ points: 0, correct: 0, incorrect: 0 });
  const initialFetchDone = useRef(false);

  const checkAnswer = (choice: string) => {
    if (selectedAnswer) return; // Prevent multiple selections

    setSelectedAnswer(choice);
    setShowExplanation(true);

    const isCorrect = choice.charAt(0) === currentQuestion?.answer.charAt(0);
    if (isCorrect) {
      setScore(prev => ({
        ...prev,
        correct: prev.correct + 1,
        points: prev.points + 1
      }));
    } else {
      setScore(prev => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        points: Math.max(prev.points - 1, 0) // Subtract 1 point but don't go below 0
      }));
    }
  }

  const fetchQuestion = async () => {
    setLoading(true);
    setSelectedAnswer(null);
    setShowExplanation(false);

    try {
      // Choose a random topic from the list
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: randomTopic,
          language: language,
          category: randomTopic,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch question');
      }

      const data = await response.json();
      
      // Parse the response which contains stringified JSON
      const parsedData = JSON.parse(data.answer);
      
      setCurrentQuestion(parsedData);
    } catch (err) {
      console.error('Error fetching question:', err);
      setError('Failed to load question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we haven't already done the initial fetch
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchQuestion();
    }
  }, []);

  const handleNextQuestion = () => {
    fetchQuestion();
  };


  const saveProgressAndExit = async () => {
    try {
        const response = await fetch("/api/infinite-mode/progress", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                points: score.points,
                difficulty: difficulty,
                correct: score.correct,
                incorrect: score.incorrect,
            }),
        });

        if (!response.ok) {
            console.log("API Fetch Failed to save progress");
            throw new Error("API Fetch Failed to save progress");
        }

        router.push("/infinite-mode");

    } catch (error) {
        console.log("Error saving user infinite mode progress:", error);
        router.push("/infinite-mode");
    }
  }


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={fetchQuestion}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
        <Link href="/infinite-mode" className="mt-4 text-blue-500 hover:underline">
          Back to Infinite Mode
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{difficulty} Mode</h1>
          <div className="text-right">
            <div className="font-semibold">Score</div>
            <div className="text-xl">{score.points}</div>
            <div className="text-green-500">Correct: {score.correct}</div>
            <div className="text-red-500">Incorrect: {score.incorrect}</div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">{currentQuestion?.question}</h2>
            
            {currentQuestion?.code && (
              <div className="text-white p-4 rounded-md mb-6 overflow-x-auto">
                <SyntaxHighlighter
                    language={language}
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
            
            <div className="space-y-4 mb-6">
              {currentQuestion?.choices.map((choice, index) => (
                <div 
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 
                    ${selectedAnswer === choice.choice 
                      ? (choice.choice.charAt(0) === currentQuestion.answer.charAt(0) 
                        ? 'bg-green-100 border-green-500' 
                        : 'bg-red-100 border-red-500')
                      : 'hover:bg-gray-50'
                    }
                    ${showExplanation && choice.choice.charAt(0) === currentQuestion.answer.charAt(0) 
                      ? 'bg-green-100 border-green-500' : ''
                    }
                  `}
                  onClick={() => checkAnswer(choice.choice)}
                >
                  <div className="font-medium">{choice.choice}</div>
                  {showExplanation && (
                    <div className={`mt-2 text-sm ${choice.choice.charAt(0) === currentQuestion.answer.charAt(0) ? 'text-green-700' : 'text-red-700'}`}>
                      {choice.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {showExplanation && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Explanation:</h3>
                <div className="text-gray-700">{currentQuestion?.explanation}</div>
                
                {currentQuestion?.resources && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Resources:</h3>
                    <a 
                      href={currentQuestion.resources} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Learn more
                    </a>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-between">
              {/* <Link href="/infinite-mode" className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                Exit Quiz
              </Link> */}
              <Button variant="default" onClick={saveProgressAndExit} className='px-4 py-2'>
                Exit Quiz
              </Button>
              {showExplanation && (
                <button 
                  onClick={handleNextQuestion}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Next Question
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfiniteQuizPage;
