import React, { useState } from 'react';
import { Form, Table, notification, Modal } from 'antd';
import invariant from 'invariant';
import { useAntdTable } from 'ahooks';
import { LogoutOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd/lib/button';
import { terminalSysdetailList, terminalSysdetailExport } from './constants';
import { formatListResult, formatPaginate } from '@/common/request-util';
import { createTableColumns } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import Forms from '@/component/form';
import { RESPONSE_CODE, BASE_URL, getDownloadPath } from '@/common/config';

export default () => {
  const [fetchField, setFetchField] = useState({} as any);

  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) => {
      setFetchField(tableProps);
      return terminalSysdetailList({
        ...formatPaginate(paginatedParams),
        ...tableProps,
      });
    },
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  const forms: FormItem[] = [
    {
      placeholder: '终端序列号',
      formName: 'tusn',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '系统版本',
      formName: '',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '安全模块版本',
      formName: '',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: 'Android版本',
      formName: '',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '运维SDK版本',
      formName: '',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '收单SDK版本',
      formName: '',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: 'EMV版本',
      formName: '',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '收单应用包名',
      formName: '',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '收单内部版本',
      formName: '',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: 'POS管家内部版本',
      formName: '',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '网络类型',
      formName: '',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '终端编号',
      formName: 'terminalCode',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '商户编号',
      formName: 'merchantCode',
      formType: FormItmeType.Normal,
    },
  ].map((item): any => {
    return {
      ...item,
      span: 3,
    };
  });

  const exportList = async () => {
    Modal.confirm({
      title: '确认要导出终端系统信息？',
      onOk: async () => {
        try {
          console.log('fetchField:', fetchField);
          const result = await terminalSysdetailExport(fetchField);
          invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');

          const href = getDownloadPath(result.data);
          window.open(href, '_blank');
          notification.success({ message: '导出成功' });
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  const columns = createTableColumns([
    {
      title: '终端序列号',
      dataIndex: 'tusn',
      width: 250,
    },
    {
      title: '安全模块版本',
      width: 240,
      dataIndex: ['sysDetail', 'safeModVer'],
    },
    {
      title: 'Android版本',
      // width: 80,
      dataIndex: ['sysDetail', 'androidVer'],
    },
    {
      title: '参数版本',
      width: 180,
      dataIndex: ['sysDetail', 'paramVer'],
    },
    {
      title: 'PBOC版本',
      width: 180,
      dataIndex: ['sysDetail', 'pbocVer'],
    },
    {
      title: 'M3版本',
      // width: 120,
      dataIndex: ['sysDetail', 'M3Ver'],
    },
    {
      title: '中间件版本',
      // width: 120,
      dataIndex: ['sysDetail', 'middlewareVer'],
    },
    {
      title: '平台版本',
      // width: 120,
      dataIndex: ['sysDetail', 'platformVer'],
    },
    {
      title: '安全模块版本',
      // width: 80,
      dataIndex: ['sysDetail', 'safeModVer'],
    },
    {
      title: 'SDK版本',
      // width: 80,
      dataIndex: ['sysDetail', 'sdkVer'],
    },
    {
      title: '蓝牙地址',
      width: 180,
      dataIndex: ['sysDetail', 'blueTooth'],
    },
    {
      title: '终端型号',
      dataIndex: ['sysDetail', 'model'],
    },
    {
      title: '金融模块版本',
      dataIndex: ['sysDetail', 'emv'],
    },
    {
      title: '驱动模块版本',
      dataIndex: ['sysDetail', 'mh'],
    },
    {
      title: '基带版本',
      width: 250,
      dataIndex: ['sysDetail', 'baseVer'],
    },
    {
      title: '设备序列号',
      dataIndex: ['sysDetail', 'sn'],
    },
    {
      title: '分辨率',
      dataIndex: ['sysDetail', 'imageResolution'],
    },
    {
      title: '屏幕尺寸',
      dataIndex: ['sysDetail', 'screenSize'],
    },
    {
      title: '屏幕密度',
      dataIndex: ['sysDetail', 'screenDensity'],
    },
    {
      title: '屏幕像素密度',
      dataIndex: ['sysDetail', 'ppi'],
    },
    {
      title: '前置摄像头',
      dataIndex: ['sysDetail', 'frontCamera'],
    },
    {
      title: '后置摄像头',
      dataIndex: ['sysDetail', 'backCamera'],
    },
    {
      title: '运行内存',
      dataIndex: ['sysDetail', 'ram'],
    },
    {
      title: '机身存储',
      dataIndex: ['sysDetail', 'rom'],
    },
    {
      title: '内置存储',
      dataIndex: ['sysDetail', 'sd'],
    },
  ]);

  const extraButtons: ButtonProps[] = [
    {
      title: '导出',
      icon: <LogoutOutlined />,
      type: 'primary',
      onClick: exportList,
    },
  ];
  console.log('tableProps:', tableProps);
  return (
    <div>
      <Forms
        form={form}
        forms={forms}
        formButtonProps={{
          reset,
          submit,
          extraButtons,
        }}
      />
      <Table
        style={{ overflowX: 'auto' }}
        columns={columns}
        {...tableProps}
        scroll={{ x: 3200 }}
      />
    </div>
  );
};
