import Home from './pages/Home';
import Lottery from './pages/Lottery';
import UserManagement from './pages/UserManagement';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: '首页',
    path: '/',
    element: <Home />
  },
  {
    name: '抽奖页',
    path: '/lottery',
    element: <Lottery />
  },
  {
    name: '用户管理',
    path: '/users',
    element: <UserManagement />
  }
];

export default routes;