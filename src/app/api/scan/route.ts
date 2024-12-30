import { NextResponse } from 'next/server';
import db from '@/db/db';
import { scans } from '@/db/schema';
import { isValidHex } from '@/app/lib/hex';
 
export async function GET() {

  // const response = await sql` 
  //   SELECT * FROM scans ORDER BY created_at DESC 
  // `
  const response = await db
  .select()
	.from(scans);

  return NextResponse.json({scans: response});
}

export async function POST(req:any) {
  const body = await req.json();
  const code:string = isValidHex(body.code) ? body.code : null;
  let scan = { scan_id: code }

  const response = await db.insert(scans).values(scan);

  return NextResponse.json(response);
}

// export async function PUT() {
//   return NextResponse.json({ message: 'Hello - PUT' });
// }

// export async function DELETE() {
//   return NextResponse.json({ message: 'Hello - DELETE' });
// }