import { CENTRE_CODES, DEPARTMENT_CODES } from '@/lib/constants';
import Asset from '@/lib/models/Asset';

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

  const count = await Asset.countDocuments({
    assetId: { $regex: `^${prefix}` },
  });

  const seq = String(count + 1).padStart(3, '0');
  return `${prefix}-${seq}`;
}
