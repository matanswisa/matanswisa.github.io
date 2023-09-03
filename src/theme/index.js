import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import shadows from './shadows';
import typography from './typography';
import GlobalStyles from './globalStyles';
import customShadows from './customShadows';
import componentsOverride from './overrides';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../redux-toolkit/darkModeSlice';
import { getDarkOrLightModeStyle } from './palette';

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export default function ThemeProvider({ children }) {
  const darkmode = useSelector(selectDarkMode);
  const [theme, setTheme] = useState(createTheme(getThemeOptions(darkmode)));

  useEffect(() => {
    setTheme(createTheme(getThemeOptions(darkmode)));
  }, [darkmode]);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}

function getThemeOptions(darkmode) {
  const palette = getDarkOrLightModeStyle(darkmode);

  return {
    palette,
    shape: { borderRadius: 6 },
    typography,
    shadows: shadows(palette),
    customShadows: customShadows(palette),
  };
}
