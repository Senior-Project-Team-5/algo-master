import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Import react-force-graph dynamically with no SSR
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

interface GraphNode {
  id: string;
  label: string;
}

interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
}

interface Choice {
  choice: string;
  explanation: string;
}

interface GraphQuestionData {
  question: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  choices: Choice[];
  answer: string;
  explanation: string;
  resources: string;
}

// Transform the data for react-force-graph
const prepareGraphData = (nodes: GraphNode[], edges: GraphEdge[]) => {
  // Format nodes for visualization
  const graphNodes = nodes.map(node => ({
    id: node.id,
    name: node.label || node.id
  }));

  // Format edges for visualization
  const graphLinks = edges.map(edge => ({
    source: edge.source,
    target: edge.target,
    weight: edge.weight,
    label: edge.weight ? `${edge.weight}` : ''
  }));

  return { nodes: graphNodes, links: graphLinks };
};

const GraphQuestion: React.FC = () => {
  const [questionData, setQuestionData] = useState<GraphQuestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(30); // Progress bar value (0-100)
  const graphRef = useRef<any>(null);

  useEffect(() => {
    const fetchGraphQuestion = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/generate-graph-question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch graph question');
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

    fetchGraphQuestion();
  }, []);

  useEffect(() => {
    // Center and zoom the graph when data loads
    if (questionData && graphRef.current) {
      setTimeout(() => {
        graphRef.current.zoomToFit(400, 50);
      }, 500);
    }
  }, [questionData]);

  const handleSubmit = () => {
    if (selectedChoice) {
      setIsSubmitted(true);
      // Update progress when answering
      setProgress(Math.min(progress + 15, 100));
    }
  };

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

  const graphData = prepareGraphData(questionData.nodes, questionData.edges);

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
        
        {/* Graph visualization */}
        <div className="p-4 flex justify-center items-center" style={{ height: '320px' }}>
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            width={600}
            height={300}
            nodeLabel="name"
            nodeColor={() => "#3b82f6"}
            linkDirectionalArrowLength={6}
            linkDirectionalArrowRelPos={1}
            linkWidth={2}
            d3Force="charge"
            d3VelocityDecay={0.2}
            nodeRelSize={20}
            linkDistance={100}
            onEngineTick={() => {
              if (graphRef.current) {
                graphRef.current.d3Force("charge")?.strength(-500);
                graphRef.current.d3Force("link")?.distance(150);
              }
            }}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.name;
              const fontSize = Math.min(10, 30 / globalScale);
              const radius = 18;

              // Draw node circle
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
              ctx.fillStyle = '#3b82f6';
              ctx.fill();

              // Draw node label inside the circle
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.fillStyle = 'white';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(label, node.x, node.y);
            }}
            linkCanvasObject={(link, ctx, globalScale) => {
              // Draw the link line
              const start = link.source;
              const end = link.target;
              
              if (!start || !end || typeof start === 'string' || typeof end === 'string') return;

              // Draw the link line
              ctx.beginPath();
              ctx.moveTo(start.x, start.y);
              ctx.lineTo(end.x, end.y);
              ctx.strokeStyle = '#aaa';
              ctx.lineWidth = 2;
              ctx.stroke();
              
              // Draw the arrow
              const arrowLength = 6;
              const dx = end.x - start.x;
              const dy = end.y - start.y;
              const angle = Math.atan2(dy, dx);
              const length = Math.sqrt(dx * dx + dy * dy);
              
              // Calculate position 95% along the link for the arrow
              const arrowX = start.x + (dx * 0.95);
              const arrowY = start.y + (dy * 0.95);
              
              ctx.beginPath();
              ctx.moveTo(arrowX, arrowY);
              ctx.lineTo(
                arrowX - arrowLength * Math.cos(angle - Math.PI / 7),
                arrowY - arrowLength * Math.sin(angle - Math.PI / 7)
              );
              ctx.lineTo(
                arrowX - arrowLength * Math.cos(angle + Math.PI / 7),
                arrowY - arrowLength * Math.sin(angle + Math.PI / 7)
              );
              ctx.lineTo(arrowX, arrowY);
              ctx.fillStyle = '#aaa';
              ctx.fill();
              
              // Draw the weight label
              const weight = link.weight;
              if (weight !== undefined) {
                // Position the weight at the middle of the link
                const textX = start.x + dx / 2;
                const textY = start.y + dy / 2;
                
                // Draw small background for better visibility
                const weightText = `${weight}`;
                const fontSize = Math.min(12, 24 / globalScale);
                ctx.font = `${fontSize}px Sans-Serif`;
                const textWidth = ctx.measureText(weightText).width;
                const padding = 2;
                
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fillRect(
                  textX - textWidth / 2 - padding,
                  textY - fontSize / 2 - padding,
                  textWidth + padding * 2,
                  fontSize + padding * 2
                );
                
                // Draw the weight text
                ctx.fillStyle = '#333';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(weightText, textX, textY);
              }
            }}
            linkDirectionalParticles={0}
          />
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

export default GraphQuestion;