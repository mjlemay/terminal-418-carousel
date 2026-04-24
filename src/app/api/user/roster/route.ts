import { NextResponse } from 'next/server';
import db from '@/db/db';
import { users, scans } from '@/db/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Build roster from scans (the authoritative source of who has visited)
  const allScans = await db
    .select({ scan_id: scans.scan_id, created_at: scans.created_at })
    .from(scans);

  // Load users table for name/alliance metadata (may not have entries for all scan_ids)
  const allUsers = await db.select().from(users);
  const userMap = new Map(
    allUsers.map((u) => [u.user_id, u])
  );

  // Aggregate per scan_id: first login and distinct years
  const playerMap = new Map<string, { first_login: Date; years: Set<number> }>();
  for (const scan of allScans) {
    if (!scan.scan_id || !scan.created_at) continue;
    const existing = playerMap.get(scan.scan_id);
    const year = new Date(scan.created_at).getFullYear();
    if (existing) {
      if (scan.created_at < existing.first_login) {
        existing.first_login = scan.created_at;
      }
      existing.years.add(year);
    } else {
      playerMap.set(scan.scan_id, {
        first_login: scan.created_at,
        years: new Set([year]),
      });
    }
  }

  const roster = Array.from(playerMap.entries()).map(([scan_id, data]) => {
    const user = userMap.get(scan_id);
    const meta = user?.meta ? JSON.parse(user.meta) : null;
    return {
      user_id: scan_id,
      name: meta?.name ?? null,
      alliance: meta?.alliance ?? null,
      first_login: data.first_login,
      years_attended: Array.from(data.years).sort(),
    };
  });

  // Sort by first login ascending
  roster.sort((a, b) => {
    const aTime = new Date(a.first_login).getTime();
    const bTime = new Date(b.first_login).getTime();
    return aTime - bTime;
  });

  return NextResponse.json({
    total: roster.length,
    players: roster,
  });
}
