import { Readable } from 'stream';
import { streamToBuffer } from '../helpers/stream-to-buffer';
import { IUploadImage } from '../interfaces/image-upload';
import { storage } from '../config/storage/google-cloud-storage';
import { env_bucketName } from '../../environment';

const storageServices = {
  uploadFile: async ({ to, file, filename, id }: IUploadImage) => {
    if (!env_bucketName) throw new Error('É necessário informar um bucket!');
    try {
      const buffer = await streamToBuffer(file);
      const bucket = storage.bucket(env_bucketName);
      const bucketFile = bucket.file(`zqq/${to}/${id}/${filename}`);
      const writableStream = bucketFile.createWriteStream();
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);
      readableStream.pipe(writableStream);

      return { message: 'Upload realizado com sucesso!!!!!!!' };
    } catch (error) {
      return error;
    }
  },

  deleteFileInStorage: async (path: string) => {
    if (!env_bucketName) throw new Error('É necessário informar um bucket!');
    const res = await storage.bucket(env_bucketName).file(path).delete({ ignoreNotFound: true });
    return res;
  }
};

export default storageServices;
