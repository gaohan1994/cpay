import ApiRequset from '@/common/request-util';

/**
 * @todo 查询机构标签关联列表
 */
export const deptLabelList = () =>
  ApiRequset.get(`/cpay-admin/app/deptLabel/list`);
