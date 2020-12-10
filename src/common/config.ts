export const isDevelopment = () => process.env.PROJECT_ENV === 'development';

export const isProduction = () => {
  switch (process.env.PROJECT_ENV) {
    case 'production':
      return true;
    case 'development':
      return false;
    default:
      return false;
  }
}

/**
 * 陈金燕本地   http://172.30.200.11:8082
 * 测试环境     http://172.30.20.100:8089
 */
export const BASE_URL = !isProduction()
  // ? 'http://localhost:8080/cpay-admin'
  // : 'http://localhost:8080/cpay-admin'
  ? 'http://172.30.20.100:48089'
  : 'http://172.30.20.100:48089';

console.log('process.env.PROJECT_ENV', process.env.PROJECT_ENV);
export const SOURCE_URL = 'http://172.30.20.100:9200';
// export const SOURCE_URL = 'https://182.119.90.205:58888'

/**
 * 请求返回的code枚举
 */
export const RESPONSE_CODE = {
  success: 'response.success',
};

export const BASIC_CONFIG = {
  BASE_URL,
  RESPONSE_CODE,
  SOURCE_URL,
};

export const getDownloadPath = (filename: string): string => {
  const href = `${BASE_URL}/cpay-admin/tmp/download?fileName=${filename}`;
// window.location.href = href
  const body = document.getElementsByTagName('body')[0];
  const downloadForm = document.createElement('form');
  downloadForm.method = 'POST';
  downloadForm.action = href;
  body.appendChild(downloadForm);
  downloadForm.submit();
  downloadForm.remove();
  return '';
};
