import { Storage } from '@google-cloud/storage';
import { CLOUD_STORAGE_CLIENT_EMAIL, CLOUD_STORAGE_CLIENT_PRIVATE_KEY } from '../environment';

const storage = new Storage({
  credentials: {
    client_email: CLOUD_STORAGE_CLIENT_EMAIL,
    private_key: CLOUD_STORAGE_CLIENT_PRIVATE_KEY
  }
});

export { storage };
