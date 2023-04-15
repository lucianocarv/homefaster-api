import * as z from "zod"
import { Role } from "@prisma/client"
import { CompleteFavorite, RelatedFavoriteModel, CompleteProperty, RelatedPropertyModel } from "./index"

export const UserModel = z.object({
  id: z.number().int(),
  first_name: z.string(),
  last_name: z.string(),
  avatar_url: z.string(),
  email: z.string(),
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
