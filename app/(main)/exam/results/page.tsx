"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Trophy, ArrowRight, Home, RotateCcw, Award, CheckCircle, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const ExamResultsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const score = parseInt(searchParams.get('score') || '0');
  const total = parseInt(searchParams.get('total') || '100');
  const topic = searchParams.get('topic');
  const correct = parseInt(searchParams.get('correct') || '0');
  const incorrect = parseInt(searchParams.get('incorrect') || '0');
  const passed = searchParams.get('passed') === 'true';
  
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);
    
    // Fire confetti if user passed
    if (passed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [passed]);

  const formatTopicName = (topicStr: string | null) => {
    if (!topicStr) return "Exam";
    
    return topicStr
      .replace(/_/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getGrade = () => {
    const percentage = (score / total) * 100;
    
    if (percentage >= 90) return { letter: 'A', text: 'Excellent!' };
    if (percentage >= 80) return { letter: 'B', text: 'Very Good!' };
    if (percentage >= 70) return { letter: 'C', text: 'Good' };
    if (percentage >= 60) return { letter: 'D', text: 'Satisfactory' };
    return { letter: 'F', text: 'Needs Improvement' };
  };

  const getMessage = () => {
    if (passed) {
      if (correct === 10) return "Perfect score! You've mastered this topic completely!";
      if (correct >= 9) return "Outstanding work! You've mastered this topic!";
      if (correct >= 8) return "Great job! You have a strong understanding of the material.";
      return "Well done! You've passed the exam.";
    } else {
      if (correct === 6) return "So close! With a bit more practice, you'll pass next time.";
      if (correct >= 4) return "Keep practicing! You're on the right track.";
      return "More review needed. Don't give up!";
    }
  };

  const grade = getGrade();
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden">
          <div className={`${passed ? 'bg-gradient-to-r from-green-500 to-blue-600' : 'bg-gradient-to-r from-orange-500 to-red-600'} p-6 text-white text-center relative`}>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 rounded-full p-4 border-4 border-white">
              {passed ? (
                <Trophy className="h-8 w-8 text-yellow-800" />
              ) : (
                <Award className="h-8 w-8 text-yellow-800" />
              )}
            </div>
            <h2 className="text-2xl font-bold mb-1">Exam Results</h2>
            <p className="mb-2">{formatTopicName(topic)}</p>
            <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full ${passed ? 'bg-green-600' : 'bg-red-600'} text-white font-bold`}>
              {passed ? (
                <>
                  <CheckCircle className="h-4 w-4" /> PASSED
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" /> FAILED
                </>
              )}
            </div>
            <p className="mt-2 text-sm">{passed ? 'You answered 7 or more questions correctly' : 'You need at least 7 correct answers to pass'}</p>
          </div>
          
          <div className="pt-12 pb-4 px-6 text-center">
            <h3 className="text-center text-lg font-medium text-gray-700 mb-6">
              {getMessage()}
            </h3>
            
            <div className="flex justify-center mb-8">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
                <div>
                  <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>{correct}/{incorrect + correct}</div>
                  <div className="text-sm text-gray-500">correct answers</div>
                </div>
              </div>
            </div>
            
            <div className="mb-8 text-center">
              <h4 className="text-xl font-bold mb-2">
                <span className={passed ? 'text-green-600' : 'text-red-600'}>{score}</span> / {total}
              </h4>
              <p className="text-gray-500">points earned</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="text-sm text-gray-600 mb-2">Performance Summary</div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${passed ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gradient-to-r from-orange-400 to-red-500'}`}
                  style={{ width: `${(score/total) * 100}%` }}
                >
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>0%</span>
                <span>{Math.round((score/total) * 100)}%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-4 mt-6">
              <Button 
                variant="primary"
                onClick={() => router.push('/exam')}
                className="flex items-center"
              >
                <Home className="mr-2 h-4 w-4" />
                Back to Topics
              </Button>
              
              <Button 
                variant="primary"
                onClick={() => {
                  // Retry exam with the same topic
                  if (topic) {
                    router.push(`/exam/quiz?topic=${topic}`);
                  } else {
                    router.push('/exam');
                  }
                }}
                className="flex items-center"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retry Exam
              </Button>
              
              <Button 
                variant="default"
                onClick={() => router.push('/roadmap')}
                className="flex items-center"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Continue Learning
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ExamResultsPage;