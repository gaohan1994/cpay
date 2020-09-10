import { IResponseResult, IFormatResult } from "@/common/type";
import { merge } from "lodash";


export const formatReportListResult = <T>(
  result: IResponseResult<any>
): any => {
  const mergeResult = merge({}, result);
  const month = mergeResult.data.month || [];
  const firmData = mergeResult.data.firmData || {};
  const list: any[] = [];
  for (const key in firmData) {
    if (Object.prototype.hasOwnProperty.call(firmData, key)) {
      const element = firmData[key];
      let item: any = {};
      item['firmName'] = key === 'allData' ? mergeResult.data.deptName || 'allData' : key;
      for (let i = 0; i < element.length; i++) {
        if (month.length > i) {
          item[month[i]] = element[i];
        }
      }
      list.push(item);
    }
  }
  return {
    list: list || [],
    total: list.length,
    columns: month || [],
    originData: result.data,
  };
};

export const formatReportDownloadListResult = <T>(
  result: IResponseResult<any>
): IFormatResult<T> => {
  const mergeResult = merge({}, result);
  let data = Array.isArray(mergeResult.data) ? mergeResult.data : [];
  if (data.length > 0) {
    let item: any = {};
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        item = { ...data[i], jobName: 'allData' };
      } else {
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            const element = item[key];
            if (typeof element === 'number') {
              item[key] = element + data[i][key];
            }
          }
        }
      }
    }
    item.id = -1;
    data.unshift(item);
  } else {
    data.push({
      id: -1,
      jobName: 'allData',
      number: 0,
      successUpdate: 0,
      successDownload: 0,
      failureDownload: 0,
      failureUpdate: 0,
      waitSend: 0,
    });
  }
  return {
    list: data,
    total: data.length,
  };
};