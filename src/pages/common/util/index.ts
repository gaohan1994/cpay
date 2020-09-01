import store from '@/modules/redux-store/index';

/**
 * @todo 根据输入值，从字典拿取列表进行比对，获取dictlabel
 * @param data 
 * @param dictType 字典类型
 */
export const getDictText = (data: string, dictType: string,) => {
  const state = store.getState();
  const dictList = state.common.dictList;
  const targetDict = dictList[dictType];

  const targetDictItem: any =
    targetDict &&
    targetDict.data &&
    targetDict.data.find((dictItem) => dictItem.dictValue === String(data));

  return targetDictItem && targetDictItem.dictLabel || '--';
}

/**
 * @todo 获取通用的表单规则
 * @param label 表单的文字
 * @param type 检验类型：select-选择 input-输入
 * @param text 检验不通过要展示的文字
 */
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