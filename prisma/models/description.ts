import * as z from 'zod';
import {
  CompleteType,
  RelatedTypeModel,
  CompleteUtilitiesOnDescriptions,
  RelatedUtilitiesOnDescriptionsModel,
  CompleteFeaturesOnDescriptions,
  RelatedFeaturesOnDescriptionsModel,
  CompleteProperty,
  RelatedPropertyModel,
} from './index';

export const DescriptionModel = z.object({
  id: z.number().int(),
  title: z.string(),
  thumb: z.string().url({ message: 'A imagem de fundo precisa referenciar um endereço url!' }),
  price: z.number().positive({ message: 'O valor do aluguel precisa ser positivo!' }),
  bathrooms: z.number().int().min(1, { message: 'A quantidade de banheiros precisar ser igual ou maior que 1' }),
  badrooms: z.number().int().min(1, { message: 'A quantidade de quartos precisar ser igual ou maior que 1' }),
  furnished: z.boolean(),
  rented: z.boolean(),
  property_area: z.number().min(1, { message: 'A área da propriedade precisar ser igual ou maior que 1' }),
  pets_cats: z.number().int(),
  pets_dogs: z.number().int(),
  smoking: z.boolean(),
  type_id: z.number().int(),
  created_at: z.date(),
  updated_at: z.date(),
  property_id: z.number().int(),
});

export interface CompleteDescription extends z.infer<typeof DescriptionModel> {
  type: CompleteType;
  utilities: CompleteUtilitiesOnDescriptions[];
  features: CompleteFeaturesOnDescriptions[];
  property: CompleteProperty;
}

/**
 * RelatedDescriptionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedDescriptionModel: z.ZodSchema<CompleteDescription> = z.lazy(() =>
  DescriptionModel.extend({
    type: RelatedTypeModel,
    utilities: RelatedUtilitiesOnDescriptionsModel.array(),
    features: RelatedFeaturesOnDescriptionsModel.array(),
    property: RelatedPropertyModel,
  })
);
