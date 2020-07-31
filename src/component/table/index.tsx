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

    const useDict =
      dictType && dataIndex
        ? {
            render: (key: any, item: any) =>
              UseDictRenderHelper(item[dataIndex as string], dictType),
          }
        : {};

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
