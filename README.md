# Pastebin-Lite

A secure, serverless-ready Pastebin application built with Next.js and Neon (Postgres).

## Project Description

Pastebin-Lite allows users to share text snippets with optional security constraints:
- **Time-to-Live (TTL)**: Pastes automatically expire after a set duration.
- **View Limits**: Pastes are deleted after being viewed a specific number of times.

## How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=postgres://<user>:<password>@<host>/<database>?sslmode=require
   TEST_MODE=1
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:3000`.

## Persistence Layer

**Choice**: Neon (Serverless Postgres)

**Reasoning**:
- **Persistence**: Unlike in-memory storage, Postgres ensures data survives application restarts and serverless cold starts.
- **Safety**: We use a global singleton connection pool (`lib/db.ts`) to prevent connection exhaustion in serverless environments (e.g., Vercel Functions).
- **Updates**: View counts are handled with atomic SQL `UPDATE` queries to prevent race conditions and ensure data integrity.

## Design Decisions

- **Atomic View Burning**: When a paste is viewed (via API or Browser), a single database transaction fetches the content and decrements the view count. If the count reaches zero, the transaction ensures no further views are possible.
- **Deterministic Testing**: The application respects the `x-test-now-ms` header (when `TEST_MODE=1`) to allow automated tests to simulate specific times for expiry verification.
- **Strict Validation**: All inputs (TTL, View Counts) are strictly validated on the server side to ensure they are positive integers.
