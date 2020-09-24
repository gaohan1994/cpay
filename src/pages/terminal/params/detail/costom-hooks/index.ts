import { useEffect, useCallback, useState } from 'react';
import { merge } from 'lodash';
import { terminalParamCopys, terminalParamEdit } from '../constants';
import { DetailType } from '../../types';
import { ITerminalParam } from '../types';
import { IResponseResult } from '@/common/type';
import { RESPONSE_CODE } from '@/common/config';

interface State {
  terminalParams: ITerminalParam;
}

export function useDetail(id: string, type: DetailType, setLoading?: Function) {
  const initState: State = {
    terminalParams: {} as any,
  };
  const [terminalParams, setTerminalParams] = useState(
    initState.terminalParams
  );

  const getParamsCallback = useCallback(
    (response: IResponseResult<ITerminalParam>) => {
      if (setLoading) {
        setLoading(false);
      }
      if (response.code === RESPONSE_CODE.success) {
        let responseData = merge({}, response.data);
        if (
          responseData.terminalParam &&
          responseData.terminalParam.paramContent
        ) {
          const contentToJson = JSON.parse(
            responseData.terminalParam.paramContent as any
          );
          responseData.terminalParam.paramContent = contentToJson;
        }
        setTerminalParams(responseData);
      }
    },
    []
  );

  useEffect(() => {
    if (type === DetailType.COPY) {
      console.log('copy');
      if (setLoading) {
        setLoading(true);
      }
      terminalParamCopys({ id }, getParamsCallback);
      return;
    }

    if (type === DetailType.EDIT) {
      console.log('edit');
      if (setLoading) {
        setLoading(true);
      }
      terminalParamEdit({ id }, getParamsCallback);
      return;
    }

    if (type === DetailType.ADD) {
      console.log('add');
      return;
    }
  }, []);
  return { terminalParams, setTerminalParams };
}
