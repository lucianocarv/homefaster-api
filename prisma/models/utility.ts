import * as z from "zod"
import { CompleteUtilitiesOnDescriptions, RelatedUtilitiesOnDescriptionsModel } from "./index"

export const UtilityModel = z.object({
  id: z.number().int(),
  name: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompleteUtility extends z.infer<typeof UtilityModel> {
  utilities_on_descriptions: CompleteUtilitiesOnDescriptions[]
}

/**
 * RelatedUtilityModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUtilityModel: z.ZodSchema<CompleteUtility> = z.lazy(() => UtilityModel.extend({
  utilities_on_descriptions: RelatedUtilitiesOnDescriptionsModel.array(),
}))
