import React, { useEffect, useState } from 'react';
import { Form, DatePicker, Button, Upload, notification } from 'antd';
import { useHistory } from 'react-router-dom';
import { useStore } from '@/pages/common/costom-hooks';
import { useSelectorHook } from '@/common/redux-util';
import { } from '@/component/form';
import { CustomFormItems } from '@/component/custom-form';
import {
  renderTreeSelect,
  renderSelect,
  renderCommonSelectForm,
} from '@/component/form/render';
import { advertInfoDetail, advertInfoEdit } from '../../constants/api';
import { FormItmeType } from '@/component/form/type';
import { terminalGroupListByDept } from '@/pages/terminal/message/constants/api';
import { ITerminalGroupByDeptId } from '@/pages/terminal/message/types';
import { BASIC_CONFIG, RESPONSE_CODE } from '@/common/config';
import { formatSearch } from '@/common/request-util';
import { AdvertisementDetail } from '../../types';
import moment from 'moment';
import invariant from 'invariant';
import { formatUploadFile } from '@/common/util';

export default () => {
  const history = useHistory();
  const [form] = Form.useForm();
  useStore(['advert_file_type', 'advert_type', 'advert_device_screen_type']);
  const common = useSelectorHook((state) => state.common);

  const initState = {
    deptId: -1 as number,
    groupData: [] as ITerminalGroupByDeptId[], // 终端组别列表
    advertisement: {} as AdvertisementDetail,
  };
  const [commonFormProps, setCommonFormProps] = useState({});
  const [isDetail, setIsDetail] = useState(false);
  const [deptId, setDeptId] = useState(initState.deptId);
  const [groupData, setTerminalGroupList] = useState(initState.groupData);
  const [imageFileList, setImageFileList] = useState([] as any[]);
  const [videoFileList, setVideoFileList] = useState([] as any[]);
  const [advertisement, setAdvertisement] = useState(initState.advertisement);

  // 是否是详情
  useEffect(() => {
    if (window.location.href.indexOf('detail') >= 0) {
      setIsDetail(true);
    }
  }, [window.location]);

  useEffect(() => {
    if (!!isDetail) {
      setCommonFormProps({ disabled: true });
    }
  }, [isDetail]);

  useEffect(() => {
    const params = formatSearch(history.location.search);
    advertInfoDetail(params.id, (result) => {
      if (result.code === RESPONSE_CODE.success) {
        console.log('result:', result);
        const { data } = result;
        setAdvertisement(data);
        setDeptId(data.deptId);
      }
    });
  }, []);

  useEffect(() => {
    let detailImageList: any[] = [];
    if (advertisement.picPath && advertisement.picPath.length > 0) {
      detailImageList.push({
        uid: `1`,
        name: 'detailImagePicPath',
        status: 'done',
        url: advertisement.picPath,
      });
    }
    setImageFileList(detailImageList);

    let detailVideoList: any[] = [];
    if (advertisement.adPath && advertisement.adPath.length > 0) {
      detailVideoList.push({
        uid: `2`,
        name: 'detailVideoPath',
        status: 'done',
        url: advertisement.adPath,
      });
    }
    setVideoFileList(detailVideoList);

    form.setFieldsValue({
      adName: advertisement.adName,
      startTime: moment(advertisement.startTime),
      endTime: moment(advertisement.endTime),
      deptId: advertisement.deptId,
      groupId: advertisement.groupId,
      type: `${advertisement.type}`,
      adFileType: `${advertisement.adFileType}`,
      deviceType: `${advertisement.deviceType}`,
      imageFileList: detailImageList,
      videoFileList: detailVideoList,
    });
  }, [advertisement]);

  useEffect(() => {
    // 请求组别
    terminalGroupListByDept(deptId, (groupData) => {
      setTerminalGroupList(groupData);
    });
  }, [deptId]);

  const onFinish = async (values: any) => {
    try {
      invariant(imageFileList && imageFileList.length > 0, '请上传广告图片');
      invariant(videoFileList && videoFileList.length > 0, '请上传广告');

      const payload: Partial<AdvertisementDetail> = {
        ...values,
        id: advertisement?.id,
        startTime: values.startTime.format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.endTime.format('YYYY-MM-DD HH:mm:ss'),
        picPath: formatUploadFile(imageFileList)[0],
        adPath: formatUploadFile(videoFileList)[0],
      };
      console.log('values:', payload);

      const result = await advertInfoEdit(payload);
      invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
      notification.success({ message: '修改成功！' });
      history.goBack();
    } catch (error) {
      notification.warn({ message: error.message });
    }
  };

  const onDeptChange = (deptId: number) => {
    console.log('deptId: ', deptId);
    form.setFieldsValue({ groupId: '' });
    setDeptId(deptId);
  };

  const forms: any[] = [
    {
      label: '名称',
      key: 'adName',
      requiredText: '请输入名称',
    },
    {
      label: '有效起始时间',
      key: 'startTime',
      requiredText: '请选择起始时间',
      render: () => (
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          style={{ width: '100%' }}
          placeholder="请选择有效起始日期"
        />
      ),
    },
    {
      label: '有效结束时间',
      key: 'endTime',
      requiredText: '请选择结束时间',
      render: () => (
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          style={{ width: '100%' }}
          showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          placeholder="请选择有效截止日期"
        />
      ),
    },
    {
      label: '机构名称',
      key: 'deptId',
      requiredType: 'select',
      render: () =>
        renderTreeSelect({
          placeholder: '请选择所属机构',
          formName: 'deptId',
          formType: FormItmeType.TreeSelect,
          treeSelectData: common?.deptTreeData,
          span: 24,
          onChange: onDeptChange,
        } as any),
    },
    {
      label: '组别名称',
      key: 'groupId',
      requiredType: 'select',
      requiredText: '请选择组别',
      render: () =>
        renderSelect({
          formName: 'groupId',
          span: 24,
          selectData:
            (groupData &&
              groupData.map((item) => {
                return {
                  title: item.name,
                  value: item.id,
                } as any;
              })) ||
            [],
          formType: FormItmeType.Select,
        }),
    },
    {
      label: '广告类型',
      key: 'type',
      requiredText: '请选择广告类型',
      render: () =>
        renderCommonSelectForm(
          {
            formName: 'type',
            formType: FormItmeType.SelectCommon,
            dictList: 'advert_type',
          },
          false
        ),
    },
    {
      label: '广告文件类型',
      key: 'adFileType',
      requiredText: '请选择广告类型',
      render: () =>
        renderCommonSelectForm(
          {
            formName: 'adFileType',
            formType: FormItmeType.SelectCommon,
            dictList: 'advert_file_type',
          },
          false
        ),
    },
    {
      label: '终端屏幕类型',
      key: 'deviceType',
      requiredText: '请选择广告类型',
      render: () =>
        renderCommonSelectForm(
          {
            formName: 'deviceType',
            formType: FormItmeType.SelectCommon,
            dictList: 'advert_device_screen_type',
          },
          false
        ),
    },
  ];

  const beforeUpload = (file: any) => {
    // 判断是否是图片
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      notification.error({ message: '只能上传jpg或png文件' });
    }
    // 判断是否小于等于5M
    const isLt5M = file.size / 1024 / 1024 <= 5;
    if (!isLt5M) {
      notification.error({ message: '超过限制5M' });
    }
    return isJpgOrPng && isLt5M;
  };

  /**
   * @todo 监听上传应用截组件改变的文件
   * @param param0
   */
  const handleChange = ({ fileList }: any, callback: any) => {
    let arr: any[] = [];
    console.log('fileList:', fileList);
    for (let i = 0; i < fileList.length; i++) {
      let file = fileList[i];
      // 判断是否是图片
      const isJpgOrPng =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.name === 'image.png';
      // 判断是否小于等于5M
      const isLt5M = file.size / 1024 / 1024 <= 5 || file.name === 'image.png';
      if (isJpgOrPng && isLt5M) {
        arr.push(file);
      }
    }
    if (arr.length > 5) {
      notification.error({ message: '最多只能上传5张' });
      arr = arr.slice(0, 5);
    }

    setTimeout(() => {
      callback(arr);
    })
  };
  return (
    <div>
      <Form form={form} onFinish={onFinish}>
        <CustomFormItems items={forms} singleCol={true} />
        <Form.Item
          label="广告预览图片"
          name="picPath"
          // rules={[{ required: true, message: '请选择图片' }]}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 16 }}
        >
          <Upload
            action={`${BASIC_CONFIG.BASE_URL}/cpay-admin/file/upload/tmp`}
            listType="picture-card"
            fileList={imageFileList}
            beforeUpload={beforeUpload}
            onChange={({ fileList }) =>
              handleChange({ fileList }, setImageFileList)
            }
            multiple={true}
            withCredentials={true}
          >
            {imageFileList.length > 0 ? null : '上传'}
          </Upload>
        </Form.Item>
        <Form.Item
          label="广告上传(*/vedio)"
          // rules={[{ required: true, message: '请上传广告' }]}
          name="adPath"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 16 }}
        >
          <Upload
            action={`${BASIC_CONFIG.BASE_URL}/cpay-admin/file/upload/tmp`}
            listType="picture-card"
            fileList={videoFileList}
            beforeUpload={beforeUpload}
            onChange={({ fileList }) =>
              handleChange({ fileList }, setVideoFileList)
            }
            multiple={true}
            withCredentials={true}
          >
            {videoFileList.length > 0 ? null : '上传'}
          </Upload>
        </Form.Item>
        {!isDetail && (
          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};
