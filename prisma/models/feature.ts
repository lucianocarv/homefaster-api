import * as z from "zod"
import { FeatureType } from "@prisma/client"
import { CompleteFeaturesOnDescriptions, RelatedFeaturesOnDescriptionsModel } from "./index"

export const FeatureModel = z.object({
  id: z.number().int(),
  name: z.string().min(2, { message: "O nome da feature precisa ter pelo menos 2 caracteres!" }),
  type: z.nativeEnum(FeatureType),
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompleteFeature extends z.infer<typeof FeatureModel> {
  features_on_descriptions: CompleteFeaturesOnDescriptions[]
}

/**
 * RelatedFeatureModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedFeatureModel: z.ZodSchema<CompleteFeature> = z.lazy(() => FeatureModel.extend({
  features_on_descriptions: RelatedFeaturesOnDescriptionsModel.array(),
}))
