export interface CreatePasteInput {
    content: unknown;
    ttl_seconds?: unknown;
    max_views?: unknown;
}

export function validateCreatePaste(body: CreatePasteInput) {
    const errors: string[] = [];
    const { content, ttl_seconds, max_views } = body;

    // STRICT Validation: content
    if (typeof content !== 'string') {
        errors.push('content must be a string');
    } else if (content.length === 0) {
        errors.push('content cannot be empty');
    }

    // STRICT Validation: ttl_seconds
    // MUST be integer if present. Do NOT coerce strings.
    if (ttl_seconds !== undefined && ttl_seconds !== null) {
        if (typeof ttl_seconds !== 'number' || !Number.isInteger(ttl_seconds)) {
            errors.push('ttl_seconds must be an integer');
        } else if (ttl_seconds < 1) {
            errors.push('ttl_seconds must be a positive integer');
        }
    }

    // STRICT Validation: max_views
    // MUST be integer if present. Do NOT coerce strings.
    if (max_views !== undefined && max_views !== null) {
        if (typeof max_views !== 'number' || !Number.isInteger(max_views)) {
            errors.push('max_views must be an integer');
        } else if (max_views < 1) {
            errors.push('max_views must be a positive integer');
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        data: {
            content: content as string,
            ttlSeconds: ttl_seconds as number | undefined,
            maxViews: max_views as number | undefined,
        },
    };
}
