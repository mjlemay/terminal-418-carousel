import { NextResponse } from 'next/server';
import db from '@/db/db';
import { vinhGame } from '@/db/schema';
import { eq } from "drizzle-orm";
import { isValidHex } from '@/app/lib/hex';
 
const DEVICE_NAME = process.env.NEXT_PUBLIC_DEVICE_NAME || 'unknown_terminal';

export async function GET(req: any) {
  console.log('------ GET TAG SCAN-----');
  const today: string = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const response = await db
  .select()
	.from(vinhGame)
  .where(eq(vinhGame.scan_date, today));

  return NextResponse.json({scans: response});
}

export async function POST(req:any) {
  const body = await req.json();
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const code:string = isValidHex(body.code) ? body.code : null;
  const scan = { 
    scan_date: today,
    tag_id: code,
    node_id: DEVICE_NAME,
  }
  const response = await db.insert(vinhGame).values(scan);

  return NextResponse.json(response);
}