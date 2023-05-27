import * as z from "zod"
import { CompleteType, RelatedTypeModel, CompleteUtilitiesOnDescriptions, RelatedUtilitiesOnDescriptionsModel, CompleteFeaturesOnDescriptions, RelatedFeaturesOnDescriptionsModel, CompleteUser, RelatedUserModel, CompleteProperty, RelatedPropertyModel } from "./index"

export const DescriptionModel = z.object({
  id: z.number().int(),
  title: z.string(),
  img_cover: z.string().nullish(),
  price: z.number().positive({ message: "O valor do aluguel precisa ser positivo!" }),
  bathrooms: z.number().int().min(1, { message: "A quantidade de banheiros precisar ser igual ou maior que 1" }),
  badrooms: z.number().int().min(1, { message: "A quantidade de quartos precisar ser igual ou maior que 1" }),
  furnished: z.boolean(),
  rented: z.boolean(),
  property_area: z.number().min(1, { message: "A área da propriedade precisar ser igual ou maior que 1" }),
  pets_cats: z.number().int().min(0, { message: "A quantidade de gatos precisar ser igual ou maior que 0" }),
  pets_dogs: z.number().int().min(0, { message: "A quantidade de cães precisar ser igual ou maior que 0" }),
  smoking: z.boolean(),
  type_id: z.number().int(),
  user_id: z.number().int(),
  created_at: z.date(),
  updated_at: z.date(),
  property_id: z.number().int(),
})

export interface CompleteDescription extends z.infer<typeof DescriptionModel> {
  type: CompleteType
  utilities: CompleteUtilitiesOnDescriptions[]
  features: CompleteFeaturesOnDescriptions[]
  created_by: CompleteUser
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
  created_by: RelatedUserModel,
  property: RelatedPropertyModel,
}))
