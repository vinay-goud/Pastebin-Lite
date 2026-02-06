import { pool } from './db';

interface Paste {
    id: string;
    content: string;
    expires_at: number | null; // Converted from BIGINT to number
    remaining_views: number | null;
}

export type GetPasteResult =
    | { kind: 'success'; data: Paste }
    | { kind: 'not_found' }; // Covers missing, expired, and exhausted

/**
 * Atomically retrieve a paste and decrement its view count.
 * Handles expiry checks and deletion of expired pastes.
 */
export async function getPasteAndBurnView(id: string, nowMs: number): Promise<GetPasteResult> {
    const client = await pool.connect();
    try {
        // 1. Attempt atomic decrement.
        // We update ONLY if views are available.
        // If remaining_views is NULL (unlimited), the decrement logic `remaining_views - 1` yields NULL in SQL?
        // No, `NULL - 1` is `NULL`.
        // So `SET remaining_views = remaining_views - 1` works even for NULL?
        // Postgres: `NULL - 1` is `NULL`.
        // If remaining_views is NULL, we want it to STAY NULL.
        // Logic: `SET remaining_views = CASE WHEN remaining_views IS NULL THEN NULL ELSE remaining_views - 1 END`

        // Condition: `WHERE id = $1 AND (remaining_views IS NULL OR remaining_views > 0)`

        const query = `
      UPDATE pastes
      SET remaining_views = CASE 
        WHEN remaining_views IS NULL THEN NULL 
        ELSE remaining_views - 1 
      END
      WHERE id = $1 
        AND (remaining_views IS NULL OR remaining_views > 0)
      RETURNING id, content, expires_at, remaining_views;
    `;

        const result = await client.query(query, [id]);

        if (result.rows.length === 0) {
            // Either doesn't exist OR views exhausted.
            return { kind: 'not_found' };
        }

        const paste = result.rows[0];

        // 2. Check Expiry
        // expires_at is BIGINT. PG driver might return string.
        const expiresAt = paste.expires_at ? Number(paste.expires_at) : null;

        if (expiresAt !== null && nowMs >= expiresAt) {
            // Expired!
            // Requirement: Optionally delete row.
            // We fire and forget the delete (or await it to be safe)
            await client.query('DELETE FROM pastes WHERE id = $1', [id]);
            return { kind: 'not_found' };
        }

        // Success
        return {
            kind: 'success',
            data: {
                ...paste,
                expires_at: expiresAt // Return as number for JSON safety
            }
        };

    } finally {
        client.release();
    }
}

export async function createPaste(
    id: string,
    content: string,
    expiresAt: number | null,
    maxViews: number | undefined
) {
    const query = `
     INSERT INTO pastes (id, content, expires_at, remaining_views)
     VALUES ($1, $2, $3, $4)
     RETURNING id, created_at
   `;
    await pool.query(query, [id, content, expiresAt, maxViews ?? null]);
}
