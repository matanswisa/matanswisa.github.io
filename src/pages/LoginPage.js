import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components

import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';
import LogoImage from '../components/logo/logoImage'

import { useDispatch, useSelector } from 'react-redux';
// import { selectMode } from '../redux-toolkit/darkModeSlice';
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
  backgroundColor: 'white', // Set the background color to white
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 580,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: 'white',

}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 780,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------



export default function LoginPage() {



  // const mode = useSelector(selectMode);
  // console.log("$$$$$$$",mode);

  const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Helmet>
        <title> Login | TradeExalt </title>
      </Helmet>

      <StyledRoot>

        {mdUp && (
          <StyledSection>
            <LogoImage loginpage = 'true' w='500px' h='400px' />

          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>



            <Divider sx={{ my: 3 }}>

            </Divider>

            <LoginForm />


          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
