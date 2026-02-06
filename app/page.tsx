'use client';

import { useState, FormEvent } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [result, setResult] = useState<{ id: string; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const payload: Record<string, unknown> = { content };

    if (ttlSeconds.trim()) {
      const ttl = parseInt(ttlSeconds, 10);
      if (!isNaN(ttl) && ttl > 0) {
        payload.ttl_seconds = ttl;
      }
    }

    if (maxViews.trim()) {
      const views = parseInt(maxViews, 10);
      if (!isNaN(views) && views > 0) {
        payload.max_views = views;
      }
    }

    try {
      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors?.join(', ') || data.error || 'Failed to create paste');
      }

      setResult(data);
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Pastebin Lite</h1>
          <p className="text-gray-500 text-sm mb-6">Create a text paste and share a link to view it.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full h-40 px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ttl" className="block text-sm font-medium text-gray-700 mb-1">
                  TTL (seconds)
                </label>
                <input
                  id="ttl"
                  type="number"
                  min="1"
                  value={ttlSeconds}
                  onChange={(e) => setTtlSeconds(e.target.value)}
                  placeholder="e.g. 3600"
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="maxViews" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Views
                </label>
                <input
                  id="maxViews"
                  type="number"
                  min="1"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Paste'}
            </button>
          </form>

          {error && (
            <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm"><strong>Error:</strong> {error}</p>
            </div>
          )}

          {result && (
            <div className="mt-5 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm font-medium mb-2">Paste created!</p>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 text-sm underline break-all"
              >
                {result.url}
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
