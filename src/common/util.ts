import { BASIC_CONFIG } from "./config";

/**
 * 根据上传图片列表获取路径
 */
export  const formatUploadFile = (list: any[]): string[] => {
  let picPaths = [];
  for (let i = 0; i < list.length; i++) {
    let originPic = '';
    if (list[i].url) {
      originPic = list[i].url;
    } else if (list[i].response && list[i].response.data) {
      originPic = list[i].response.data;
    } else {
      continue;
    }
    let pic = `${BASIC_CONFIG.SOURCE_URL}/${originPic.replace(
      `${BASIC_CONFIG.SOURCE_URL}/`,
      ''
    )}`;
    picPaths.push(pic);
  }

  return picPaths;
};