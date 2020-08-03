import React from 'react';
import { Row, Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { SearchOutlined } from '@ant-design/icons';

export type FormButtonProps = {
  reset?: any;
  resetTitle?: string;
  resetButtonType?: string;
  submit?: any;
  resetIcon?: any;
  submitTitle?: string;
  submitIcon?: any;
  extraButtons?: ButtonProps[];
};

const FormButton = React.memo((props: FormButtonProps) => {
  const {
    reset,
    submit,
    resetTitle = '重置',
    resetButtonType,
    resetIcon,
    submitTitle = '查询',
    submitIcon,
    extraButtons,
  } = props;

  const buttonCss = { marginRight: 12 };

  return (
    <Row style={{ marginBottom: 12 }}>
      {reset && (
        <Button
          onClick={reset}
          style={buttonCss}
          {...resetButtonType}
          {...resetIcon}
        >
          {resetTitle}
        </Button>
      )}
      {submit && (
        <Button
          type="primary"
          onClick={submit}
          icon={submitIcon || <SearchOutlined />}
          style={buttonCss}
        >
          {submitTitle}
        </Button>
      )}
      {extraButtons && (
        <>
          {extraButtons.map((button) => {
            return (
              <Button {...button} style={buttonCss}>
                {button.title}
              </Button>
            );
          })}
        </>
      )}
    </Row>
  );
});
export default FormButton;