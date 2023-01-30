export interface Province {
  id?: number;
  name: string;
  short_name: string;
  global_code: string;
  formatted_address?: string | null;
  type?: string | null;
  img_cover?: string | null;
}
