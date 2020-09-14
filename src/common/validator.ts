/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-14 10:24:57 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-14 10:26:24
 * 
 * @todo 检验器
 */

/**
 * @todo 校验手机号
 * @param rule 
 * @param value 
 * @param callback 
 */
export function checkPhoneNumber(rule: any, value: any, callback: any) {
  var regu = "^1[0-9]{10}$";//手机号码验证regEx:第一位数字必须是1，11位数字
  var re = new RegExp(regu);
  if (re.test(value)) {
    callback();
  } else {
    callback('请正确输入手机号');
  }
}      