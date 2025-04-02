import { NextResponse } from 'next/server';
import db from '@/db/db';
import { eq } from "drizzle-orm";
import { users } from '@/db/schema';


export async function GET(req: Request, { params }: { params: Promise<{ userid: string }> }) {
    const userid = (await params).userid;
    const response = await db
        .select()
        .from(users)
        .where(eq(users.user_id, userid)).limit(1);
    const user = response[0];
    const meta = user && user.meta ? JSON.parse(user.meta) : null; // Parse the "meta" field if it exists
    console.log('user', JSON.stringify(user));
    let userData = {};
    if (user) {
      userData = {
        user_id: user.user_id,
        meta: meta,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    }
    // Return the user data with the parsed "meta" field
    return NextResponse.json(userData);
}

export async function POST(req: Request, { params }: { params: Promise<{ userid: string }> }) {
    const userid = (await params).userid;
    let user = { 
      user_id: userid,
    }
    const response = await db.insert(users).values(user);
  
    return NextResponse.json(response);
  }

export async function PUT(req: Request, { params }: { params: Promise<{ userid: string }> }) {
  const userid = (await params).userid;
  const body = await req.json();
  const meta = body.meta; // Extract "meta" from the request body

  // Check if "meta" is a valid JSON object
  let parsedMeta;
  try {
    parsedMeta = JSON.parse(meta);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid meta value. It must be a valid JSON string.' }, { status: 400 });
  }

  if (typeof parsedMeta !== 'object' || parsedMeta === null) {
    return NextResponse.json({ error: 'Invalid meta value. It must be a JSON object.' }, { status: 400 });
  }

  let user = { 
    user_id: userid,
  }
  const response = await db
  .update(users)
  .set({ meta }) // Update the "meta" field
  .where(eq(users.user_id, userid));

  return NextResponse.json(response);
}