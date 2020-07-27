export const isDevelopment = () => process.env.NODE_ENV === 'development';

/**
 * 陈金燕本地 http://172.30.200.11:8082/
 */
export const BASE_URL = isDevelopment()
  ? 'http://172.30.200.11:8082'
  : 'http://172.30.20.100:9080';

export const BASIC_CONFIG = {
  BASE_URL,
};
