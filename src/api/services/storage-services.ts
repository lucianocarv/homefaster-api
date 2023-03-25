import { Readable } from 'stream';
import { streamToBuffer } from '../helpers/stream-to-buffer';
import { IUploadImage } from '../interfaces/image-upload';
import { storage } from '../storage/google-cloud-storage';
import { env_bucketName } from '../../environment';

const storageServices = {
  thumbImageUpload: async ({ to, file, filename, id }: IUploadImage) => {
    const buffer = await streamToBuffer(file);
    const bucket = storage.bucket(env_bucketName);
    const bucketFile = bucket.file(`${to}/${id}/${filename}`);
    const writableStream = bucketFile.createWriteStream();
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(writableStream);
    return { message: 'Upload realizado com sucesso!' };
  },

  deleteFileInStorage: async (path: string) => {
    const res = await storage.bucket(env_bucketName).file(path).delete({ ignoreNotFound: true });
    return res;
  },
};

export default storageServices;
