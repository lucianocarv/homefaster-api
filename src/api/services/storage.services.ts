import { Readable } from 'stream';
import { streamToBuffer } from '../helpers/stream-to-buffer';
import { FileUpload } from '../interfaces/image-upload';
import { storage } from '../../config/storage/google-cloud-storage.config';
import { CLOUD_BUCKET_NAME } from '../../config/environment';
import { CustomError } from '../helpers/custom-error';
import { FastifyError } from 'fastify';

const storageServices = {
  uploadFile: async ({ file, path }: FileUpload): Promise<{ filePath: string } | undefined> => {
    try {
      const buffer = await streamToBuffer(file);
      const bucket = storage.bucket(CLOUD_BUCKET_NAME);
      const bucketExists = await bucket.exists();
      if (bucketExists[0]) {
        const bucketFile = bucket.file(path);
        const writableStream = bucketFile.createWriteStream();
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(writableStream);
        return { filePath: bucketFile.name } as { filePath: string };
      }
      throw CustomError('_', 'O bucket informado não existe!', 500);
    } catch (error) {
      const err = error as FastifyError;
      if (err.code) throw error;
      throw CustomError('_', 'Não foi possível fazer o upload do arquivo!', 500);
    }
  },

  deleteFile: async (path: string) => {
    try {
      const res = await storage.bucket(CLOUD_BUCKET_NAME).file(path).delete();
      return res;
    } catch (error) {
      return error;
    }
  }
};

export default storageServices;
