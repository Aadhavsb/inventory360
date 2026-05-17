import { CENTRE_CODES, DEPARTMENT_CODES } from '@/lib/constants';
import AssetCounter from '@/lib/models/AssetCounter';

export async function generateAssetId(centre: string, department: string): Promise<string> {
  const centreCode = CENTRE_CODES[centre];
  const deptCode = DEPARTMENT_CODES[department];

  if (!centreCode || !deptCode) {
    throw new Error(`Unknown centre "${centre}" or department "${department}"`);
  }

  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const dateStr = `${yy}${mm}${dd}`;

  const prefix = `${centreCode}-${deptCode}-${dateStr}`;

  // Atomic increment — safe under concurrent requests
  const counter = await AssetCounter.findOneAndUpdate(
    { prefix },
    { $inc: { seq: 1 } },
    { upsert: true, new: true },
  );

  const seq = String(counter.seq).padStart(3, '0');
  return `${prefix}-${seq}`;
}
