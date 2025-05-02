"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Code, CheckCircle } from 'lucide-react';

const examTopics = {
    ARRAY_AND_STRING: [
        "Introduction to Strings & Arrays",
        "Array & String Manipulation",
        "Array & String Coding Algorithms",
    ],
    HASHMAPS_AND_SETS: [
        "Introduction to Hashmaps & Sets",
        "Hashmaps & Sets Manipulation",
        "Hashmaps & Sets Algorithms",
    ],
    STACKS_AND_QUEUES: [
        "Introduction to Stacks & Queues",
        "Stacks & Queues Manipulation",
        "Stacks & Queues Algorithms",
    ],
    LINKED_LISTS: [
        "Introduction to Linked Lists",
        "Linked List Operations",
        "Linked List Algorithms",
    ],
    BINARY_SEARCH: [
        "Introduction to Binary Search",
        "Binary Search Algorithms",
    ],
    SLIDING_WINDOW: [
        "Introduction to Sliding Window",
        "Sliding Window Algorithms",
    ],
    TREES: [
        "Introduction to Trees",
        "Tree Traversal",
    ],
    HEAPS: [
        "Introduction to Heaps",
        "Heap Operations",
    ],
    BACKTRACKING: [
        "Introduction to Backtracking",
        "Backtracking Algorithms",
    ],
    GRAPHS: [
        "Introduction to Graphs",
        "Graph Algorithms",
    ],
    DYNAMIC_PROGRAMMING: [
        "Introduction to Dynamic Programming",
        "Dynamic Programming Algorithms",
    ],
}

const languages = [
    "Python",
    "Java",
    "C++",
    "JavaScript",
    "C#",
]

const ExamPage = () => {
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

    const handleTopicClick = (topic: string) => {
        const topics = examTopics[topic as keyof typeof examTopics];
        router.push(`/exam/quiz?topic=${topic}&topics=${topics.join(',')}&language=${selectedLanguage}`);
    }

    const formatTopicName = (topic: string) => {
        return topic
            .replace(/_/g, " ")
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="mb-8 text-center">
                <h1 className="text-3xl text-[#2E588D] font-bold mb-2">Algorithm Mastery Exam</h1>
                <p className="text-gray-600">Choose a topic and test your knowledge with curated exercises</p>
            </div>

            {/* Language selector */}
            <div className="mb-8">
                <div className="max-w-xs mx-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Programming Language
                    </label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((lang) => (
                                <SelectItem key={lang} value={lang}>
                                    {lang}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(examTopics).map((topic) => (
                    <Card 
                        key={topic}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedTopic === topic ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => setSelectedTopic(topic)}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl flex items-center text-[#bb6632] gap-2">
                                <BookOpen className="h-5 w-5" />
                                {formatTopicName(topic)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                                {examTopics[topic as keyof typeof examTopics].map((subtopic, index) => (
                                    <li key={index} className="text-gray-600">{subtopic}</li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <div className="text-xs text-gray-500">
                                {examTopics[topic as keyof typeof examTopics].length} subtopics
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Start button */}
            <div className="mt-8 flex justify-center">
                <Button
                    size="lg"
                    variant="primary"
                    className="px-8 py-2 "
                    disabled={!selectedTopic}
                    onClick={() => selectedTopic && handleTopicClick(selectedTopic)}
                >
                    <Code className="mr-1" />
                    Start {selectedTopic ? formatTopicName(selectedTopic) : ''} Exam
                </Button>
            </div>
        </div>
    )
}
 
export default ExamPage;