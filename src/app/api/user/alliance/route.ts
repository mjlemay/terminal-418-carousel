import { NextResponse } from 'next/server';
import db from '@/db/db';
import { users } from '@/db/schema';
import { allianceArray } from '@/app/lib/constants';

export async function GET() {
    const response = await db
        .select()
        .from(users);
    const allianceMembers: Record<string, typeof response> = {};
    allianceArray.map((alliance) => {
        allianceMembers[alliance] = response.filter((user) => {
            const meta = user && user.meta ? JSON.parse(user.meta) : null; // Parse the "meta" field if it exists
            return meta && meta?.alliance === alliance;
        });
    });
    // Return the user data with the parsed "meta" field
    return NextResponse.json(allianceMembers);
}
