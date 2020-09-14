/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-11 18:00:15 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-14 13:50:12
 * 
 * @todo 系统用户新增获取表单选择数据列表
 */
import { useEffect, useState } from 'react';
import { FormInstance } from 'antd/lib/form';
import { systemRoleList } from '@/pages/system/role/constants/api';

export function useFormSelectData(props: any, form: FormInstance) {
  const [roleList, setRoleList] = useState([] as any[]);

  useEffect(() => {
    systemRoleList({}, (result: any) => {
      if (result.data && result.data.rows) {
        setRoleList(result.data.rows);
      }
    });
  }, []);

  return {
    roleList, setRoleList
  };
}
