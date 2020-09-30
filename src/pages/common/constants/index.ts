/**
 * @todo 全局数据使用接口
 */
import ApiRequset, { jsonToQueryString } from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';
import {
  DeptItem,
  DeptTreeData,
  DictItem,
  DictDetailItem,
} from '@/pages/common/type';
import { IResponseResult, IResponseListResult } from '@/common/type';

/**
 * @todo 递归循环获得treeData
 * @param deptData
 */
function formatDeptTreeData(deptData: DeptItem[]): DeptTreeData[] {
  let rootPrefix = '0-0';
  function parseArrayToTree(array: DeptItem[]) {
    let tree: DeptTreeData[] = [];
    let root = getRootObj(deptData);

    if (root) {
      tree.push(root);
      setChild(root, deptData, rootPrefix);
    }
    return tree;
  }

  function getRootObj(array: DeptItem[]) {
    let root = null;
    if (array) {
      array.forEach((item) => {
        if (item.pId === 0) {
          root = item;
          root.key = rootPrefix;
        }
      });
    }
    return root;
  }

  function setChild(root: DeptTreeData, array: DeptItem[], prefix: string) {
    let index = 0;
    array.forEach((item) => {
      if (item.pId === root.id) {
        const itemWithKey = { ...item, key: `${prefix}-${index}` };
        if (root.children) {
          root.children.push(itemWithKey);
          index++;
        } else {
          root.children = [itemWithKey];
          index++;
        }

        setChild(itemWithKey, array, `${prefix}-${index}`);
      }
    });
  }

  return parseArrayToTree(deptData);
}

export type GetDeptTreeDataCallback = [DeptItem[], DeptTreeData[]];
/**
 * @todo 查询机构标签关联列表
 */
export const getDeptTreeData = async (
  callback?: (data: GetDeptTreeDataCallback) => void
): Promise<GetDeptTreeDataCallback> => {
  const data: any = await ApiRequset.post(`/cpay-admin/system/dept/treeData`, {});
  const treeData =
    (data && data.code === RESPONSE_CODE.success && formatDeptTreeData(data.data)) ||
    [];

  callback && callback([data && data.data || [], treeData]);
  return [data && data.data || [], treeData];
};

/**
 * 全局字典函数类型
 * 先用这个接口获取类型
 * 然后获取具体字典数据
 * @param params
 */
export const getDictList = async (
  dictType: string,
  callback?: (data: DictItem[]) => void
): Promise<IResponseResult<DictItem[]>> => {
  const result = await ApiRequset.post(
    `/cpay-admin/system/dict/type/dictTypeList`,
    { dictType }
  );
  callback && callback((result && result.data && result.data.rows) || []);
  return result;
};

/**
 * 获取字典的具体数据
 * @param dictType
 * @param callback
 */
export const getDictData = async (
  dictType: string,
  callback?: (data: DictDetailItem[]) => void
): Promise<IResponseListResult<DictDetailItem>> => {
  const result = await ApiRequset.post(
    `/cpay-admin/system/dict/data/dictDataList`,
    { dictType }
  );
  callback && callback((result.data && result.data.rows) || []);
  return result;
};
