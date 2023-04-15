import * as z from "zod"
import { CompleteDescription, RelatedDescriptionModel, CompleteUtility, RelatedUtilityModel } from "./index"

export const UtilitiesOnDescriptionsModel = z.object({
  description_id: z.number().int(),
  utility_id: z.number().int(),
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompleteUtilitiesOnDescriptions extends z.infer<typeof UtilitiesOnDescriptionsModel> {
  description: CompleteDescription
  utility: CompleteUtility
}

/**
 * RelatedUtilitiesOnDescriptionsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUtilitiesOnDescriptionsModel: z.ZodSchema<CompleteUtilitiesOnDescriptions> = z.lazy(() => UtilitiesOnDescriptionsModel.extend({
  description: RelatedDescriptionModel,
  utility: RelatedUtilityModel,
}))
