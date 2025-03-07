'use client';

import { useState } from 'react';

export default function QueryForm() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    
    const data = await res.json();
    setAnswer(data.answer);
    setPrompt(data.prompt);
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Ask a question..."
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
        >
          {loading ? 'Searching...' : 'Ask'}
        </button>
        {prompt && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Prompt:</h3>
          <pre className="p-3 bg-gray-100 rounded overflow-auto text-sm mt-2 max-h-60">
            {prompt}
          </pre>
        </div>
      )}

        {answer && (
          <div className="p-4 bg-gray-50 rounded">
            <h3 className="text-lg font-semibold">Question Generated:</h3>
            <pre className="p-3 bg-gray-100 rounded overflow-auto text-sm mt-2 max-h-60">
              {answer}
            </pre>
          </div>
        )}
      </form>
    </div>
  );
}