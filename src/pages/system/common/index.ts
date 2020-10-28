import { DeptItem, DeptTreeData } from "@/pages/common/type";

/**
 * @todo 递归循环获得treeData
 * @param menuData
 */
export function formatMenuTreeData(menuData: any[]): any[] {
  let rootPrefix = '0';
  function parseArrayToTree(array: any[]) {
    let rootNum = 0;
    const rootList = array.filter(item => item.parentId === 0)
    rootList.map((item, index) => {
      const key = `${rootPrefix}-${rootNum++}`;
      item.key = key
      item.title = `${item.menuName} ${item.perms || 'null'}`;
      setChild(item, array, key)
    })
    return rootList;
  }

  function setChild(root: any, array: any[], prefix: string) {
    const childList = array.filter(item => {
      if(item.children && item.children.length === 0) { item.children = null }
      return item.parentId === root.menuId
    })    
    root.children = [...childList]
    childList.map((item, index) => {
      item.key = `${prefix}-${index}`
      item.title = `${item.menuName} ${item.perms || 'null'}`
      setChild(item, array, `${prefix}-${index}`)
    })
  }

  return parseArrayToTree(menuData);
}

export function formatDeptTreeData(deptData: any[]): DeptTreeData[] {
  let rootPrefix = '0-0';
  function parseArrayToTree(array: any[]) {
    let tree: DeptTreeData[] = [];
    let root = getRootObj(deptData);

    if (root) {
      tree.push(root);
      setChild(root, deptData, rootPrefix);
    } else {
      tree = deptData;
    }
    return tree;
  }

  function getRootObj(array: any[]) {
    let root = null;
    if (array) {
      array.forEach((item) => {
        if (item.parentId === 0) {
          root = item;
          root.key = rootPrefix;
        }
      });
    }
    return root;
  }

  function setChild(root: any, array: any[], prefix: string) {
    let index = 0;
    array.forEach((item) => {
      if (item.parentId === root.deptId) {
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

export function getStatusColor(text: string) {
  switch (text) {
    case '成功':
    case '正常':
    case '是':
    case '显示':
      return '#3D7DE9'
    case '失败':
    case '停用':
    case '否':
    case '隐藏':
    case '关闭':
      return '#ed5565'
  }
}