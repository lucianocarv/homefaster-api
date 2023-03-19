import { Address, Description } from '@prisma/client';

export interface IFullProperty {
  id: number;
  community_id: number;
  manager_id: number;
  created_at: Date;
  updated_at: Date;
  city_id: number;
  address: Address;
  description: Description;
  features: string[];
  utilities: string[];
}
