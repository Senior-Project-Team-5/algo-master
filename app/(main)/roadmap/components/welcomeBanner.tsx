"use client";

import { useState } from "react";

const WelcomeBanner = () => {
  const [showBanner, setShowBanner] = useState(true);

  if (!showBanner) return null;

  return (
    <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded flex justify-between items-center text-sm mb-4 shadow">
      <span>
        👋 Welcome! Click on a topic below to begin and after completing a unit, test yourself in the Exam section. Track your progress and choose your language on the bottom right!
      </span>
      <button
        onClick={() => setShowBanner(false)}
        className="text-blue-700 font-semibold hover:underline ml-4"
      >
        Dismiss
      </button>
    </div>
  );
};

export default WelcomeBanner;
