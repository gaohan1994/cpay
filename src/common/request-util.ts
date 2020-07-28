import { BASE_URL } from './config';
import { notification } from 'antd';
import { IResponseResult, IFormatResult } from './type';
import { merge } from 'lodash';

export const formartQuery = (params: any) => {
  console.log('params', params);
};

/**
 * @todo [传入条件返回格式化请求数据]
 * @param json
 */
export const jsonToQueryString = (json: any) => {
  const field = Object.keys(json)
    .map(function (key: any) {
      if (!!json[key]) {
        return key + '=' + json[key];
      }
    })
    .filter((item) => !!item)
    .join('&');
  return field.length > 0 ? `?${field}` : '';
};

/**
 * @todo 将body数据转成urlencoded类型
 * @param json
 */
export const jsonToForm = (json: any): string => {
  return Object.keys(json)
    .map(function (key: any) {
      if (!!json[key]) {
        return key + '=' + json[key];
      }
    })
    .filter((item) => !!item)
    .join('&');
};

export const formatListResult = <T>(
  result: IResponseResult<any>
): IFormatResult<T> => {
  console.log('result:', result);
  const mergeResult = merge({}, result);
  return {
    list: mergeResult.data.rows || [],
    total: mergeResult.data.total || 0,
  };
};

/**
 * fetch 工具
 *
 * @author Ghan
 * @class ApiRequest
 */
class ApiRequest {
  baseOptions(params: any, method: string = 'GET'): Promise<any> {
    let { url, data } = params;
    // let contentType = 'application/json';
    let contentType =
      url === '/cpay-admin/login'
        ? 'application/x-www-form-urlencoded'
        : 'application/json';
    contentType = params.contentType || contentType;
    const option: RequestInit = {
      // data: data,
      method: method,
      headers: {
        'content-type': contentType,
      },
      credentials: 'include',
      ...(!!data ? { body: data } : {}),
    };
    console.log('option: ', option);
    return fetch(`${BASE_URL}${url}`, option)
      .then((res) => res.json())
      .catch((error) => {
        notification.warn({
          message: error.message,
        });
      });
  }

  get(url: string, data: string = '') {
    let option = { url, data };
    return this.baseOptions(option);
  }

  post(url: string, data: any) {
    let params = {
      url,
      data: typeof data === 'string' ? data : JSON.stringify(data),
    };
    return this.baseOptions(params, 'POST');
  }

  put(url: string, data: string = '') {
    let option = { url, data };
    return this.baseOptions(option, 'PUT');
  }

  delete(url: string, data: string = '') {
    let option = { url, data };
    return this.baseOptions(option, 'DELETE');
  }
}

export default new ApiRequest();
