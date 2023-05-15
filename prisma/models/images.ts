import * as z from "zod"
import { CompleteProperty, RelatedPropertyModel } from "./index"

export const ImagesModel = z.object({
  id: z.number().int(),
  url: z.string(),
  property_id: z.number().int(),
})

export interface CompleteImages extends z.infer<typeof ImagesModel> {
  property: CompleteProperty
}

/**
 * RelatedImagesModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedImagesModel: z.ZodSchema<CompleteImages> = z.lazy(() => ImagesModel.extend({
  property: RelatedPropertyModel,
}))
