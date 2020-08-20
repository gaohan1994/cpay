import { useEffect, useCallback, useState } from 'react';
import { terminalParamCopys, terminalParamEdit } from '../constants';
import { DetailType } from '../../types';
import { ITerminalParam } from '../types';
import { IResponseResult } from '@/common/type';
import { RESPONSE_CODE } from '@/common/config';

interface State {
  terminalParams: ITerminalParam;
}

export function useDetail(id: string, type: DetailType) {
  const initState: State = {
    terminalParams: {} as any,
  };
  const [terminalParams, setTerminalParams] = useState(
    initState.terminalParams
  );

  const getParamsCallback = useCallback(
    (response: IResponseResult<ITerminalParam>) => {
      if (response.code === RESPONSE_CODE.success) {
        setTerminalParams(response.data);
      }
    },
    []
  );

  useEffect(() => {
    if (type === DetailType.COPY) {
      console.log('copy');
      terminalParamCopys({ id }, getParamsCallback);
      return;
    }

    if (type === DetailType.EDIT) {
      console.log('edit');
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
