export interface City {
  id?: number;
  name: string;
  global_code: string;
  formatted_address?: string | null;
  type?: string | null;
  img_cover?: string | null;
  province_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export type OptionalFieldsCity = {
  id?: number;
  province_id?: number;
};
