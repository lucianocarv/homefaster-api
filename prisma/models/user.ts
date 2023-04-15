import * as z from "zod"
import { Role } from "@prisma/client"
import { CompleteFavorite, RelatedFavoriteModel, CompleteProperty, RelatedPropertyModel } from "./index"

export const UserModel = z.object({
  id: z.number().int(),
  first_name: z.string().min(2, { message: "O nome precisar ter 2 ou mais caracteres!" }),
  last_name: z.string().min(2, { message: "O sobrenome precisa ter 2 ou mais caracteres!" }),
  email: z.string().email({ message: "O email precisa ser do tipo email@email.com" }),
  password: z.string(),
  phone: z.string().nullish(),
  role: z.nativeEnum(Role),
  account_confirmed: z.boolean(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  favorites: CompleteFavorite[]
  properties: CompleteProperty[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  favorites: RelatedFavoriteModel.array(),
  properties: RelatedPropertyModel.array(),
}))
