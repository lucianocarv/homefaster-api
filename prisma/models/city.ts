import * as z from "zod"
import { CompleteProvince, RelatedProvinceModel, CompleteCommunity, RelatedCommunityModel, CompleteProperty, RelatedPropertyModel } from "./index"

export const CityModel = z.object({
  id: z.number().int(),
  name: z.string().max(32, { message: "O nome da cidade não pode ter mais de 32 caracteres!" }).min(3, { message: "O nome da cidade deve ter pelo menos 3 caracteres!" }),
  latitude: z.number(),
  longitude: z.number(),
  place_id: z.string(),
  img_cover: z.string().url({ message: "A imagem de fundo precisa referenciar um endereço url!" }).nullish(),
  province_id: z.number().int(),
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompleteCity extends z.infer<typeof CityModel> {
  province: CompleteProvince
  communities: CompleteCommunity[]
  properties: CompleteProperty[]
}

/**
 * RelatedCityModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCityModel: z.ZodSchema<CompleteCity> = z.lazy(() => CityModel.extend({
  province: RelatedProvinceModel,
  communities: RelatedCommunityModel.array(),
  properties: RelatedPropertyModel.array(),
}))
