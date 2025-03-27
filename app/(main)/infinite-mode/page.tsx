'use client';

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

const InfiniteModePage = () => {
    return ( 
        <div className="flex flex-col items-center min-h-screen p-8">
            <h1 className="text-4xl font-bold text-center pt-4">Infinite Mode</h1>
            <div className="flex-1 flex items-center justify-center w-full">
                <div className="flex flex-row space-x-4 max-w-6xl w-full justify-center">
                    <div 
                        className="bg-gray-100 rounded-lg p-6 shadow-md cursor-pointer transition-all duration-200 text-center hover:-translate-y-1 hover:shadow-lg hover:bg-gray-200 flex-1 min-w-0"
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