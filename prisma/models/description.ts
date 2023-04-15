import * as z from "zod"
import { CompleteType, RelatedTypeModel, CompleteUtilitiesOnDescriptions, RelatedUtilitiesOnDescriptionsModel, CompleteFeaturesOnDescriptions, RelatedFeaturesOnDescriptionsModel, CompleteProperty, RelatedPropertyModel } from "./index"

export const DescriptionModel = z.object({
  id: z.number().int(),
  title: z.string(),
  thumb: z.string(),
  price: z.number(),
  bathrooms: z.number().int(),
  badrooms: z.number().int(),
  furnished: z.boolean(),
  rented: z.boolean().nullish(),
  property_area: z.number(),
  pets_cats: z.number().int(),
  pets_dogs: z.number().int(),
  smoking: z.boolean(),
  type_id: z.number().int(),
  created_at: z.date(),
  updated_at: z.date(),
  property_id: z.number().int(),
})

export interface CompleteDescription extends z.infer<typeof DescriptionModel> {
  type: CompleteType
  utilities: CompleteUtilitiesOnDescriptions[]
  features: CompleteFeaturesOnDescriptions[]
  property: CompleteProperty
}

/**
 * RelatedDescriptionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedDescriptionModel: z.ZodSchema<CompleteDescription> = z.lazy(() => DescriptionModel.extend({
  type: RelatedTypeModel,
  utilities: RelatedUtilitiesOnDescriptionsModel.array(),
  features: RelatedFeaturesOnDescriptionsModel.array(),
  property: RelatedPropertyModel,
}))
