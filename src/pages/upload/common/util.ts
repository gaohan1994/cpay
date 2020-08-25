/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-20 10:00:01 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-21 16:24:40
 * 
 * @todo 远程运维模块的工具
 */
/**
 * @todo 根据任务状态，获取相应的背景颜色
 * @param status 
 */
export const getTaskJobStatusColor = (status: string) => {
  switch (status) {
    case '初始':
      return '#999999'
    case '暂停':
      return '#f8ac59';
    case '启动':
      return '#3cc051';
    default:
      return '#3D7DE9';
  }
}

export const getFormCommonRules = (label: string, type: 'select' | 'input', text?: string) => {
  if (text) {
    return [
      {
        required: true,
        message: text,
      }
    ];
  }
  switch (type) {
    case 'select':
      return [
        {
          required: true,
          message: `请选择${label}`,
        }
      ];
    default:
      return [
        {
          required: true,
          message: `请输入${label}`,
        }
      ];
  }
}