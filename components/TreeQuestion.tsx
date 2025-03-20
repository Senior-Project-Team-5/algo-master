import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import react-d3-tree dynamically with no SSR
const Tree = dynamic(() => import('react-d3-tree'), { ssr: false });

interface TreeNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
}

interface Choice {
  choice: string;
  explanation: string;
}

interface TreeQuestionData {
  question: string;
  nodes: TreeNode[];
  choices: Choice[];
  answer: string;
  explanation: string;
  resources: string;
}

interface HierarchicalNode {
  name: string;
  attributes: {
    id: string;
  };
  children: HierarchicalNode[];
}

const TreeQuestion: React.FC = () => {
  const [questionData, setQuestionData] = useState<TreeQuestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(30); // Progress bar value (0-100)

  useEffect(() => {
    const fetchTreeQuestion = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/generate-tree-question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tree question');
        }

        const data = await response.json();
        setQuestionData(data);
      } catch (err) {
        setError('Failed to load question. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreeQuestion();
  }, []);

  // Transform flat node structure to hierarchical structure for D3 tree
  const transformToHierarchy = (nodes: TreeNode[] | undefined): HierarchicalNode | null => {
    if (!nodes || nodes.length === 0) return null;
    
    // Create a map of all nodes by id
    const nodeMap: Record<string, HierarchicalNode> = {};
    nodes.forEach(node => {
      nodeMap[node.id] = {
        name: node.value.toString(),
        attributes: {
          id: node.id
        },
        children: []
      };
    });
    
    // Find the root node (node that is not referenced as a child)
    const isChild: Record<string, boolean> = {};
    nodes.forEach(node => {
      if (node.left) isChild[node.left] = true;
      if (node.right) isChild[node.right] = true;
    });
    
    let rootNode: HierarchicalNode | null = null;
    for (const nodeId in nodeMap) {
      if (!isChild[nodeId]) {
        rootNode = nodeMap[nodeId];
        break;
      }
    }
    
    // Connect all nodes
    nodes.forEach(node => {
      if (node.left && nodeMap[node.left]) {
        nodeMap[node.id].children.push(nodeMap[node.left]);
      }
      if (node.right && nodeMap[node.right]) {
        nodeMap[node.id].children.push(nodeMap[node.right]);
      }
    });
    
    return rootNode;
  };

  const handleSubmit = () => {
    if (selectedChoice) {
      setIsSubmitted(true);
      // Update progress when answering
      setProgress(Math.min(progress + 15, 100));
    }
  };

  // Custom node renderer
  const renderCustomNode = ({ nodeDatum }: { nodeDatum: any }) => (
    <g>
      <circle r={20} fill="#3b82f6" />
      <text fill="white" strokeWidth="0.5" textAnchor="middle" dy=".3em">
        {nodeDatum.name}
      </text>
    </g>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    );
  }

  if (!questionData) {
    return <div>No question data available</div>;
  }

  const hierarchicalData = transformToHierarchy(questionData.nodes);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-4 rounded-full bg-gray-200 h-3">
        <div 
          className="h-3 rounded-full bg-green-400" 
          style={{ width: `${progress}%` }}
        ></div>
        <div className="text-right text-xs text-gray-500 mt-1">
          {progress} pts
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
        <div className="bg-gray-100 p-4 border-b">
          <h2 className="text-lg font-medium">{questionData.question}</h2>
        </div>
        
        {/* Tree visualization */}
        <div className="p-4 flex justify-center items-center" style={{ height: '320px' }}>
          {hierarchicalData && (
            <Tree
              data={hierarchicalData}
              renderCustomNodeElement={renderCustomNode}
              orientation="vertical"
              pathFunc="step"
              translate={{ x: 200, y: 50 }}
              separation={{ siblings: 1.5, nonSiblings: 2 }}
              nodeSize={{ x: 80, y: 80 }}
              zoomable={true}
            />
          )}
        </div>
      </div>
      
      {/* Answer options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {questionData.choices.map((choice, index) => (
          <button
            key={index}
            className={`p-3 rounded-lg border text-left font-medium transition-all ${
              isSubmitted 
                ? selectedChoice === choice.choice
                  ? choice.choice === questionData.answer
                    ? "bg-green-500 text-white border-green-600"
                    : "bg-red-500 text-white border-red-600"
                  : choice.choice === questionData.answer
                    ? "bg-green-500 text-white border-green-600"
                    : "bg-gray-100 border-gray-300"
                : selectedChoice === choice.choice
                  ? "bg-blue-100 border-blue-400"
                  : "bg-gray-100 hover:bg-gray-200 border-gray-300"
            }`}
            onClick={() => !isSubmitted && setSelectedChoice(choice.choice)}
            disabled={isSubmitted}
          >
            <div className="flex items-center">
              {isSubmitted && (
                <span className="mr-2">
                  {choice.choice === questionData.answer ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : selectedChoice === choice.choice ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : null}
                </span>
              )}
              {choice.choice}
            </div>
          </button>
        ))}
      </div>
      
      {/* Submit button (only visible before submission) */}
      {!isSubmitted && (
        <div className="flex justify-center mb-6">
          <button
            onClick={handleSubmit}
            disabled={!selectedChoice}
            className={`px-6 py-2 rounded-full font-medium ${
              !selectedChoice
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Submit
          </button>
        </div>
      )}
      
      {/* Explanation Card (only visible after submission) */}
      {isSubmitted && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-4 border-b">
            <h2 className="text-lg font-medium">Explanation</h2>
          </div>
          <div className="p-4">
            <p className="mb-4">{questionData.explanation}</p>
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-medium">Resources:</p>
              <p>{questionData.resources}</p>
            </div>
            <div className="mt-6 text-center">
              <button 
                className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600"
                onClick={() => window.location.reload()}
              >
                Next Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeQuestion;