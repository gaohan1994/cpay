/**
 * 用户状态管理
 * @Author: Ghan
 * @Date: 2020-07-20 17:12:33
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-07-20 17:42:58
 */

import React, { useState } from 'react';
import { IAdminInfo } from '../types';
import { menuConfig } from '@/common/menu-config';

type Props = {
  admin: IAdminInfo;
};

/**
 * 传入admin的信息 返回对应的数据
 *
 * @author Ghan
 * @param {Props} props
 * @returns
 */
function AdminInfo(props: Props) {
  const { admin } = props;
  const [] = useState(null);

  return {
    siderMenus: menuConfig
  };
}

export default AdminInfo;
