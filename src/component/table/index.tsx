import React from 'react';
import { ColumnConfigItem } from './type';
import { UseDictRenderHelper } from './render';

export function createTableColumns(columnsConfig: ColumnConfigItem[]) {
  const columns = columnsConfig.map((item) => {
    const { dictType, placeHolder, dataIndex, ...rest } = item;

    const usePlaceHolder = placeHolder
      ? {
        render: (key: any, item: any) => (
          <span>{item[dataIndex as string] || placeHolder}</span>
        ),
      }
      : {};

    let useDict = null;
    if (item.render) {
      const customRender = item.render;
      useDict = dictType && dataIndex
        ? {
          render: (key: any, item: any) =>
            UseDictRenderHelper(item[dataIndex as string], dictType, customRender),
        }
        : {};
    } else {
      useDict =
        dictType && dataIndex
          ? {
            render: (key: any, item: any) =>
              UseDictRenderHelper(item[dataIndex as string], dictType),
          }
          : {};
    }
    if (!item.render && !dictType && dataIndex && typeof dataIndex === 'string') {
      useDict = {
        render: (key: any, item: any) => {
          return (item[dataIndex] || '--')
        }
      }
    }

    return {
      ...rest,
      key: dataIndex,
      dataIndex,
      ...usePlaceHolder,
      ...useDict,
    };
  });

  return columns;
}
