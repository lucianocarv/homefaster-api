import * as z from "zod"
import { CompleteDescription, RelatedDescriptionModel } from "./index"

export const TypeModel = z.object({
  id: z.number().int(),
  name: z.string().min(2, { message: "O nome do tipo de propriedade precisar ter no mínimo 2 caracteres!" }),
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompleteType extends z.infer<typeof TypeModel> {
  Description: CompleteDescription[]
}

/**
 * RelatedTypeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTypeModel: z.ZodSchema<CompleteType> = z.lazy(() => TypeModel.extend({
  Description: RelatedDescriptionModel.array(),
}))
