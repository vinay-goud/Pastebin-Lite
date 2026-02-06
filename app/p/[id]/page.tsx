import { notFound } from 'next/navigation';
import { getPasteAndBurnView } from '@/lib/pastes';
import PasteViewClient from './PasteViewClient';

// Force dynamic because we need strict time checks and view burning on every request
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PastePage({ params }: PageProps) {
    const { id } = await params;

    // Get headers for test mode
    const { headers } = await import('next/headers');
    const headersList = await headers();

    let now = Date.now();
    if (process.env.TEST_MODE === '1') {
        const testHeader = headersList.get('x-test-now-ms');
        if (testHeader) {
            const parsed = parseInt(testHeader, 10);
            if (Number.isInteger(parsed)) {
                now = parsed;
            }
        }
    }

    // Atomically get and burn view
    const result = await getPasteAndBurnView(id, now);

    // CRITICAL: Assignment requires HTTP 404 for unavailable pastes
    if (result.kind === 'not_found') {
        notFound(); // This returns HTTP 404
    }

    const { content, remaining_views, expires_at } = result.data;

    // Pass data to client component for live countdown and expiry handling
    return (
        <PasteViewClient
            content={content}
            expiresAt={expires_at}
            remainingViews={remaining_views}
        />
    );
}
