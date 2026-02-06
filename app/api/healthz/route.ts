import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Deep DB check (not just successful connection, but query execution)
        await pool.query('SELECT 1');
        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error) {
        console.error('Health check failed:', error);
        return NextResponse.json(
            { ok: false, error: 'Database health check failed' },
            { status: 500 }
        );
    }
}
