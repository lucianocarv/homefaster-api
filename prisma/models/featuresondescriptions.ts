import * as z from "zod"
import { CompleteDescription, RelatedDescriptionModel, CompleteFeature, RelatedFeatureModel } from "./index"

export const FeaturesOnDescriptionsModel = z.object({
  description_id: z.number().int(),
  feature_id: z.number().int(),
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompleteFeaturesOnDescriptions extends z.infer<typeof FeaturesOnDescriptionsModel> {
  description: CompleteDescription
  feature: CompleteFeature
}

/**
 * RelatedFeaturesOnDescriptionsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedFeaturesOnDescriptionsModel: z.ZodSchema<CompleteFeaturesOnDescriptions> = z.lazy(() => FeaturesOnDescriptionsModel.extend({
  description: RelatedDescriptionModel,
  feature: RelatedFeatureModel,
}))
