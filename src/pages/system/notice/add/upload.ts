import { BASIC_CONFIG } from "@/common/config"
import { notification } from 'antd';
import { RESPONSE_CODE } from '../../../../common/config';

export const myUploadFn = (param: any) => {

  const serverURL = `${BASIC_CONFIG.BASE_URL}/cpay-admin/file/upload/tmp`
  const xhr = new XMLHttpRequest();
  const fd = new FormData()

  const successFn = (response: any) => {
    let res: any = {};
    try {
      res = JSON.parse(xhr.response);
      if (res.code !== RESPONSE_CODE.success) {
        notification.error({ message: res.msg || '上传图片失败' });
        return;
      }
    } catch (error) {
      notification.error({ message: '上传图片失败' });
      return;
    }
    // 假设服务端直接返回文件上传后的地址
    // 上传成功后调用param.success并传入上传后的文件地址
    param.success({
      url: `${BASIC_CONFIG.SOURCE_URL}/${res.data || ''}`,
      // meta: {
      //   id: 'xxx',
      //   title: 'xxx',
      //   alt: 'xxx',
      //   loop: true, // 指定音视频是否循环播放
      //   autoPlay: true, // 指定音视频是否自动播放
      //   controls: true, // 指定音视频是否显示控制栏
      //   poster: 'http://xxx/xx.png', // 指定视频播放器的封面
      // }
    })
  }

  const progressFn = (event: any) => {
    // 上传进度发生变化时调用param.progress
    param.progress(event.loaded / event.total * 100)
  }

  const errorFn = (response: any) => {
    // 上传发生错误时调用param.error
    param.error({
      msg: 'unable to upload.'
    })
  }

  xhr.upload.addEventListener("progress", progressFn, false);
  xhr.addEventListener("load", successFn, false);
  xhr.addEventListener("error", errorFn, false);
  xhr.addEventListener("abort", errorFn, false);
  xhr.withCredentials = true;

  fd.append('file', param.file);
  xhr.open('POST', serverURL, true);
  xhr.send(fd);

}