// component
import { useSelector } from 'react-redux';
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
    title: 'firstLogin',
    path: '/dashboard/firstloginpage',
    icon: icon('dashboard'),
  },

  {
    title: 'admins only',
    path: '/manage-users'
  },
  {
    title: 'Daily Stats',
    path: '/dashboard/dailystatspage',
    icon: icon('ic_analytics'),
  },
  {
    title: 'reports',
    path: '/dashboard/reports',
    icon: icon('report'),
  },


  {
    title: 'login',
    path: '/login',
    icon: icon(''),
  },

];

export default navConfig;
