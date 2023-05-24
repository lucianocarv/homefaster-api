import { Storage } from '@google-cloud/storage';
import { env_storageClientEmail, env_storagePrivateKeyAccess } from '../../../environment';

const storage = new Storage({
  credentials: {
    client_email: env_storageClientEmail,
    private_key: env_storagePrivateKeyAccess
  }
});

export { storage };
