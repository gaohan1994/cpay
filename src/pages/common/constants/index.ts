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
  function parseArrayToTree(array: DeptItem[]) {
    let tree: DeptTreeData[] = [];
    let root = getRootObj(deptData);

    if (root) {
      tree.push(root);
      setChild(root, deptData);
    }
    return tree;
  }

  function getRootObj(array: DeptItem[]) {
    let root = null;
    if (array) {
      array.forEach((item) => {
        if (item.pId === 0) {
          root = item;
        }
      });
    }
    return root;
  }

  function setChild(root: DeptTreeData, array: DeptItem[]) {
    array.forEach((item) => {
      if (item.pId === root.id) {
        if (root.children) {
          root.children.push(item);
        } else {
          root.children = [item];
        }

        setChild(item, array);
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
  const data: any = await ApiRequset.get(`/cpay-admin/system/dept/treeData`);
  const treeData =
    (data.code === RESPONSE_CODE.success && formatDeptTreeData(data.data)) ||
    [];

  callback && callback([data.data || [], treeData]);
  return [data.data || [], treeData];
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
  const result = await ApiRequset.get(
    `/cpay-admin/system/dict/list${jsonToQueryString({ dictType })}`
  );
  callback && callback((result.data && result.data.rows) || []);
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
  const result = await ApiRequset.get(
    `/cpay-admin/system/dict/data/list${jsonToQueryString({ dictType })}`
  );
  callback && callback((result.data && result.data.rows) || []);
  return result;
};