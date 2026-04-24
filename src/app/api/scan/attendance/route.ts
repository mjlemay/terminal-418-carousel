import { NextResponse } from 'next/server';
import db from '@/db/db';
import { scans } from '@/db/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  const allScans = await db
    .select({ scan_id: scans.scan_id, created_at: scans.created_at })
    .from(scans);

  const ids2024 = new Set<string>();
  const ids2025 = new Set<string>();

  for (const scan of allScans) {
    if (!scan.scan_id || !scan.created_at) continue;
    const year = new Date(scan.created_at).getFullYear();
    if (year === 2024) ids2024.add(scan.scan_id);
    if (year === 2025) ids2025.add(scan.scan_id);
  }

  return NextResponse.json({
    '2024': { total: ids2024.size, scan_ids: Array.from(ids2024).sort() },
    '2025': { total: ids2025.size, scan_ids: Array.from(ids2025).sort() },
  });
}
