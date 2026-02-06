import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getCurrentTime } from '@/lib/time';
import { validateCreatePaste } from '@/lib/validation';
import { createPaste } from '@/lib/pastes';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const validation = validateCreatePaste(body);

    if (!validation.valid) {
        return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }

    const { content, ttlSeconds, maxViews } = validation.data;

    const now = getCurrentTime(req as unknown as Request);
    const expiresAt = ttlSeconds ? now + (ttlSeconds * 1000) : null;

    const id = nanoid(10); // ID Length 10

    try {
        await createPaste(id, content, expiresAt, maxViews);

        const url = new URL(`/p/${id}`, req.url).toString();

        return NextResponse.json({
            id,
            url
        }, { status: 200 });
    } catch (error) {
        console.error('Create paste failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
