import * as z from "zod"
import { CompleteCommunity, RelatedCommunityModel, CompleteDescription, RelatedDescriptionModel, CompleteAddress, RelatedAddressModel, CompleteCity, RelatedCityModel, CompleteFavorite, RelatedFavoriteModel, CompleteUser, RelatedUserModel } from "./index"

export const PropertyModel = z.object({
  id: z.number().int(),
  community_id: z.number().int(),
  city_id: z.number().int(),
  created_at: z.date(),
  updated_at: z.date(),
  user_id: z.number().int(),
})

export interface CompleteProperty extends z.infer<typeof PropertyModel> {
  community: CompleteCommunity
  description?: CompleteDescription | null
  address?: CompleteAddress | null
  city: CompleteCity
  favorites: CompleteFavorite[]
  listed_by: CompleteUser
}

/**
 * RelatedPropertyModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPropertyModel: z.ZodSchema<CompleteProperty> = z.lazy(() => PropertyModel.extend({
  community: RelatedCommunityModel,
  description: RelatedDescriptionModel.nullish(),
  address: RelatedAddressModel.nullish(),
  city: RelatedCityModel,
  favorites: RelatedFavoriteModel.array(),
  listed_by: RelatedUserModel,
}))
