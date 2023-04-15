import * as z from "zod"
import { CompleteCity, RelatedCityModel, CompleteProperty, RelatedPropertyModel } from "./index"

export const CommunityModel = z.object({
  id: z.number().int(),
  name: z.string().max(32, { message: "O nome da comunidade não pode ter mais de 32 caracteres!" }).min(3, { message: "O nome da comunidade deve ter pelo menos 3 caracteres!" }),
  global_code: z.string(),
  formatted_address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  img_cover: z.string().url({ message: "A imagem de fundo precisa referenciar um endereço url!" }).nullish(),
  city_id: z.number().int(),
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompleteCommunity extends z.infer<typeof CommunityModel> {
  city: CompleteCity
  properties: CompleteProperty[]
}

/**
 * RelatedCommunityModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCommunityModel: z.ZodSchema<CompleteCommunity> = z.lazy(() => CommunityModel.extend({
  city: RelatedCityModel,
  properties: RelatedPropertyModel.array(),
}))
