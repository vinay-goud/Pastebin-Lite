import Link from 'next/link';

interface UnavailableCardProps {
    title: string;
    message: string;
    icon?: 'x' | 'clock';
}

export default function UnavailableCard({ title, message, icon = 'x' }: UnavailableCardProps) {
    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {icon === 'clock' ? (
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </div>
                <h1 className="text-xl font-semibold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-500 text-sm mb-6">{message}</p>
                <Link
                    href="/"
                    className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                    Create New Paste
                </Link>
            </div>
        </main>
    );
}
