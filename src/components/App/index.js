import React, {useState} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Anonymous from 'components/Anonymous';
import Authenticated from 'components/Authenticated';
import Authenticate from 'containers/Authenticate';
import {AuthConsumer} from 'context/AuthContext';
import {CssBaseline} from '@material-ui/core';
import {createMuiTheme, MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import primaryColor from '@material-ui/core/colors/grey';
import infoColor from '@material-ui/core/colors/blue';
import safeColor from '@material-ui/core/colors/green';
import warningColor from '@material-ui/core/colors/yellow';
import dangerColor from '@material-ui/core/colors/red';
import {SnackbarProvider} from 'notistack';


const styles = theme => ({
  '@global': {

    'html.full-height, html.full-height body, html.full-height #root': {
      height: '100%',
    },
    'html.full-height main': {
      height: 'calc(100% - 45px)', // - footer height
    },

    //////

    'body': {
      backgroundColor: '#f5f5f5',
    },
    'body.report': {
      backgroundColor: '#f1f1f1',
    },
    'a': {
      color: theme.palette.secondary.main,
      textDecoration: 'none',
    },
    'a:hover': {
      textDecoration: 'underline',
    },
    '#root': {
      display: 'flex',
    },

    // Highcharts generic responsive css
    '.highcharts-container, .highcharts-container > svg': {
      width: '100% !important',
    },

    // spin loader
    '@keyframes spin': {
      '0%': {
        transform: 'rotate(0deg)',
      },
      '100%': {
        transform: 'rotate(360deg)',
      },
    },

    // Progress indicator
    '.progress': {
      filter: 'blur(6px)',
      animation: 'blur_progress 1.5s infinite',
    },
    '@keyframes blur_progress': {
      '0%': {
        filter: 'blur(6px)',
      },
      '50%': {
        filter: 'blur(8px)',
      },
      '100%': {
        filter: 'blur(6px)',
      },
    },

    // up down
    '@keyframes upDown': {
      '0%': {
        marginTop: 0,
      },
      '50%': {
        marginTop: 6,
      },
      '100%': {
        marginTop: 0,
      },
    },
  },
});

function AuthController() {
  return (
    <React.Fragment>

      <AuthConsumer>
        {({isAuthenticated, user, handleChangeUserPreferences, handleLogoutNoRequest, handleChangeThemeColor}) => (
          isAuthenticated ? (
            <Authenticated
              user={user}
              handleChangeUserPreferences={handleChangeUserPreferences}
              handleLogoutNoRequest={handleLogoutNoRequest}
            />
          ) : (
            <Anonymous handleChangeThemeColor={handleChangeThemeColor}/>
          )
        )}
      </AuthConsumer>

    </React.Fragment>
  )
}


function App() {

  const [themeColor, setThemeColor] = useState('#1f73d1');

  function materialTheme(secondaryColor) {
    return (
      createMuiTheme({
        typography: {
          useNextVariants: true,
        },

        palette: {
          type: 'light',
          primary: {
            moreLight: primaryColor[50],
            light: primaryColor[200],
            main: primaryColor[400],
            dark: primaryColor[700],
          },
          secondary: {
            main: secondaryColor,
          },
          // success: {
          //   light: successColor[200],
          //   semi: successColor[400],
          //   main: successColor[700],
          //   dark: successColor[900],
          // },
          info: {
            light: infoColor[100],
            semi: infoColor[400],
            main: infoColor[700],
            dark: infoColor[900],
          },
          safe: {
            light: safeColor[200],
            semi: safeColor[400],
            main: safeColor[700],
            dark: safeColor[900],
          },
          warning: {
            light: warningColor[200],
            semi: warningColor[400],
            main: warningColor[700],
            dark: warningColor[900],
          },
          danger: {
            light: dangerColor[200],
            semi: dangerColor[400],
            main: dangerColor[700],
            dark: dangerColor[900],
          },
          textPrimary: {
            main: '#000',
          },
        },
      })
    )
  }

  // Set new theme color through localStorage or through organization.themeColor
  const handleChangeThemeColor = themeColor => setThemeColor(themeColor ? themeColor : '#1f73d1');

  return (
    <Router>
      <>
        <CssBaseline/>

        <Authenticate handleChangeThemeColor={handleChangeThemeColor}>
          <MuiThemeProvider theme={materialTheme(themeColor)}>
            <SnackbarProvider
              maxSnack={3}
              preventDuplicate={true}
              autoHideDuration={5500}
              anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            >
              <AuthController/>
            </SnackbarProvider>
          </MuiThemeProvider>
        </Authenticate>
      </>
    </Router>
  )
}

export default withStyles(styles)(App);
