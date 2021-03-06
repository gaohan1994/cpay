import React from 'react';
import {
  BrowserRouter,
  Router,
  Switch,
  Route,
  RouteProps,
  Redirect,
} from 'react-router-dom';
import { AnimatedSwitch, spring } from 'react-router-transition';
import { routerConfig } from '@/common/route-config';
import { menuConfig, formatMenuConfig } from '@/common/menu-config';
import LayouContainer from '@/modules/layout-container';
import { history } from '@/common/history-util';
import ErrorComponent from '@/pages/exception/error';
import { systemMenuList } from '@/pages/system/menu/constants/api'
import { connect } from 'react-redux';
import { getUserAndMenu } from '@/pages/user/constants/api';

export type WebNavigator = { child?: any[] } & RouteProps;

export type CreateWebNavigationParams = {
  routes: WebNavigator[];
  transition?: boolean;
};

function createWebNavigation(params: CreateWebNavigationParams): any {
  const { routes, transition = true } = params;
  return class extends React.Component<any, any> {

    public componentDidMount () {
      const { dispatch } = this.props
      getUserAndMenu(dispatch)
    }

    public componentWillReceiveProps(nextProps: any) {
      if(this.props.menuTreeData !== nextProps.menuTreeData){
        const { dispatch } = this.props
        getUserAndMenu(dispatch)
      }
    }

    render() {
      const { menus } = this.props
      const login = routes.find((r) => r.path === '/login');
      return (
        <BrowserRouter>
          <Router history={history}>
            <Switch>
              {login && <Route key={'login'} {...login} />}
              <LayouContainer menus={formatMenuConfig(menus)}>
              {/* <LayouContainer menus={menuConfig}> */}
                {routes.map((item: WebNavigator, index: number) => {
                  const { ...rest } = item;
                  return <Route key={index} {...rest} />;
                })}
                {/* <Route path="/notFound" component={ErrorComponent} />
                <Redirect to="/notFound" /> */}
              </LayouContainer>
            </Switch>
          </Router>
        </BrowserRouter>
      );
    }
  };
}

function mapStyles(styles: any) {
  return {
    opacity: styles.opacity,
    transform: `scale(${styles.scale})`,
  };
}

function bounce(val: number) {
  return spring(val, {
    stiffness: 330,
    damping: 22,
  });
}

const switchTransition = {
  atEnter: {
    opacity: 0,
    scale: 1.2,
  },
  atLeave: {
    opacity: bounce(0),
    scale: bounce(0.8),
  },
  atActive: {
    opacity: bounce(1),
    scale: bounce(1),
  },
};

function createSwitchNavigation(
  transition: boolean
): { SwitchComponent: any; SwitchProps: any } {
  if (transition === true) {
    /**
     * [启用跳转动画]
     */
    return {
      SwitchComponent: AnimatedSwitch,
      SwitchProps: {
        atEnter: switchTransition.atEnter,
        atLeave: switchTransition.atLeave,
        atActive: switchTransition.atActive,
        mapStyles: mapStyles,
        className: 'route-wrapper',
      },
    };
  } else {
    /**
     * [不启用跳转动画]
     */
    return { SwitchComponent: Switch, SwitchProps: {} };
  }
}

const AppRouter = connect((state: any) => {
  return {
    menus: state?.user?.menus,
    menuTreeData: state?.system?.menuTreeData
  }
})(createWebNavigation({ routes: routerConfig }))

export { createWebNavigation, AppRouter };
