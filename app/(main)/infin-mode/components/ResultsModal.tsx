"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Trophy, Clock, Check, X, ArrowUpRight, Zap } from "lucide-react";
import confetti from "canvas-confetti";

interface ResultsModalProps {
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  onClose: () => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({
  correctAnswers,
  incorrectAnswers,
  score,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);
    
    // Fire confetti if score is good
    const totalQuestions = correctAnswers + incorrectAnswers;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    if (correctAnswers >= 5 || accuracy >= 70) {
      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    // Disable scrolling on body
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Re-enable scrolling
      document.body.style.overflow = 'auto';
    };
  }, [correctAnswers, incorrectAnswers]);
  
  // Calculate stats
  const totalQuestions = correctAnswers + incorrectAnswers;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  // Generate a message based on performance
  const getMessage = () => {
    if (totalQuestions === 0) return "Try again to see how many questions you can answer!";
    
    if (accuracy >= 90) return "Incredible performance! Your DSA skills are exceptional!";
    if (accuracy >= 75) return "Great job! You have a solid understanding of these topics.";
    if (accuracy >= 60) return "Good work! Keep practicing to improve your accuracy.";
    return "Keep practicing! Consistent effort leads to mastery.";
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: isVisible ? 1 : 0.8, 
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center relative">
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 rounded-full p-4 border-4 border-white">
            <Trophy className="h-8 w-8 text-yellow-800" />
          </div>
          <h2 className="text-2xl font-bold mb-1">Quiz Completed!</h2>
        </div>
        
        {/* Results */}
        <div className="pt-12 pb-4 px-6">
          <h3 className="text-center text-lg font-medium text-gray-700 mb-6">
            {getMessage()}
          </h3>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <StatCard 
              icon={<Check className="h-5 w-5 text-green-600" />}
              label="Correct"
              value={correctAnswers.toString()}
            />
            
            <StatCard 
              icon={<X className="h-5 w-5 text-red-600" />}
              label="Incorrect"
              value={incorrectAnswers.toString()}
            />
            
            <StatCard 
              icon={<Zap className="h-5 w-5 text-yellow-600" />}
              label="Accuracy"
              value={`${accuracy}%`}
            />
            
          
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 px-8 py-3 rounded-full mb-4">
              <span className="font-bold text-2xl text-indigo-700">{score}</span>
              <span className="text-gray-600 ml-1">points earned</span>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                variant="primary" 
                size="lg"
                onClick={onClose}
              >
                Exit to Menu
              </Button>
              
              <Button 
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => {
                  window.location.href = "/roadmap";
                }}
              >
                <span className="mr-1 text-white">Go to Roadmap</span>
                <ArrowUpRight className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-3 flex items-center space-x-3">
      <div className="bg-white p-2 rounded-full shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default ResultsModal;