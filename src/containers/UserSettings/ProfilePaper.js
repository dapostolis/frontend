import React, {useState} from 'react';
import {Paper, Typography} from '@material-ui/core';
import {VpnKey as VpnKeyIcon} from '@material-ui/icons';
import HeadingSideLine from 'components/HeadingSideLine';
import {withStyles} from '@material-ui/core/styles';
import {request} from 'constants/alias';
import {API} from 'constants/config';
import {useSnackbar} from 'notistack';
import {generateRegistrationWebauthnBody} from 'api/u2f';
import ButtonSafe from 'components/ButtonSafe';
import EnhancedEditInput from './EnhancedEditInput';
import {format as dateFormat} from 'date-fns';


const styles = theme => ({
  Paper: {
    position: 'relative',
    minHeight: 484,
    padding: theme.spacing.unit * 2,
  },

  fieldsContainer: {
    marginTop: 15,
  },

  formControlLabel: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
  },

  twoFactorContainer: {
    marginTop: 30,
    padding: theme.spacing.unit * 2,
    border: '1px solid ' + theme.palette.primary.main,
    textAlign: 'center',
  },
  twoFactorItem: {
    marginBottom: 10,
  },
  twoFactorIcon: {
    fontSize: 34,
  },
});

function ProfilePaper({classes, user, onHandleChangeUser, onHandleLogout}) {
  const {enqueueSnackbar} = useSnackbar();
  const [state, setState] = useState({
    firstname: user.firstname || '',
    lastname: user.lastname || '',
  });

  function handleResetState() {
    setState({
      firstname: user.firstname || '',
      lastname: user.lastname || '',
    });
  }

  function handleChange(event) {
    setState({
      ...state,
      [event.target.id]: event.target.value,
    });
  }

  async function handleSave() {
    const requestBody = {
      id: user.id,
      firstName: state.firstname,
      lastName: state.lastname,
    };
    try {
      await request.put(`${API}user/update/limited`, requestBody);

      // context handler for user object
      onHandleChangeUser({
        ...user,
        firstname: state.firstname,
        lastname: state.lastname,
      });
    } catch (ex) {
      console.log(ex);
      enqueueSnackbar('Profile information have not saved. If the error persists, contact the system administrator', {variant: 'error'});
      handleResetState();
    }
  }

  /**
   *
   * @param enable
   * @returns {Promise<void>}
   */
  async function handleTwoFactorAuthentication(enable) {

    try {

      let webAuthnBody;

      if (enable) {
        webAuthnBody = await generateRegistrationWebauthnBody(`${API}twofactorauthentication/registration/challenge`, 'get');
      } /*else {
        webAuthnBody = await generateAuthenticationWebauthnBody(`${API}twofactorauthentication/authentication/challenge`, 'get');
      }*/

      if (!webAuthnBody) {
        throw new Error('GENERIC ERROR');
      }

      await request.put(`${API}user/2fa/${enable ? 'enable' : 'disable'}`, {
        webAuthnBody: JSON.stringify(webAuthnBody)
      });

      // finally logout
      if (typeof onHandleLogout === 'function') {

        const msg = await onHandleLogout();
        console.log(msg);
        enqueueSnackbar('You have successfully ' + (enable ? 'enabled' : 'disabled') + ' two factor authentication. Please login again following the new process', {
          variant: 'success',
          autoHideDuration: 7000
        });

      } else {
        console.warn('onHandleLogout is not a function');
      }

    } catch (ex) {

      console.log(ex);
      if (ex.message) {
        if (ex.message.indexOf('The operation either timed out or was not allowed') !== -1) {
          enqueueSnackbar('The operation either timed out or was not allowed', {
            variant: 'warning',
            autoHideDuration: 6000
          });
        } else if (ex.message.indexOf('NOT_SUPPORTED') !== -1) {
          enqueueSnackbar('You have enabled Two Factor Authentication but this browser doesn\'t support this functionality. ' +
            'Please retry with another browser or contact the system administrator. Recommended browser is Google Chrome. ', {
            variant: 'warning',
            autoHideDuration: 10000
          });
        } else {
          enqueueSnackbar('Something went wrong. We do our best to fix the error', {
            variant: 'error',
            autoHideDuration: 6000
          });
        }
      }

    }

  }

  //RENDER
  let isTwoFactorEnabled = user.twoFactor;

  return (
    <Paper className={classes.Paper}>
      <HeadingSideLine title="Profile"/>

      <div className={classes.fieldsContainer}>

        <EnhancedEditInput
          label="First name"
          id="firstname"
          defaultValue={user.firstname}
          fieldValue={state.firstname}
          onChange={handleChange}
          onBlur={handleSave}
        />

        <EnhancedEditInput
          label="Last name"
          id="lastname"
          defaultValue={user.lastname}
          fieldValue={state.lastname}
          onChange={handleChange}
          onBlur={handleSave}
        />

        <EnhancedEditInput
          disabled
          label="Phone"
          id="phone"
          defaultValue={user.phone}
          fieldValue={user.phone}
          onChange={handleChange}
          onBlur={handleSave}
        />

        <EnhancedEditInput
          disabled
          label="Email"
          id="username"
          defaultValue={user.username}
          fieldValue={user.username}
          onChange={handleChange}
          onBlur={handleSave}
        />

        <EnhancedEditInput
          disabled
          label="Creation Date"
          id="dateCreated"
          defaultValue={user.dateCreated}
          fieldValue={dateFormat(user.dateCreated, 'DD/MM/YYYY')}
          onChange={handleChange}
          onBlur={handleSave}
        />

        {!isTwoFactorEnabled ?
          <div className={classes.twoFactorContainer}>
            <VpnKeyIcon className={classes.twoFactorIcon}/>

            <Typography variant="h5" className={classes.twoFactorItem}>
              {isTwoFactorEnabled ? 'Two factor authentication is enabled.' : 'Two factor authentication is not enabled yet.'}
            </Typography>

            <Typography variant="body2" className={classes.twoFactorItem}>Two-factor authentication adds an additional
              layer of security to your account by requiring more than just a password to log in.</Typography>

            {!isTwoFactorEnabled ?
              <ButtonSafe onClick={() => handleTwoFactorAuthentication(true)}>
                Enable two-factor authentication
              </ButtonSafe>
              :
              ''
            }
            {/*<ButtonDanger onClick={() => handleTwoFactorAuthentication(false)}>
              Disable two-factor authentication
            </ButtonDanger>*/}
          </div>
          : ''}
      </div>

    </Paper>
  );
}

export default withStyles(styles)(ProfilePaper);