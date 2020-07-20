declare module 'react-router-transition' {
  type AnimatedSwitchProps = {
    atEnter?: any;
    atLeave?: any;
    atActive?: any;
    mapStyles?: any;
    runOnMount?: boolean;
    wrapperComponent?: any;
    className?: any;
  };

  class AnimatedSwitch extends React.Component<AnimatedSwitchProps, any> {}

  function spring(params1?: any, params2?: any): any;
}
