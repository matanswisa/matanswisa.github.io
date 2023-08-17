import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';
import { useDispatch } from 'react-redux';
import { logout, setCurrentAccount } from '../../redux-toolkit/userSlice';

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};


export default function NavSection({ data = [], ...other }) {
  const dispatch = useDispatch();

  const handleSignout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch(logout());
  }


  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          item.title.toLowerCase() === 'signout' ?
            <NavItem key={item.title} item={item} onClick={handleSignout} /> : <NavItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const { title, path, icon, info } = item;

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />

      {info && info}
    </StyledNavItem>
  );
}
