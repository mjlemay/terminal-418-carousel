import { NextResponse } from 'next/server';
import db from '@/db/db';
import { scans } from '@/db/schema';
import { isValidHex } from '@/app/lib/hex';
 
const DEVICE_NAME = process.env.DEVICE_NAME || 'unknown_terminal';

export async function GET() {
  console.log('------ GET SCANS -----');
  const response = await db
  .select()
	.from(scans);

  return NextResponse.json(response);
}

export async function POST(req:any) {
  const body = await req.json();
  const scanId:string = isValidHex(body.scanId) ? body.scanId : null;
  let scan = { 
    scan_id: scanId,
    device_id: DEVICE_NAME,
  }
  const response = await db.insert(scans).values(scan);

  return NextResponse.json(response);
}