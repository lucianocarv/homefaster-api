import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteProperty, RelatedPropertyModel } from "./index"

export const FavoriteModel = z.object({
  id: z.number().int(),
  user_id: z.number().int(),
  property_id: z.number().int(),
})

export interface CompleteFavorite extends z.infer<typeof FavoriteModel> {
  user: CompleteUser
  property: CompleteProperty
}

/**
 * RelatedFavoriteModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedFavoriteModel: z.ZodSchema<CompleteFavorite> = z.lazy(() => FavoriteModel.extend({
  user: RelatedUserModel,
  property: RelatedPropertyModel,
}))
