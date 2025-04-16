import { NextResponse } from 'next/server';
import db from '@/db/db';
import { users } from '@/db/schema';

export async function GET() {
    const response = await db
        .select()
        .from(users);
  const players = response.map((user) => {
    const meta = user && user.meta ? JSON.parse(user.meta) : null; // Parse the "meta" field if it exists
    let userData = {};
    if (user) {
      userData = {
        user_id: user.user_id,
        meta: meta,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    }
    return userData;
  });
    // Return the user data with the parsed "meta" field
    return NextResponse.json(players);
}