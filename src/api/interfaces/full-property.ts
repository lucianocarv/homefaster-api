import { Address, Description, Manager } from '@prisma/client';

export interface IFullProperty {
  id: number;
  community_id: number;
  manager_id: number;
  created_at: Date;
  updated_at: Date;
  city_id: number;
  address: Address;
  description: Description;
  manager: Manager;
  features: string[];
  utilities: string[];
}
