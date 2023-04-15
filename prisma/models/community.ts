import * as z from "zod"
import { CompleteCity, RelatedCityModel, CompleteProperty, RelatedPropertyModel } from "./index"

export const CommunityModel = z.object({
  id: z.number().int(),
  name: z.string(),
  global_code: z.string(),
  formatted_address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  img_cover: z.string().nullish(),
  city_id: z.number().int(),
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompleteCommunity extends z.infer<typeof CommunityModel> {
  city: CompleteCity
  properties: CompleteProperty[]
}

/**
 * RelatedCommunityModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCommunityModel: z.ZodSchema<CompleteCommunity> = z.lazy(() => CommunityModel.extend({
  city: RelatedCityModel,
  properties: RelatedPropertyModel.array(),
}))
