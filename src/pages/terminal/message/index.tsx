import React, { useState, useEffect } from 'react';
import { Form, Table, notification, Modal, Button } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { ImportOutlined, LogoutOutlined, DownloadOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd/lib/button';
import {
  terminalInfoList,
  terminalGroupListByDept,
  terminalInfoExport,
} from './constants/api';
import { formatListResult, formatPaginate } from '@/common/request-util';
import invariant from 'invariant';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import Forms from '@/component/form';
import { useStore } from '@/pages/common/costom-hooks';
import { ITerminalGroupByDeptId } from './types';
import { ITerminalFirmItem, ITerminalType } from '../types';
import {
  terminalFirmList as getTerminalFirmList,
  terminalTypeListByFirm as getTerminalTypeListByFirm,
} from '../constants';
import { RESPONSE_CODE, getDownloadPath } from '@/common/config';
import history from '@/common/history-util';
import { useSelectorHook } from '@/common/redux-util';
import { getDictText } from '@/pages/common/util';
import ImportModal from '../../../component/modal/importModal';
import {terminalInfoImport, terminalInfoImportTemplate } from './constants/api'

export default () => {
  const [form] = Form.useForm();
  useStore([
    'terminal_type',
    'is_dcc_sup',
    'unionpay_connection',
    'buss_type',
    'term_real_status',
  ]);
  const common = useSelectorHook((state) => state.common);
  const initState = {
    formTreeValue: -1,
    terminalGroup: [] as ITerminalGroupByDeptId[],
    groupValue: '',
    terminalFirmList: [] as ITerminalFirmItem[],
    terminalFirmTypeList: [] as ITerminalType[],
    firmValue: '',
  };
  const [groupValue, setGroupValue] = useState(initState.groupValue);
  const [formTreeValue, setFormTreeValue] = useState(initState.formTreeValue);
  const [terminalGroup, setTerminalGroup] = useState(initState.terminalGroup);
  const [firmValue, setFirmValue] = useState(initState.firmValue);
  const [terminalFirmList, setTerminalFirmList] = useState(
    initState.terminalFirmList
  );
  const [terminalFirmTypeList, setTerminalFirmTypeList] = useState(
    initState.terminalFirmTypeList
  );
  const [importModalVisible, setImportModalVisible] = useState(false);
  useEffect(() => {
    getTerminalFirmList({}, setTerminalFirmList);
  }, []);

  useEffect(() => {
    terminalGroupListByDept(formTreeValue, (groupData) => {
      setTerminalGroup(groupData);
      setGroupValue(`${groupData[0]?.id}`)
      form.setFieldsValue({groupId: undefined})
    });
  }, [formTreeValue]);

  useEffect(() => {
    // 终端厂商变化导致终端型号要变
    if (firmValue !== '') {
      form.setFieldsValue({ terminalTypeCode: undefined });
      onFirmLoadData(firmValue);
    }
  }, [firmValue]);

  const { tableProps, search, params: fetchFields }: any = useAntdTable(
    (paginatedParams: PaginatedParams[0], tableProps: any) => {
      return terminalInfoList({
        ...formatPaginate(paginatedParams),
        ...tableProps,
      });
    },
    {
      form,
      formatResult: formatListResult,
    }
  );

  const onChange = (deptId: number) => {
    setFormTreeValue(deptId);
  };

  const onFirmLoadData = (firmId: string) => {
    getTerminalTypeListByFirm({ firmId: firmId }, (data) => {
      setTerminalFirmTypeList(data);
    });
  };
  const { submit, reset } = search;

  const onExport = () => {
    Modal.confirm({
      title: '确认要导出终端信息？',
      onOk: async () => {
        try {
          const result = await terminalInfoExport(fetchFields[1]);
          invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');

          const href = getDownloadPath(result.data);
          // window.open(href, '_blank');
          notification.success({ message: '导出成功' });
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  /**
   * @todo 下载模版
   */
  const onDownloadImportTemplate = async () => {
    const res = await terminalInfoImportTemplate({});
    if (res && res.code === RESPONSE_CODE.success) {
      const href = getDownloadPath(res.data);
      // window.open(href, '_blank');
    } else {
      notification.error({ message: res && res.msg || '下载模版失败' });
    }
  }

  const forms: FormItem[] = [
    {
      placeholder: '终端序列号',
      formName: 'tusn',
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
    {
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
      onChange: onChange,
    },
    {
      placeholder: '所属组',
      formName: 'groupId',
      formType: FormItmeType.Select,
      selectData:
        (terminalGroup &&
          terminalGroup.map((item) => {
            return {
              value: `${item.id}`,
              title: `${item.name}`,
            };
          })) ||
        [],
      value: groupValue,
      onChange: (id: string) => {
        setGroupValue(`${id}`);
      },
    },
    {
      placeholder: '终端厂商',
      formType: FormItmeType.Select,
      selectData:
        terminalFirmList &&
        terminalFirmList.map((item) => {
          return {
            value: `${item.id}`,
            title: `${item.firmName}`,
          };
        }),
      onChange: (firmId: any) => {
        setFirmValue(firmId);
      },
      formName: 'firmId',
    },
    {
      placeholder: '终端型号',
      formType: FormItmeType.Select,
      selectData:
        terminalFirmTypeList &&
        terminalFirmTypeList.map((item) => {
          return {
            value: `${item.typeCode}`,
            title: `${item.typeName}`,
          };
        }),
      formName: 'terminalTypeCode',
    },
    {
      placeholder: '终端类型',
      formName: 'activateType',
      formType: FormItmeType.SelectCommon,
      dictList: 'terminal_type',
      // mode: 'multiple',
    },
    {
      placeholder: '是否支持DCC',
      formName: 'dccSupFlag',
      formType: FormItmeType.SelectCommon,
      dictList: 'is_dcc_sup',
    },
    {
      placeholder: '银联间直联',
      formName: 'cupConnMode',
      formType: FormItmeType.SelectCommon,
      dictList: 'unionpay_connection',
    },
    {
      placeholder: '业务类型',
      formType: FormItmeType.SelectCommon,
      formName: 'bussType',
      dictList: 'buss_type',
    },
    {
      placeholder: '终端状态',
      formType: FormItmeType.SelectCommon,
      formName: 'status',
      dictList: 'term_real_status',
    },
  ];

  // activateType: 1
  // address: "1"
  // bussType: "01"
  // city: "福州市"
  // county: "鼓楼区"
  // createBy: "admin"
  // createTime: "2020-08-14 10:39:37"
  // cupConnMode: 0
  // dccSupFlag: 0
  // deptId: 100
  // deptName: "总行"
  // firmId: 10
  // firmName: "升腾"
  // id: 4534
  // imei: "1"
  // imsi: "1"
  // merchantId: 21
  // merchantName: "福州水果商"
  // netMark: "1"
  // province: "福建省"
  // status: 1
  // terminalCode: "70410958"
  // terminalCopsSign: 0
  // terminalTypeId: 37
  // terminalTypeName: "k9"
  // tusn: "D1V0670410958"
  // updateTime: "2020-08-31
  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item: any) => (
        <a
          onClick={() => {
            history.push(`/terminal/message/detail?id=${item.id}`);
          }}
        >
          详情
        </a>
      ),
      fixed: 'left',
      width: 100,
    },
    {
      title: '终端序列号',
      dataIndex: 'tusn',
      width: 200
    },
    {
      title: '终端编号',
      dataIndex: 'terminalCode',
    },
    {
      title: '商户编号',
      dataIndex: 'merchantCode',
    },
    {
      title: '终端厂商',
      width: 120,
      dataIndex: 'firmName',
    },
    {
      title: '终端型号',
      dataIndex: 'terminalTypeName',
    },
    {
      title: '终端类型',
      dataIndex: 'activateType',
      dictType: 'terminal_type'
    },
    {
      title: '所属机构',
      dataIndex: 'deptName',
    },
    {
      title: '所属组',
      dataIndex: 'groupName',
    },
    {
      title: '商户名称',
      dataIndex: 'merchantName',
    },
    {
      title: '是否支持DCC',
      dataIndex: 'dccSupFlag',
      render: (dcc: any) => {
        return <span>{Number(dcc) === 0 ? '支持' : '不支持'}</span>;
      },
    },
    {
      title: '银联间直连',
      dataIndex: 'cupConnMode',
      render: (conn: any) => {
        return <span>{Number(conn) === 0 ? '间连' : '直连'}</span>;
      },
    },
    {
      title: '业务类型',
      dataIndex: 'bussType',
      render: (type: any) => {
        return <span>{getDictText(type, 'buss_type')}</span>;
      },
    },
    {
      title: '终端状态',
      dataIndex: 'status',
      render: (status: any) => {
        return <span>{getDictText(status, 'term_real_status')}</span>;
      },
    },
    {
      title: '终端使用情况',
      dataIndex: '',
    },
  ]);

  const extraButtons: ButtonProps[] = [
    {
      title: '导入',
      icon: <ImportOutlined />,
      type: 'primary',
      onClick: () => setImportModalVisible(true)
    },
    {
      title: '导出',
      icon: <LogoutOutlined />,
      type: 'primary',
      onClick: onExport,
    },
    // {
    //   title: '高级查询',
    //   type: 'primary',
    // },
  ];

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
        rowKey="id"
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
        scroll={{ x: 2200 }}
      />
      <ImportModal 
        visible={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        importFunc={terminalInfoImport}
      >
        <Button type='primary' onClick={onDownloadImportTemplate}><DownloadOutlined />下载模版</Button>
      </ImportModal>
    </div>
  );
};
