import * as z from "zod"
import { CompleteProperty, RelatedPropertyModel } from "./index"

export const AddressModel = z.object({
  id: z.number().int(),
  number: z.number().int(),
  street: z.string(),
  postal_code: z.string().nullish(),
  global_code: z.string(),
  place_id: z.string(),
  formatted_address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  community: z.string(),
  city: z.string(),
  province: z.string(),
  property_id: z.number().int(),
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompleteAddress extends z.infer<typeof AddressModel> {
  property: CompleteProperty
}

/**
 * RelatedAddressModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAddressModel: z.ZodSchema<CompleteAddress> = z.lazy(() => AddressModel.extend({
  property: RelatedPropertyModel,
}))
