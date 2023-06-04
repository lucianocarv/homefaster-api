import * as env from 'env-var';

export const GMAPS_VALIDATE_ADDRESS_API_URL = env.get('GMAPS_VALIDATE_ADDRESS_API_URL').required().asString();
export const GMAPS_GEOCODE_API_URL = env.get('GMAPS_GEOCODE_API_URL').required().asString();
export const GMAPS_API_KEY = env.get('GMAPS_API_KEY').required().asString();
export const JWT_SECRET = env.get('JWT_SECRET').required().asString();
export const CLOUD_BUCKET_NAME = env.get('CLOUD_BUCKET_NAME').required().asString();
// export const CLOUD_STORAGE_BUCKET_BASE_URL = env.get('CLOUD_STORAGE_BUCKET_BASE_URL').required().asString();
export const CLOUD_STORAGE_CLIENT_EMAIL = env.get('CLOUD_STORAGE_CLIENT_EMAIL').required().asString();
export const CLOUD_STORAGE_CLIENT_PRIVATE_KEY = env.get('CLOUD_STORAGE_CLIENT_PRIVATE_KEY').required().asString();
export const TEST_EMAIL = env.get('TEST_EMAIL').required().asString();
export const TEST_PASSWORD = env.get('TEST_PASSWORD').required().asString();
// export const TWILIO_SENDGRID = env.get('TWILIO_SENDGRID');
