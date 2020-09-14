import React from 'react';
import { Row, Button, Radio } from 'antd';
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
  renderExtra?: any;
  resetExtra?: any;
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
    renderExtra,
    resetExtra
  } = props;

  const buttonCss = { marginRight: 12 };

  return (
    <div style={{ marginBottom: 12, width: '100%' }}>
      {reset && (
        <Button
          onClick={() => { reset(); resetExtra && resetExtra(); }}
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
          htmlType={'submit'}
        >
          {submitTitle}
        </Button>
      )}
      {extraButtons && (
        <>
          {extraButtons.map((button) => {
            return (
              <Button {...button} style={buttonCss} key={button.title}>
                {button.title}
              </Button>
            );
          })}
        </>
      )}
      {
        renderExtra && renderExtra()
      }
    </div>
  );
});
export default FormButton;
