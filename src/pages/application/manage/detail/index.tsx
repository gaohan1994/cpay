/*
 * @Author: centerm.gaozhiying
 * @Date: 2020-08-12 09:13:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-10-12 09:52:03
 *
 * @todo 应用管理的详情页
 */
import React, { useEffect, useState } from 'react';
import { Descriptions, notification, Col, Row, Rate, Spin } from 'antd';
import { useQueryParam } from '@/common/request-util';
import { appInfoDetail, appInfoEdit } from '../../constants/api';
import { RESPONSE_CODE } from '../../../../common/config';
import { IAppInfoDetail } from '../../types';
import { useStore } from '@/pages/common/costom-hooks';
import { getDictText } from '../../../common/util/index';

function Page() {
  // 请求dept数据
  const res = useStore(['app_status']);
  const id = useQueryParam('id');
  const status = useQueryParam('status');
  const [detailArr, setDetailArr] = useState([] as any[]);
  const [loading, setLoading] = useState(false);

  /**
   * @todo 初始页面数据
   */
  useEffect(() => {
    getDetailCallback({ code: RESPONSE_CODE.success, data: {} });
  }, []);

  /**
  * @todo 获取完相应字典数据，设置详情值
  */
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true)
    appInfoDetail(id, getDetailCallback, {status});
  }, []);

  /**
   * @todo 从接口拿到应用详情后的回调方法
   * @param result
   */
  const getDetailCallback = (result: any) => {
    setLoading(false);
    if (result && result.code === RESPONSE_CODE.success) {
      console.log(result.data.appInfo,'result.data.appInfo');
      
      let detail: IAppInfoDetail = result.data.appInfo || {};
      let arr: any[] = [];
      let permissions: string[] = [];
      let permissionsStr: string = '';
      let images: string[] = [];
      if (typeof detail.permissions === 'string' && detail.permissions.length > 0) {
        permissions = detail.permissions.split(';');
        let str = '';
        for (let i = 0; i < permissions.length; i++) {
          str += permissions[i];
          str += '\r\n';
        }
        permissionsStr = str;
      }
      if (typeof detail.picPaths === 'string' && detail.picPaths.length > 0) {
        images = detail.picPaths.split(';');
      }
      arr.push({
        label: '是否可卸载',
        value: detail.isUninstall === 1 ? '可卸载' : detail.isUninstall === 0 ? '不可卸载' : undefined,
      });
      arr.push({ label: '所属组', value: detail.groupName });
      arr.push({ label: '所属机构', value: detail.deptName });
      arr.push({ label: '应用分类', value: detail.typeName });
      arr.push({ label: '终端厂商', value: detail.firmName });
      arr.push({ label: '终端型号', value: detail.terminalTypes });
      arr.push({
        label: '应用推荐度',
        value: detail.reDegree,
        render: (score: number) => <Rate disabled defaultValue={score} />,
      });
      arr.push({ label: '应用名称', value: detail.apkName });
      arr.push({ label: '应用包名', value: detail.apkCode });
      arr.push({ label: '应用版本', value: detail.versionName });
      arr.push({ label: '内部版本', value: detail.versionCode });
      arr.push({
        label: '应用图标',
        value: detail.iconPath,
        render: (path: string) => renderIcon(path),
      });
      arr.push({ label: '应用状态', value: getDictText(`${detail.status}`, 'app_status') });
      arr.push({ label: '关键词', value: detail.keyWord });
      arr.push({ label: '权限', value: permissionsStr });
      arr.push({ label: '应用简介', value: detail.apkDescription });
      arr.push({ label: '版本更新说明', value: detail.versionDescription });
      arr.push({
        label: '应用截图',
        value: images,
        render: (paths: string[]) => renderImages(paths),
      });
      if (detail.reviewUser) {
        arr.push({ label: '审核人', value: detail.reviewUser });
      }
      if (detail.reviewMsg) {
        arr.push({ label: '历史审核意见', value: detail.reviewMsg });
      }
      setDetailArr(arr);
    } else {
      notification.warn(result.msg || '获取详情失败，请刷新页面重试');
    }
  };

  /**
   * @todo 渲染应用图标
   * @param imagePath
   */
  const renderIcon = (imagePath: string) => {
    return <img src={imagePath} style={{ width: '50px', height: '50px' }} />;
  };

  /**
   * @todo 渲染应用截图
   * @param imagePaths
   */
  const renderImages = (imagePaths: string[]) => {
    return (
      <Row>
        {imagePaths.length > 0 &&
          imagePaths.map((item) => {
            return (
              <img
                src={item}
                style={{
                  width: '80px',
                  height: '80px',
                  marginRight: '20px',
                  marginBottom: '10px',
                  marginTop: '10px',
                }}
              />
            );
          })}
      </Row>
    );
  };

  return (
    <Spin spinning={loading}>
      <div style={{ paddingLeft: '30px', paddingTop: '10px', width: '60vw' }}>
        <Descriptions bordered column={1} title="应用详情">
          {detailArr.length > 0 &&
            detailArr.map((item: any) => {
              return (
                <Descriptions.Item
                  label={<div style={{ width: '100px' }}>{item.label}</div>}
                >
                  <div style={{ width: 'calc(60vw - 200px)' }}>
                    {item.render ? item.render(item.value) : item.value || '--'}
                  </div>
                </Descriptions.Item>
              );
            })}
        </Descriptions>
      </div>
    </Spin>
  );
}

export default Page;
