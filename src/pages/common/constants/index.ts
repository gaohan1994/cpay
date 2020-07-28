/**
 * @todo 全局数据使用接口
 */
import ApiRequset from '@/common/request-util';
import store from '@/modules/redux-store';
import { ACTION_TYPES_COMMON } from '@/pages/common/reducer';
import { RESPONSE_CODE } from '@/common/config';
import { DeptItem, DeptTreeData } from '../type';

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

/**
 * @todo 查询机构标签关联列表
 */
export const deptTreeData = async () => {
  const treeData = await ApiRequset.get(`/cpay-admin/system/dept/treeData`);
  if (treeData.code === RESPONSE_CODE.success) {
    store.dispatch({
      type: ACTION_TYPES_COMMON.RECEIVE_DEPT_DATA,
      payload: treeData.data,
    });

    // 获得depttreedata
    const tree = formatDeptTreeData(treeData.data);
    console.log('tree:', tree);
    store.dispatch({
      type: ACTION_TYPES_COMMON.RECEIVE_DEPT_TREE_DATA,
      payload: tree,
    });
  }
  return treeData;
};
