import { RouteProps } from 'react-router-dom';
import Home from '@/pages/home';

export const routerConfig: RouteProps[] = [
  {
    path: '/',
    component: Home,
    exact: true
  }
];
