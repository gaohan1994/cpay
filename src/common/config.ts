export const isDevelopment = () => process.env.NODE_ENV === 'development';

/**
 * 陈金燕本地   http://172.30.200.11:8082
 * 测试环境     http://172.30.20.100:8089
 */
export const BASE_URL = isDevelopment()
  ? 'http://172.30.20.100:8089'
  : 'http://172.30.20.100:9080';

export const SOURCE_URL = 'http://172.30.20.100:9200';

/**
 * 请求返回的code枚举
 */
export const RESPONSE_CODE = {
  success: 'response.success',
};

export const BASIC_CONFIG = {
  BASE_URL,
  RESPONSE_CODE,
  SOURCE_URL
};
