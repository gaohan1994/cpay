import React from 'react';
import { ColumnConfigItem } from './type';
import { UseDictRenderHelper } from './render';
import { PaginationProps } from 'antd/lib/pagination';

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
          return (item[dataIndex] || typeof item[dataIndex] === 'number' ? item[dataIndex] : '--')
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

/**
 * @todo 获取标准的分页
 * @param pagination 
 */
export const getStandardPagination = (pagination: any): PaginationProps => {
  return {
    ...pagination,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total, range) => `第${range[0]}到${range[1]}条，共${total}条记录。`
  }
}