'use client';

import { useState, useEffect } from 'react';

interface PasteViewClientProps {
    content: string;
    expiresAt: number | null;
    remainingViews: number | null;
}

export default function PasteViewClient({ content, expiresAt, remainingViews }: PasteViewClientProps) {
    const [expired, setExpired] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);

    useEffect(() => {
        if (expiresAt === null) return;

        const updateTimer = () => {
            const now = Date.now();
            if (now >= expiresAt) {
                setExpired(true);
                setTimeLeft(null);
            } else {
                const diff = expiresAt - now;
                const totalSeconds = Math.floor(diff / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                if (hours > 0) {
                    setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
                } else if (minutes > 0) {
                    setTimeLeft(`${minutes}m ${seconds}s`);
                } else {
                    setTimeLeft(`${seconds}s`);
                }
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [expiresAt]);

    // Client-side expired state (for UX only - server already returned 200)
    if (expired) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">Paste Expired</h1>
                    <p className="text-gray-500 text-sm mb-6">This paste has reached its time limit.</p>
                    <a href="/" className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors">
                        Create New Paste
                    </a>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h1 className="text-lg font-semibold text-gray-900">Pastebin Lite</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            {remainingViews !== null && (
                                <span>Views left: <span className="font-medium text-gray-700">{remainingViews}</span></span>
                            )}
                            {timeLeft !== null && (
                                <span>Expires in: <span className="font-medium text-orange-600">{timeLeft}</span></span>
                            )}
                            {remainingViews === null && expiresAt === null && (
                                <span className="text-green-600">No expiration</span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto text-sm font-mono whitespace-pre-wrap break-words">
                            {content}
                        </pre>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <a href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            ← Create new paste
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
