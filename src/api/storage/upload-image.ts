import { Readable } from 'stream';
import { getFileName } from '../helpers/get-filename';
import { streamToBuffer } from '../helpers/stream-to-buffer';
import { IUploadImage } from '../interfaces/image-upload';
import { citiesServices } from '../services/city-services';
import { communityServices } from '../services/community-services';
import { propertyServices } from '../services/property-services';
import { provinceServices } from '../services/province-services';
import { storage } from './google-cloud-storage';
import { env_bucketName, env_storageBaseUrl } from '../../environment';

const imageUpload = async ({ to, file, filename, id }: IUploadImage) => {
  try {
    const buffer = await streamToBuffer(file);
    const bucket = storage.bucket(env_bucketName);
    const bucketFile = bucket.file(`${to}/${id}/${filename}`);
    const writableStream = bucketFile.createWriteStream();
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(writableStream);
    const updateUrl = await updateImgUrl({ to, id, filename });
    return updateUrl;
  } catch (error) {
    return error;
  }
};

const message = 'Imagem alterada com sucesso!';

const updateImgUrl = async ({ to, id, filename }: { to: string; id: number; filename: string }) => {
  if (to == 'provinces') {
    try {
      const province = await provinceServices.getOneProvince(id);
      if (province?.img_cover) {
        const filename = await getFileName(province.img_cover);
        await storage.bucket(env_bucketName).file(`${to}/${id}/${filename}`).delete({ ignoreNotFound: true });
      }
      await provinceServices.updateOneProvince({ id, attibutes: { img_cover: `${env_storageBaseUrl}${to}/${id}/${filename}` } });
      return { message };
    } catch (error) {
      return error;
    }
  }
  if (to == 'cities') {
    try {
      const city = await citiesServices.getOneCity(id);
      if (city?.img_cover) {
        const filename = await getFileName(city.img_cover);
        await storage.bucket(env_bucketName).file(`${to}/${id}/${filename}`).delete({ ignoreNotFound: true });
      }
      await citiesServices.updateOneCity({ id, attributes: { img_cover: `${env_storageBaseUrl}${to}/${id}/${filename}` } });
      return { message };
    } catch (error) {
      return error;
    }
  }
  if (to == 'communities') {
    try {
      const community = await communityServices.getOneCommunity(id);
      if (community?.img_cover) {
        const filename = await getFileName(community.img_cover);
        await storage.bucket(env_bucketName).file(`${to}/${id}/${filename}`).delete({ ignoreNotFound: true });
      }
      await communityServices.updateOneCommunity({
        id,
        attributes: { img_cover: `${env_storageBaseUrl}${to}/${id}/${filename}` },
      });
      return { message };
    } catch (error) {
      return error;
    }
  }
  if (to == 'properties') {
    try {
      const property = (await propertyServices.getOneProperty(id)) as { description: { thumb: string } };
      if (property.description.thumb) {
        const filename = await getFileName(property.description.thumb);
        await storage.bucket(env_bucketName).file(`${to}/${id}/${filename}`).delete({ ignoreNotFound: true });
      }
      await propertyServices.updateOneProperty(id, { description: { thumb: `${env_storageBaseUrl}${to}/${id}/${filename}` } });
      return { message };
    } catch (error) {
      return error;
    }
  }
};

export { imageUpload };
