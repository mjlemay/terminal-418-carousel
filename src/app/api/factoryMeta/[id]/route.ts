import { NextResponse } from 'next/server';
import db from '@/db/db';
import { eq } from "drizzle-orm";
import { factoryGame } from '@/db/schema';


export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const response = await db
        .select()
        .from(factoryGame)
        .where(eq(factoryGame.id, id as unknown as number)).limit(1);
    const factoryTile = response[0];
    const meta = factoryTile && factoryTile.meta ? JSON.parse(factoryTile.meta) : null; // Parse the "meta" field if it exists
    let factoryTileDatum = {};
    if (factoryTile) {
      factoryTileDatum = {
        id: factoryTile.id,
        map_name: factoryTile.map_name,
        tile_name: factoryTile.tile_name,
        meta,
        created_at: factoryTile.created_at,
        updated_at: factoryTile.updated_at,
      };
    }
    // Return the user data with the parsed "meta" field
    return NextResponse.json(factoryTileDatum);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
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

  let factoryTile = { 
    id: id,
  }
  const response = await db
  .update(factoryGame)
  .set({ meta }) // Update the "meta" field
  .where(eq(factoryGame.id, id as unknown as number));

  return NextResponse.json(response);
}