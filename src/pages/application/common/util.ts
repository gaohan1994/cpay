/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-12 09:08:58 
 * @Last Modified by:   centerm.gaozhiying 
 * @Last Modified time: 2020-08-12 09:08:58 
 * 
 * @todo 应用模块的工具
 */

 /**
  * 
  * @param file 
  */
export function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * @todo 根据应用状态，获取相应的背景颜色
 * @param status 
 */
export const getAppStatusColor = (status: string) => {
  switch (status) {
    case '已审核':
    case '待提交':
      return '#23c6c8';
    case '待审核':
    case '已下架':
    case '已上架':
    case '审核不通过':
      return '#3D7DE9';
    case '已删除':
      return '#f00';
    default:
      return '#3D7DE9';
  }
}