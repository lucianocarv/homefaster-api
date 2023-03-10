import { Readable } from 'stream';

export interface IUploadImage {
  to: 'properties' | 'communities' | 'cities' | 'provinces';
  file: Readable;
  filename: string;
  id: number;
}
