/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-09 11:16:42 
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-19 15:16:03
 * 
 * @todo 终端信息统计
 */
import React, { useEffect, useState } from 'react';
import { Form, Table, Col, DatePicker, message, Radio } from 'antd';
import { useAntdTable } from 'ahooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns } from '@/component/table';
import { getTerminalInfoReport } from '../constants/api';
import { formatReportListResult } from '../common/util';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/tooltip';
import { line_chart_options } from '../common/chart-line-options';
import moment from 'moment';
import { useRedux, useSelectorHook } from '@/common/redux-util';
import { getUserDept } from '@/common/api';
import { useStore } from '@/pages/common/costom-hooks';

type Props = {};

function Page(props: Props) {
  // 请求字典数据
  useStore([]);
  const [useSelector, dispatch] = useRedux();
  const common = useSelectorHook((state) => state.common);
  const [validStartTime, setValidStartTime] = useState('' as any);
  const [startTime, setStartTime] = useState('' as any);
  const [endTime, setEndTime] = useState('' as any);
  const [isShowAll, setIsShowAll] = useState(0);

  const [form] = Form.useForm();
  const res: any = useAntdTable(
    (paginatedParams: any, tableProps: any) => getTerminalInfoReport({
      ...tableProps,
      startTime: tableProps.startTime ? tableProps.startTime.format('YYYYMM') : tableProps.startTime.format('YYYYMM'),
      endTime: tableProps.endTime ? tableProps.endTime.format('YYYYMM') : tableProps.endTime,
      isShowAll,
    }),
    {
      form,
      formatResult: formatReportListResult,
    }
  );
  const { tableProps, search, data }: any = res;
  const { submit } = search;

  /**
   * @todo 获取机构数据
   */
  useEffect(() => {
    getUserDept(dispatch);
  }, []);

  /**
   * @todo 最早能获取到一年前的数据，设置相应的有效起始时间
   */
  useEffect(() => {
    let date = new Date();
    let year = date.getFullYear() - 1;
    let month = date.getMonth() + 1;
    let currentdate = year + "" + month;
    if (month >= 1 && month <= 9) {
      currentdate = year + "0" + month;
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const currentEndDate = currentYear + (currentMonth >= 1 && currentMonth <= 9 ? "0" : "") + currentMonth;
    setEndTime(moment(currentEndDate));
    setValidStartTime(moment(currentdate));
    setStartTime(moment(currentdate));
    form.setFieldsValue({
      startTime: moment(currentdate),
      endTime: moment(currentEndDate),
      isShowAll: 0,
    });
  }, []);

  /**
   * @todo 获取当前机构id，并设置表单数据
   */
  useEffect(() => {
    if (common.userDept) {
      if (common.userDept.deptId && common.userDept.deptName) {
        form.setFieldsValue({
          deptId: common.userDept.deptId
        });
      }
    }
  }, [common.userDept]);

  /**
   * @todo 设置图表
   */
  useEffect(() => {
    setTimeout(() => {
      let myChart = echarts.getInstanceByDom(document.getElementById('app_chart') as any);
      if (myChart === undefined) {
        myChart = echarts.init(document.getElementById('app_chart') as any);
      }
      myChart.setOption(line_chart_options(data && data.originData || {}));
      window.addEventListener('resize', function () {
        myChart.resize();
      })
    }, 0);
  }, [data]);

  /**
   * @todo 根据返回的数据，获取tabel相应的列（以月份为列）
   * @param param 
   */
  const getTableColumnsData = (param: any[]) => {
    let columns = [];
    for (let i = 0; i < param.length; i++) {
      columns.push({
        title: param[i],
        dataIndex: param[i],
        align: "center" as any,
      });
    }
    return columns;
  }

  /**
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '机构（厂商）',
      dataIndex: 'firmName',
      align: 'center'
    },
    ...getTableColumnsData(data && data.columns || [])
  ]);

  function disabledDate(current: any, key: string) {
    if (key === 'startTime') {
      return current && (current < validStartTime || current > (typeof endTime === 'string' || !endTime ? moment() : endTime));
    } else {
      return current && (current < (typeof startTime === 'string' || !startTime ? validStartTime : startTime) || current > moment());
    }
  }

  /**
   * @todo table查询表单
   */
  const forms: FormItem[] = [
    {
      span: 6,
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
    },
    {
      formName: 'startTime',
      formType: FormItmeType.SelectCommon,
      dictList: 'startTime',
      render: () => renderDateForm('startTime')
    },
    {
      formName: 'endTime',
      formType: FormItmeType.SelectCommon,
      dictList: 'endTime',
      render: () => renderDateForm('endTime')
    },
    {
      formName: 'isShowAll',
      formType: FormItmeType.SelectCommon,
      dictList: 'isShowAll',
      render: () =>
        <div key={'isShowAll'} style={{ marginLeft: 12 }}>
          <Form.Item name={'isShowAll'} label='统计范围'>
            <Radio.Group onChange={(e) => setIsShowAll(e.target.value)}>
              <Radio value={0}>本级机构</Radio>
              <Radio value={1}>本级及下级机构</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
    },
  ];

  /**
   * @todo 改变日期调用
   * @param date 
   * @param key 
   */
  const onChangeDate = (date: string, key: 'startTime' | 'endTime') => {
    if (key === 'startTime') {
      setStartTime(date)
    } else {
      setEndTime(date)
    }
  }

  /**
   * @todo 渲染日期表单，有开始和结束两种
   * @param key 
   */
  const renderDateForm = (key: 'startTime' | 'endTime') => {
    return (
      <Col span={6} key={key}>
        <Form.Item name={key}>
          <DatePicker
            style={{ width: '100%' }}
            picker="month"
            format='YYYYMM'
            placeholder={key === 'startTime' ? "开始月份" : "结束月份"}
            disabledDate={(current: any) => disabledDate(current, key)}
            value={key === 'startTime' ? startTime : endTime}
            onChange={(date: any) => onChangeDate(date, key)}
          />
        </Form.Item>
      </Col>
    )
  }

  /**
   * @todo 自定义表单提交，当没有选择开始时间时，不能够提交
   */
  const customSubmit = () => {
    if (!startTime) {
      message.error('请选择开始时间！');
      return;
    }
    submit();
  }

  /**
   * @todo 自定义重置，表单有相应的初始数据
   */
  const customReset = () => {
    form.setFieldsValue({
      endTime: undefined,
      startTime: validStartTime,
      deptId: common.userDept && common.userDept.deptId,
      isShowAll: 0
    });
    setEndTime('');
    setStartTime(validStartTime);
  }

  return (
    <div>
      <Forms
        form={form}
        forms={forms}
        formButtonProps={{
          submit: customSubmit,
          reset: customReset,
        }}
      />
      <Table rowKey="firmName" columns={columns}  {...tableProps} bordered pagination={false} />
      <div style={{ width: '100%', height: 400, marginTop: 50, }} id="app_chart">

      </div>

    </div>
  );
}
export default Page;
