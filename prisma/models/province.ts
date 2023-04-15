import * as z from "zod"
import { CompleteCity, RelatedCityModel } from "./index"

export const ProvinceModel = z.object({
  id: z.number().int(),
  name: z.string().max(32, { message: "O nome da província não pode ter mais de 32 caracteres!" }).min(3, { message: "O nome da província deve ter pelo menos 3 caracteres!" }),
  short_name: z.string().length(2, { message: "A abreviação deve ter apenas 2 caracteres!" }),
  img_cover: z.string().nullish(),
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompleteProvince extends z.infer<typeof ProvinceModel> {
  cities: CompleteCity[]
}

/**
 * RelatedProvinceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProvinceModel: z.ZodSchema<CompleteProvince> = z.lazy(() => ProvinceModel.extend({
  cities: RelatedCityModel.array(),
}))
