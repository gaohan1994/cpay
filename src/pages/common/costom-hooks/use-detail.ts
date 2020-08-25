import { useState, useCallback, useEffect } from "react";
import { IResponseResult } from "@/common/type";
import { RESPONSE_CODE } from "@/common/config";
import { notification } from 'antd';

interface State {
  detail: any;
}

export function useDetail(id: number, fetchFunction: Function, setLoading?: Function) {
  const initState: State = {
    detail: {} as any,
  };
  const [detail, setDetail] = useState(
    initState.detail
  );

  const getParamsCallback = useCallback(
    (response: IResponseResult<any>) => {
      if (setLoading) {
        setLoading(false);
      }
      if (response && response.code === RESPONSE_CODE.success) {
        setDetail(response.data);
      } else {
        notification.error({ message: response && response.msg || '获取详情失败' });
      }
    },
    []
  );

  useEffect(() => {
    if (typeof id !== 'undefined') {
      if (setLoading) {
        setLoading(true);
      }
      fetchFunction(id, getParamsCallback);
    }
  }, []);
  return { detail, setDetail };
}