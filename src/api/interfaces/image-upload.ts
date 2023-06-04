import { Readable } from 'stream';

export interface FileUpload {
  file: Readable;
  path: string;
}
