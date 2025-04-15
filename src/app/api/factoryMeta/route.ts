import { NextResponse } from 'next/server';
import db from '@/db/db';
import { factoryGame } from '@/db/schema';
import { isValidHex } from '@/app/lib/hex';
 
const DEVICE_NAME = process.env.NEXT_PUBLIC_DEVICE_NAME || 'unknown_terminal';

export async function GET() {
  const response = await db
  .select()
	.from(factoryGame);

  return NextResponse.json(response);
}

export async function POST(req:any) {
  const body = await req.json();
  const meta = body.meta; // Extract "meta" from the request body
  let factoryTileDataum = { 
    map_name: body.mapName,
    tile_name: body.tileName,
    meta
  }
  const response = await db.insert(factoryGame).values(factoryTileDataum);

  return NextResponse.json(response);
}