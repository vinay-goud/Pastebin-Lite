import { NextRequest, NextResponse } from 'next/server';
import { getCurrentTime } from '@/lib/time';
import { getPasteAndBurnView } from '@/lib/pastes';

export const dynamic = 'force-dynamic';

// Next.js App Router dynamic route params
interface Context {
    params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Context) {
    // Await params in newer Next.js versions (good practice)
    const { id } = await params;

    const now = getCurrentTime(req as unknown as Request);

    try {
        const result = await getPasteAndBurnView(id, now);

        if (result.kind === 'not_found') {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        const { content, remaining_views, expires_at } = result.data;

        // Requirement check: "remaining_views -> null if unlimited"
        // Requirement check: "expires_at -> ISO string or null"?
        // Prompt said: "expires_at -> ISO string or null" in API REQUIREMENTS section.
        // "Return: { content, remaining_views, expires_at }"
        // Wait, the prompt requirements said: "expires_at -> ISO string or null"

        let expiresAtIso = null;
        if (expires_at !== null) {
            expiresAtIso = new Date(expires_at).toISOString();
        }

        return NextResponse.json({
            content,
            remaining_views,
            expires_at: expiresAtIso
        });

    } catch (error) {
        console.error('Get paste failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
