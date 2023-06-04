import * as z from "zod"
import { CompleteProperty, RelatedPropertyModel, CompleteUser, RelatedUserModel } from "./index"

export const ImageModel = z.object({
  id: z.number().int(),
  url: z.string(),
  property_id: z.number().int(),
  user_id: z.number().int(),
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompleteImage extends z.infer<typeof ImageModel> {
  property: CompleteProperty
  uploaded_by: CompleteUser
}

/**
 * RelatedImageModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedImageModel: z.ZodSchema<CompleteImage> = z.lazy(() => ImageModel.extend({
  property: RelatedPropertyModel,
  uploaded_by: RelatedUserModel,
}))
