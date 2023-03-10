import { pipeline, Readable } from 'stream';
import { streamToBuffer } from '../helpers/stream-to-buffer';
import { IUploadImage } from '../interfaces/image-upload';
import { citiesServices } from '../services/city-services';
import { communityServices } from '../services/community-services';
import { propertyServices } from '../services/property-services';
import { provinceServices } from '../services/province-services';
import { storage } from './google-cloud-storage';

const storageBaseUrl = process.env.CLOUD_STORAGE_IMAGES_URL;

const imageUpload = async ({ to, file, filename, id }: IUploadImage) => {
  try {
    const buffer = await streamToBuffer(file);
    const bucket = storage.bucket('rentfaster-clone-files');
    const bucketFile = bucket.file(`${to}/${id}/${filename}`);
    const writableStream = bucketFile.createWriteStream();
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(writableStream);
    const updateThumb = updateThumbUrl({ to, id, filename });
    return updateThumb;
  } catch (error) {
    return error;
  }
};

const updateThumbUrl = async ({ to, id, filename }: { to: string; id: number; filename: string }) => {
  if (to == 'provinces') {
    await provinceServices.update({ id, attibutes: { img_cover: `${storageBaseUrl}${to}/${id}/${filename}` } });
    return { message: 'Imagem da província alterada com sucesso!' };
  }
  if (to == 'cities') {
    await citiesServices.update({ id, attributes: { img_cover: `${storageBaseUrl}${to}/${id}/${filename}` } });
    return { message: 'Imagem da cidade alterada com sucesso!' };
  }
  if (to == 'communities') {
    await communityServices.update({ id, attributes: { img_cover: `${storageBaseUrl}${to}/${id}/${filename}` } });
    return { message: 'Imagem da comunidade alterada com sucesso!' };
  }
  if (to == 'properties') {
    await propertyServices.update(id, { description: { thumb: `${storageBaseUrl}${to}/${id}/${filename}` } });
    return { message: 'Imagem da propriedade alterada com sucesso!' };
  }
};

export { imageUpload };
