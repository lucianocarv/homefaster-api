import { Storage } from '@google-cloud/storage';
import path from 'path';

const storage = new Storage({
  keyFilename: path.join('keys/cloud-storage-upload.json'),
  projectId: process.env.CLOUD_PROJECT_ID,
});

export { storage };
