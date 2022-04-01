import React, {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Button, FormControl, Paper, TextField} from '@material-ui/core';
import {request} from 'constants/alias';
import {API} from 'constants/config';
import logo from 'assets/images/logo.png';
import Loader from 'components/LoaderCircle';
import {AuthConsumer} from 'context/AuthContext';
import {useSnackbar} from 'notistack';
import InfoBox from 'components/InfoBox';


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
});

function ForgotPasswordPage({classes, history, user}) {
  const {enqueueSnackbar} = useSnackbar();
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form, setForm] = useState({
    values: {
      email: '',
      verifyEmail: '',
    },
    error: {
      email: '',
      verifyEmail: '',
    },
  });

  useEffect(() => {
    // fake loading
    setTimeout(() => {
      setPageLoading(false);
    }, 1200);
  });

  function handleChange(event) {
    const {id, value} = event.target;

    setForm({
      ...form,
      values: {
        ...form.values,
        [id]: value,
      },
    })
  }

  function handleSubmit(event) {

    event.preventDefault();

    // Validate required fields
    if (!form.values.email || !form.values.verifyEmail) {
      setForm({
        ...form,
        errors: {
          email: 'Email field is required',
          verifyEmail: 'Verify Email field is required',
        },
      });

      return false;
    }

    if (form.values.email !== form.values.verifyEmail) {
      enqueueSnackbar('Emails are not the same. Please retype your email', {variant: 'error'});
      return false;
    }

    setSubmitLoading(true);

    request
      .post(`${API}user/forgotpassword`, form.values)
      .then(() => {
        enqueueSnackbar('A reset password link has been sent to your email', {variant: 'success'});

        // move to login page
        history.push('/');
      })
      .catch(error => {
        console.log(error);

        const {response: {data}} = error;

        if (data) {
          enqueueSnackbar(data.message, {variant: 'error'});
        }

        setSubmitLoading(false);
      });

  }


  //RENDER
  if (pageLoading) {
    return (
      <Loader start={true}/>
    )
  }

  let logoUrl = logo;
  if ('organization' in user) {
    logoUrl = user.organization.logoUrl;
  }

  return (
    <Paper className={classes.paper}>

      <div id="logo" className={classes.logoWrap}><img className={classes.img} src={logoUrl} alt="logo"/></div>

      <InfoBox show={true} type="neutral">
        Password reset instructions will be sent to your registered email address
      </InfoBox>

      <form
        className={classes.container}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >

        <FormControl required fullWidth variant="outlined" error={form.error.email !== ''}>
          <TextField
            id="email"
            label="Email"
            className={classes.textField}
            name="email"
            value={form.values.email}
            margin="normal"
            variant="outlined"
            error={form.error.email !== ''}
            helperText={form.error.email}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl required fullWidth variant="outlined" error={form.error.verifyEmail !== ''}>
          <TextField
            id="verifyEmail"
            label="Verify Email"
            className={classes.textField}
            name="verifyEmail"
            value={form.values.verifyEmail}
            margin="normal"
            variant="outlined"
            error={form.error.verifyEmail !== ''}
            helperText={form.error.verifyEmail}
            onChange={handleChange}
          />
        </FormControl>


        <Button type="submit"
                variant="contained"
                color="secondary"
                className={classes.button}
                disabled={submitLoading}
        >
          Request for change
        </Button>

      </form>

    </Paper>
  )
}

const EnhancedValidationPage = withStyles(style)(ForgotPasswordPage);

function ForgotPasswordPageWrapper(props) {
  return (
    <AuthConsumer>
      {({user}) => (
        <EnhancedValidationPage user={user} {...props}/>
      )}
    </AuthConsumer>
  )
}

export default ForgotPasswordPageWrapper;