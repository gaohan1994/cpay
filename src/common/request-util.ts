import { BASE_URL } from './config';

export const formartQuery = (params: any) => {
  console.log('params', params);
};

/**
 * @todo [传入条件返回格式化请求数据]
 * @param json
 */
export const jsonToQueryString = (json: any) => {
  return (
    '?' +
    Object.keys(json)
      .map(function(key: any) {
        return key + '=' + json[key];
      })
      .join('&')
  );
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
    let contentType = 'application/json';
    contentType = params.contentType || contentType;
    const option: any = {
      data: data,
      method: method,
      headers: {
        'content-type': contentType
      }
    };
    console.log('option: ', option);
    return fetch(`${BASE_URL}${url}`, option).then(res => res.json());
  }

  get(url: string, data: string = '') {
    let option = { url, data };
    return this.baseOptions(option);
  }

  post(url: string, data: any) {
    let params = {
      url,
      data: typeof data === 'string' ? data : JSON.stringify(data)
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
