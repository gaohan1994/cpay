/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-09 11:16:42 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-09 18:04:10
 * 
 * @todo 终端信息统计
 */
import React, { useEffect, useState } from 'react';
import { Form, Table, Col, DatePicker, message, Radio, Tag } from 'antd';
import { useAntdTable } from 'ahooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns } from '@/component/table';
import { getApkUpdateReport } from '../constants/api';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/dataZoom';
import moment from 'moment';
import { useRedux, useSelectorHook } from '@/common/redux-util';
import { getUserDept } from '@/common/api';
import { useStore } from '@/pages/common/costom-hooks';
import { formatReportDownloadListResult } from '../common/util';
import { getDeptName } from '../../common/util/index';
import { bar_chart_options } from '../common/chart-bar-options';
import history from '@/common/history-util';

type Props = {};

function Page(props: Props) {
  // 请求字典数据
  useStore([]);
  const [useSelector, dispatch] = useRedux();
  const common = useSelectorHook((state) => state.common);
  const [deptId, setDeptId] = useState(-1);
  const [initStartTime, setInitStartTime] = useState('' as any);
  const [startTime, setStartTime] = useState('' as any);
  const [endTime, setEndTime] = useState('' as any);

  const [form] = Form.useForm();
  const res: any = useAntdTable(
    (paginatedParams: any, tableProps: any) => getApkUpdateReport({
      ...tableProps,
      startTime: tableProps.startTime ? tableProps.startTime.format('YYYYMM') : tableProps.startTime.format('YYYYMM'),
      // startTime: undefined,
      endTime: tableProps.endTime ? tableProps.endTime.format('YYYYMM') : tableProps.endTime,
    }),
    {
      form,
      formatResult: formatReportDownloadListResult,
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
    date.setDate(date.getDate() - 90);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let currentdate = year + "" + month;
    if (month >= 1 && month <= 9) {
      currentdate = year + "0" + month;
    }
    setInitStartTime(moment(currentdate));
    setStartTime(moment(currentdate));
    form.setFieldsValue({ startTime: moment(currentdate), isShowAll: 0 });
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
        setDeptId(common.userDept.deptId);
      }
    }
  }, [common.userDept]);

  /**
   * @todo 设置图表
   */
  useEffect(() => {
    setTimeout(() => {
      let myChart = echarts.getInstanceByDom(document.getElementById('download_chart') as any);
      if (myChart === undefined) {
        myChart = echarts.init(document.getElementById('download_chart') as any);
      }
      myChart.setOption(bar_chart_options(data));
      window.addEventListener('resize', function () {
        myChart.resize();
      })
    }, 0);
  }, [data]);

  /**
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '机构（任务名称）',
      dataIndex: 'jobName',
      align: 'center',
      width: 200,
      render: (text) => {
        return <div>{text === 'allData' ? getDeptName(deptId) : text}</div>
      }
    },
    {
      title: '任务数',
      dataIndex: 'number',
      align: 'center'
    },
    {
      title: '更新成功',
      dataIndex: 'successUpdate',
      align: 'center'
    },
    {
      title: '下载成功',
      dataIndex: 'successDownload',
      align: 'center'
    },
    {
      title: '下载失败',
      dataIndex: 'failureDownload',
      align: 'center'
    },
    {
      title: '更新(卸载)失败',
      dataIndex: 'failureUpdate',
      align: 'center'
    },
    {
      title: '等待下发',
      dataIndex: 'waitSend',
      align: 'center'
    },
    {
      title: '实时更新成功率',
      dataIndex: 'id',
      align: 'center',
      render: (id, record) => {
        const num = record.successUpdate && record.number ? ((record.successUpdate || 0) / (record.number || 0)) * 100 : 0;
        return <div>{Math.round(num)}%</div>
      }
    },
    {
      title: '执行详情',
      dataIndex: 'id',
      align: 'center',
      render: (id, record) => {
        if (id !== -1) {
          return (
            <Tag color="#3cc051" onClick={() => { onDetail(id, record.jobName) }}>点击详情</Tag>
          )
        } else {
          return <div />
        }
      }
    },
  ]);

  /**
   * @todo 跳转到详情
   * @param id 
   * @param jobName 
   */
  const onDetail = (id: number, jobName: string) => {
    history.push(`/report/downloadJob-operation?id=${id}&jobName=${jobName}`);
  }

  /**
   * @todo 设置不可选日期
   * @param current 
   * @param key 
   */
  function disabledDate(current: any, key: string) {
    if (key === 'startTime') {
      return current && ((typeof endTime === 'string' || !endTime) ? current > moment() : current > endTime);
      // return current && current < initStartTime || current > (typeof endTime === 'string' || !endTime ? moment() : endTime);
    } else {
      // return current && current < (typeof startTime === 'string' || !startTime ? initStartTime : startTime) || current > moment();
      return current && (((typeof startTime === 'string' || !startTime) ? false : current < startTime) || current > moment());
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
      onChange: (id) => setDeptId(id),
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
      render: () => <Col span={6} key={'isShowAll'}>
        <Form.Item name={'isShowAll'} label='统计范围'>
          <Radio.Group>
            <Radio value={0}>本级机构</Radio>
            <Radio value={1}>关联机构</Radio>
          </Radio.Group>
        </Form.Item>
      </Col>
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
      startTime: initStartTime,
      deptId: common.userDept && common.userDept.deptId,
      isShowAll: 0
    });
    setEndTime('');
    setStartTime(initStartTime);
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
      <Table rowKey="id" columns={columns}  {...tableProps} bordered pagination={false} />
      <div style={{ width: '100%', height: 400, marginTop: 50, }} id="download_chart">

      </div>

    </div>
  );
}
export default Page;
