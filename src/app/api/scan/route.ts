import { NextResponse } from 'next/server';
import sql from '@/app/lib/db';
import { isValidHex } from '@/app/lib/hex';
 
export async function GET() {

  const response = await sql` 
    SELECT * FROM scans ORDER BY created_at DESC 
  `

  return NextResponse.json({scans: response});
}

export async function POST(req) {
  const body = await req.json();
  console.log('body', body);
  const code = body.code || null;
  const date = new Date();
  const now = date.toISOString();

  let scan = {
    raw_value: code || '' ,
    mifare_hex: isValidHex(code) ? code : null,
    created_at: now,
  }

  const response = await sql`
    insert into scans ${
      sql(scan, 'raw_value', 'mifare_hex', 'created_at')
    }
  `

  return NextResponse.json(response);
}

// export async function PUT() {
//   return NextResponse.json({ message: 'Hello - PUT' });
// }

// export async function DELETE() {
//   return NextResponse.json({ message: 'Hello - DELETE' });
// }