import { NextResponse } from 'next/server';
import db from '@/db/db';
import { eq } from "drizzle-orm";
import { users } from '@/db/schema';


export async function GET(req: Request, { params }: { params: Promise<{ userid: string }> }) {
    const userid = (await params).userid;
    const response = await db
        .select()
        .from(users)
        .where(eq(users.user_id, userid));

  return NextResponse.json(response);
}

export async function POST(req: Request, { params }: { params: Promise<{ userid: string }> }) {
    const userid = (await params).userid;
    let user = { 
      user_id: userid,
    }
    const response = await db.insert(users).values(user);
  
    return NextResponse.json(response);
  }