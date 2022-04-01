/**
 * Component for unauthenticated users
 */

import React from 'react';
import Login from 'components/Login';
import {Route, Switch, Redirect} from 'react-router-dom';
import ValidationPage from 'containers/ValidationPage';
import ForgotPasswordPage from 'containers/ForgotPasswordPage';
import ResetPasswordPage from 'containers/ResetPasswordPage';
import DYReportPublic from 'containers/DYReportPublic';
import {withStyles} from '@material-ui/core/styles';
import Footer from './Footer';


const style = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },

    'body.report &': { // for dyreport public page
      display: 'inline',
      margin: 0,
    }
  },
});

function Anonymous({classes, handleChangeThemeColor}) {
  return (
    <>
      <main className={classes.main}>

        <Switch>
          <Route path="/" exact component={() => <><Login/></>}/>

          <Route path="/validate/:uid/:vid" component={ValidationPage}/>

          <Route path="/resetpassword/:uid/:vid" component={ResetPasswordPage}/>

          <Route path="/forgotpassword" component={ForgotPasswordPage}/>

          <Route path="/dyreport-public/:id" component={props => <DYReportPublic handleChangeThemeColor={handleChangeThemeColor} {...props}/>}/>

          <Route component={() => <Redirect to="/"/>}/>
        </Switch>

      </main>

      <Footer/>
    </>
  )
}


export default withStyles(style)(Anonymous);