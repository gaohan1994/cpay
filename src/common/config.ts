export const isDevelopment = () => process.env.NODE_ENV === 'development';

export const BASE_URL = isDevelopment()
  ? 'http://172.30.20.100:9080/'
  : 'http://172.30.20.100:9080/';

export const BASIC_CONFIG = {
  BASE_URL
};
