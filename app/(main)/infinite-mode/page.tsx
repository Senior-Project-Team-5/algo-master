'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const levelTopics = {
    easy: [
        "Arrays",
        "Strings",
        "Linked Lists",
        "Complexities",
        "Insertion Sort",
        "Selection Sort",
    ],
    medium: [
        "Bubble Sort",
        "Merge Sort",
        "Quick Sort",
        "Binary Search",
        "Hash Tables",
        "Stacks",
        "Queues",
    ],
    hard: [
        "Trees",
        "Heaps",
        "Graphs",
        "Breadth-First Search",
        "Depth-First Search",
        "Recursion",
    ],
    expert: [
        "Dijkstra's Algorithm",
        "Bellman-Ford Algorithm",
        "Greedy Algorithms",
        "Topological Sort",
        "Dynamic Programming",
        "Backtracking",
    ]
}

const languages = [
    "Python",
    "Java",
    "C++",
    "JavaScript",
    "C#",
]

const InfiniteModePage = () => {
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

    const handleDifficultyClick = (difficulty: string) => {
        // Get topics for the selected difficulty
        const topics = levelTopics[difficulty.toLowerCase() as keyof typeof levelTopics];
        
        // Navigate to quiz page with difficulty, topics, and language as query params
        router.push(`/infinite-mode/quiz?difficulty=${difficulty}&topics=${topics.join(',')}&language=${selectedLanguage}`);
    };

    return ( 
        <div className="flex flex-col items-center min-h-screen p-8">
            <h1 className="text-4xl font-bold text-center pt-4">Infinite Mode</h1>
            
            <div className="mt-6 mb-8">
                <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Programming Language:
                </label>
                <select
                    id="language-select"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    {languages.map((language) => (
                        <option key={language} value={language}>
                            {language}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="flex-1 flex items-center justify-center w-full">
                <div className="flex flex-row space-x-4 max-w-6xl w-full justify-center">
                    <div 
                        className="bg-gray-100 rounded-lg p-6 shadow-md cursor-pointer transition-all duration-200 text-center hover:-translate-y-1 hover:shadow-lg hover:bg-gray-200 flex-1 min-w-0"
                        onClick={() => handleDifficultyClick('Easy')}
                    >
                        <h2 className="text-xl font-semibold mb-2">Easy</h2>
                        <ul className="text-gray-500 text-sm text-left list-disc pl-4">
                            {levelTopics.easy.map((topic, index) => (
                                <li key={index}>{topic}</li>
                            ))}
                        </ul>
                    </div>
                    <div 
                        className="bg-gray-100 rounded-lg p-6 shadow-md cursor-pointer transition-all duration-200 text-center hover:-translate-y-1 hover:shadow-lg hover:bg-gray-200 flex-1 min-w-0"
                        onClick={() => handleDifficultyClick('Medium')}
                    >
                        <h2 className="text-xl font-semibold mb-2">Medium</h2>
                        <ul className="text-gray-500 text-sm text-left list-disc pl-4">
                            {levelTopics.medium.map((topic, index) => (
                                <li key={index}>{topic}</li>
                            ))}
                        </ul>
                    </div>
                    <div 
                        className="bg-gray-100 rounded-lg p-6 shadow-md cursor-pointer transition-all duration-200 text-center hover:-translate-y-1 hover:shadow-lg hover:bg-gray-200 flex-1 min-w-0"
                        onClick={() => handleDifficultyClick('Hard')}
                    >
                        <h2 className="text-xl font-semibold mb-2">Hard</h2>
                        <ul className="text-gray-500 text-sm text-left list-disc pl-4">
                            {levelTopics.hard.map((topic, index) => (
                                <li key={index}>{topic}</li>
                            ))}
                        </ul>
                    </div>
                    <div 
                        className="bg-gray-100 rounded-lg p-6 shadow-md cursor-pointer transition-all duration-200 text-center hover:-translate-y-1 hover:shadow-lg hover:bg-gray-200 flex-1 min-w-0"
                        onClick={() => handleDifficultyClick('Expert')}
                    >
                        <h2 className="text-xl font-semibold mb-2">Expert</h2>
                        <ul className="text-gray-500 text-sm text-left list-disc pl-4">
                            {levelTopics.expert.map((topic, index) => (
                                <li key={index}>{topic}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default InfiniteModePage;