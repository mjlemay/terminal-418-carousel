import { NextResponse } from 'next/server';
import db from '@/db/db';
import { users, scans } from '@/db/schema';
import { min } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  const allUsers = await db.select().from(users);

  const firstScans = await db
    .select({
      scan_id: scans.scan_id,
      first_login: min(scans.created_at),
    })
    .from(scans)
    .groupBy(scans.scan_id);

  const firstScanMap = new Map(
    firstScans.map((s) => [s.scan_id, s.first_login])
  );

  // Get all scans to derive distinct years attended per user
  const allScans = await db
    .select({ scan_id: scans.scan_id, created_at: scans.created_at })
    .from(scans);

  const yearsMap = new Map<string | null, Set<number>>();
  for (const scan of allScans) {
    if (!scan.scan_id || !scan.created_at) continue;
    const year = new Date(scan.created_at).getFullYear();
    if (!yearsMap.has(scan.scan_id)) {
      yearsMap.set(scan.scan_id, new Set());
    }
    yearsMap.get(scan.scan_id)!.add(year);
  }

  const roster = allUsers.map((user) => {
    const meta = user.meta ? JSON.parse(user.meta) : null;
    const years = yearsMap.get(user.user_id);
    return {
      user_id: user.user_id,
      name: meta?.name ?? null,
      alliance: meta?.alliance ?? null,
      first_login: firstScanMap.get(user.user_id) ?? user.created_at,
      years_attended: years ? Array.from(years).sort() : [],
    };
  });

  // Sort by first login ascending
  roster.sort((a, b) => {
    const aTime = a.first_login ? new Date(a.first_login).getTime() : 0;
    const bTime = b.first_login ? new Date(b.first_login).getTime() : 0;
    return aTime - bTime;
  });

  return NextResponse.json({
    total: roster.length,
    players: roster,
  });
}
