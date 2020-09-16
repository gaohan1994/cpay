import React from 'react';
import { Result, Button } from 'antd';
import { useHistory } from 'react-router-dom';

export default () => {
  const history = useHistory();
  return (
    <Result
      status="404"
      title="404"
      subTitle="对不起，您访问的页面不存在"
      extra={
        <Button type="primary" onClick={() => history.replace('/')}>
          回到首页
        </Button>
      }
    />
  );
};
