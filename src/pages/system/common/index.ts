/**
 * @todo 递归循环获得treeData
 * @param menuData
 */
export function formatMenuTreeData(menuData: any[]): any[] {
  let rootPrefix = '0';
  function parseArrayToTree(array: any[]) {
    let tree: any[] = [];
    let rootNum = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i].parentId === 0) {
        let root = array[i];
        const key = `${rootPrefix}-${rootNum++}`;
        root.key = key;
        root.title = `${root.menuName} ${root.perms || 'null'}`;
        tree.push(root);
        setChild(root, menuData, key);
      }
    }
    return tree;
  }

  function setChild(root: any, array: any[], prefix: string) {
    let index = 0;
    array.forEach((item) => {
      if (item.parentId === root.menuId) {
        const itemWithKey = { ...item, key: `${prefix}-${index}`, title: `${item.menuName} ${item.perms || 'null'}` };
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

  return parseArrayToTree(menuData);
}

export function getStatusColor(text: string) {
  switch (text) {
    case '成功':
    case '正常':
      return '#3D7DE9'
    case '失败':
    case '停用':
      return '#ed5565'
  }
}