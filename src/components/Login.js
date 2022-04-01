/**
 * Login component
 */

import React, {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {AuthConsumer} from 'context/AuthContext';
import {Button, FormControl, Link as MLink, Paper, TextField, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import logo from 'assets/images/logo.png';
import {useSnackbar} from 'notistack/build';
import {request} from 'constants/alias';
import {API} from 'constants/config';
import {generateAuthenticationWebauthnBody} from 'api/u2f';
import Loader from './LoaderCircle';


const style = theme => ({

  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },

  logoWrap: {
    position: 'relative',
    margin: '10px 0',
    padding: '10px 22px 10px 21px',
    // backgroundColor: theme.palette.primary.dark,
  },
  img: {
    width: '200px',
  },
  caption: {
    color: theme.palette.primary.light,
    position: 'absolute',
    top: '80px',
    left: '150px',
  },

  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },

  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },

  button: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },

  linkdark: {
    color: theme.palette.primary.dark,
  },

  by: {
    marginTop: '15px',
  },

  forgotPass: {
    textAlign: 'center',
    marginTop: 13,
  },
});

function Login({classes}) {
  const {enqueueSnackbar} = useSnackbar();
  // const [fetchLoading, setFetchLoading] = useState(true);
  const passwordInput = useRef(null);
  // const [logoUrl, setLogoUrl] = useState(null);
  const [state, setState] = useState({
    formFields: {
      email: '',
      password: '',
    },
    formErrors: {
      email: '',
      password: '',
    },
    loading: false,
  });

  // todo stop re-update component
  useEffect(() => {
    document.body.classList.add('front');

    /*try {
      let th = window.localStorage.getItem('th');
      if (!th) throw {message: 'It looks that no user has been logged in on this browser yet'};

      let theme = window.JSON.parse(window.atob(th));

      request.get(theme.logoUrl)
        .then(() => {
          setLogoUrl(theme.logoUrl);
        })
        .catch(error => console.log(error));

    } catch (ex) {
      console.log(ex.message);
    }

    setFetchLoading(false);*/

    return () => {
      document.body.classList.remove('front');
    };
  }, []);

  /**
   * Handlers
   */

  function handleChange(event) {
    const {id, value} = event.target;
    setState({
      ...state,
      formFields: {
        ...state.formFields,
        [id]: value,
      },
    });
  }

  async function handleSubmit(event, contextLogin) {
    event.preventDefault();

    const {formFields: {email, password}} = state;

    if (email === '' || password === '') {
      setState({
        ...state,
        formErrors: {
          email: email === '' ? 'This field is required' : '',
          password: password === '' ? 'This field is required' : '',
        },
      });
      return false;
    }

    setState({
      ...state,
      loading: true
    });

    function login(webAuthnBody) {
      contextLogin(email, password, webAuthnBody)
        .then(msg => console.log(msg))
        .catch(ex => {
          // Alert.error(ex);
          console.log(ex);
          enqueueSnackbar(ex, {variant: 'error'});
          setState({
            ...state,
            loading: false
          });
          passwordInput.current.focus();
          passwordInput.current.setSelectionRange(0, password.length);
        });
    }

    try {
      const {data} = await request.post(`${API}auth/check`, {
        username: email,
        password: password,
      });


      if (data === 'NOT_2FA') {

        // typical login
        login();

      } else if (data === '2FA') {

        const webAuthnBody = await generateAuthenticationWebauthnBody(`${API}twofactorauthentication/authentication/anonymous/challenge`, 'post', {
          username: email,
          password: password,
        });

        login(webAuthnBody);

      } else {

        // generic error for unauthorized user
        enqueueSnackbar('Wrong username or password. Please try again', {variant: 'error'});
        throw new Error('');

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
      setState({
        ...state,
        loading: false
      });
    }

  }

  //RENDER
  function getLogo(user) {
    let logoUrl = logo;
    if ('organization' in user) {
      logoUrl = user.organization.logoUrl;
    }
    return logoUrl;
  }

  const {formFields, formErrors, loading} = state;

  return (
    <>
      <AuthConsumer>
        {({user, handleLogin}) => (
          <Paper className={classes.paper}>

            <div id="logo" className={classes.logoWrap}>
              <img className={classes.img} src={getLogo(user)} alt="logo"/>
            </div>

            <form
              className={classes.container}
              noValidate
              autoComplete="off"
              onSubmit={event => event.preventDefault()}
            >

              <FormControl required fullWidth variant="outlined" error={formErrors.email !== ''}>
                <TextField
                  id="email"
                  label="Email"
                  className={classes.textField}
                  type="email"
                  name="email"
                  value={formFields.email}
                  margin="normal"
                  variant="outlined"
                  error={formErrors.email !== ''}
                  helperText={formErrors.email}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>

              <FormControl required fullWidth variant="outlined" error={formErrors.password !== ''}>
                <TextField
                  inputRef={passwordInput}
                  id="password"
                  label="Password"
                  className={classes.textField}
                  type="password"
                  name="password"
                  value={formFields.password}
                  autoComplete="current-password" // todo
                  margin="normal"
                  variant="outlined"
                  error={formErrors.password !== ''}
                  helperText={formErrors.password}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>


              <Button type="submit"
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      disabled={loading}
                      onClick={event => handleSubmit(event, handleLogin)}
              >
                Sign in
              </Button>

              {/*<Link to="/forgotpassword"><Typography className={classes.forgotPass}>Forgot your Password</Typography></Link>*/}
              <Typography component="div" className={classes.forgotPass}><MLink component={Link} to="/forgotpassword" className={classes.linkdark}>Forgot your Password</MLink></Typography>

            </form>

          </Paper>
        )}
      </AuthConsumer>

      <Typography paragraph={true} align="center" className={classes.by}>by Wealthium</Typography>
    </>
  );
}

export default withStyles(style)(Login);
