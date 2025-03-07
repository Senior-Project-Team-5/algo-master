'use client';

import { useState } from 'react';

export default function DocumentInput() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Ingestion failed');
      setMessage('Document ingested successfully!');
      setContent('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to ingest document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-lg font-medium">
          Enter Document Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full h-64 p-2 border rounded-md"
            placeholder="Paste your document content here..."
            disabled={loading}
          />
        </label>
        
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Ingest Document'}
        </button>
        
        {message && (
          <div className={`p-3 rounded-md ${message.includes('success') ? 'bg-green-100' : 'bg-red-100'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}