"use client";

import React from 'react';
import TreeQuestion from '@/components/TreeQuestion';

export default function TreeQuestionPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Binary Tree Data Structure Quiz</h1>
      <TreeQuestion />
    </div>
  );
}