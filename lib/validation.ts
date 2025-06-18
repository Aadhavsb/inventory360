import { z } from 'zod';

export const assetSchema = z.object({
  name: z.string().min(1, 'Asset name is required'),
  type: z.enum(['long-term', 'medical', 'perishable'], {
    errorMap: () => ({ message: 'Please select a valid asset type' })
  }),
  status: z.enum(['active', 'phased out'], {
    errorMap: () => ({ message: 'Please select a valid status' })
  }),
  acquired: z.enum(['donated', 'bought'], {
    errorMap: () => ({ message: 'Please select how the asset was acquired' })
  }),
  date: z.string().min(1, 'Date is required').refine((date) => {
    // Validate it's a valid date string
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, 'Please enter a valid date'),
  site: z.string().min(1, 'Please select a wildlife site'),
  loggedBy: z.object({
    name: z.string().min(1, 'User name is required'),
    email: z.string().email('Valid email is required')
  })
});
