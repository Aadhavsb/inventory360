import { z } from 'zod';

export const assetSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['long-term', 'medical', 'perishable']),
  status: z.enum(['active', 'phased out']),
  acquired: z.enum(['donated', 'bought']),
  date: z.string(), // ISO date string
  site: z.string().min(1),
});
