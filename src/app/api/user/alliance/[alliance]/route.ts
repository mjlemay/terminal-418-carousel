import { NextResponse } from 'next/server';
import db from '@/db/db';
import { users } from '@/db/schema';

export async function GET(req: Request, { params }: { params: Promise<{ alliance: string }> }) {
    const { alliance = '' } = await params;
    let cleanAllianceName = alliance.replace(/([A-Z])/g, ' $1');
    cleanAllianceName  = cleanAllianceName.charAt(0).toUpperCase() + cleanAllianceName.slice(1);
    cleanAllianceName = cleanAllianceName.trim();
    const response = await db
        .select()
        .from(users);
  const allanceAllys = response.filter((user) => {
    const meta = user && user.meta ? JSON.parse(user.meta) : null; // Parse the "meta" field if it exists
    console.log(meta?.alliance, cleanAllianceName);
    return meta && meta?.alliance === cleanAllianceName;
  });
    // Return the user data with the parsed "meta" field
    return NextResponse.json(allanceAllys);
}
