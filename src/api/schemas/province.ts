import { z } from 'zod';

export const ProvinceSchema = z.object({
  name: z.string().min(3).max(32),
});
