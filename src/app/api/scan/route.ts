import { NextResponse } from 'next/server';
import db from '@/db/db';
import { scans } from '@/db/schema';
import { isValidHex } from '@/app/lib/hex';
 
const DEVICE_NAME = process.env.DEVICE_NAME || 'unknown_terminal';

export async function GET() {
  const response = await db
  .select()
	.from(scans);

  return NextResponse.json({scans: response});
}

export async function POST(req:any) {
  const body = await req.json();
  const code:string = isValidHex(body.code) ? body.code : null;
  let scan = { 
    scan_id: code,
    device_id: DEVICE_NAME,
  }
  const response = await db.insert(scans).values(scan);

  return NextResponse.json(response);
}