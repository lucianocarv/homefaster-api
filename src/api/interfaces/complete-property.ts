import { Address, Description, Property } from '@prisma/client';

export interface ICompleteProperty {
  property: Property;
  address: Address;
  description: Description;
  utilities: number[];
  features: number[];
}
