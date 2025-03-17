"use client";

import React from 'react';
import GraphQuestion from '@/components/GraphQuestion';

export default function GraphQuestionPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Graph Theory Quiz</h1>
      <GraphQuestion />
    </div>
  );
}