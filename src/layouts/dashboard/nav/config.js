// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('dashboard'),
  },
  {
    title: 'Daily Stats',
    path: '/dashboard/dailystatspage',
    icon: icon('ic_analytics'),
  },
  {
    title: 'reports',
    path: '/dashboard/reports',
    icon: icon(''),
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: icon(''),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon(''),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon(''),
  },
];

export default navConfig;
