import React, {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Button, FormControl, Paper, TextField} from '@material-ui/core';
import {request} from 'constants/alias';
import {API} from 'constants/config';
import logo from 'assets/images/logo.png';
import Loader from 'components/LoaderCircle';
import {AuthConsumer} from 'context/AuthContext';
import {useSnackbar} from 'notistack/build';
import InfoBox from '../../components/InfoBox';


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

function ResetPasswordPage({classes, history, match: {params: {uid, vid}}, user}) {
  const {enqueueSnackbar} = useSnackbar();
  const [page, setPage] = useState({
    loading: true,
    // logoUrl: '',
    // themeColor: '',
  });
  const [form, setForm] = useState({
    loading: false,
    values: {
      password: '',
      verifyPassword: '',
    },
    errors: {
      password: '',
      verifyPassword: '',
    },
  });
  useEffect(() => {

    request
      .get(`${API}auth/forgotpassword/${uid}/${vid}`)
      .then(() => {

        setPage({
          loading: false,
          // logoUrl: organization.logoUrl,
          // themeColor: organization.themeColor,
        });

        // if (organization.themeColor) {
        //   handleChangeThemeColor(organization.themeColor);
        // }

      })
      .catch(() => {
        history.push('/');
      });

  }, []);

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
    if (!form.values.password || !form.values.verifyPassword) {
      setForm({
        ...form,
        errors: {
          password: 'Password field is required',
          verifyPassword: 'Verify Password field is required',
        },
      });

      return false;
    }

    // compare password && verifyPassword
    if (form.values.password !== form.values.verifyPassword) {
      enqueueSnackbar('Passwords are not the same. Please retype your password', {variant: 'error'});
      return false;
    }

    setForm({
      ...form,
      loading: true,
    });

    request
      .put(`${API}auth/resetpassword/${uid}/${vid}`, form.values)
      .then(() => {
        enqueueSnackbar('Your password successfully changed', {variant: 'success'});
        // move to login page
        history.push('/');
      })
      .catch(error => {
        const {response: {data}} = error;

        if (data && data.code === '20') {
          enqueueSnackbar('Your password is too weak. Password minimum length is 10 characters, use at least one capital letter and a special character (!@#$%^&* etc)', {variant: 'error'});
        }

        setForm({
          ...form,
          loading: false,
        });

        console.log(error);
      })

  }

  //RENDER
  if (page.loading) {
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
        Type your new password
      </InfoBox>

      <form
        className={classes.container}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >

        <FormControl required fullWidth variant="outlined" error={form.errors.password !== ''}>
          <TextField
            id="password"
            label="Password"
            className={classes.textField}
            type="password"
            name="password"
            value={form.values.password}
            margin="normal"
            variant="outlined"
            error={form.errors.password !== ''}
            helperText={form.errors.password}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl required fullWidth variant="outlined" error={form.errors.verifyPassword !== ''}>
          <TextField
            id="verifyPassword"
            label="Verify Password"
            className={classes.textField}
            type="password"
            name="verifyPassword"
            value={form.values.verifyPassword}
            margin="normal"
            variant="outlined"
            error={form.errors.verifyPassword !== ''}
            helperText={form.errors.verifyPassword}
            onChange={handleChange}
          />
        </FormControl>


        <Button type="submit"
                variant="contained"
                color="secondary"
                className={classes.button}
                disabled={form.loading}
        >
          Submit
        </Button>

      </form>

    </Paper>
  )
}

const EnhancedValidationPage = withStyles(style)(ResetPasswordPage);

function ResetPasswordPageWrapper(props) {
  return (
    <AuthConsumer>
      {({user, handleChangeThemeColor}) => (
        <EnhancedValidationPage
          user={user}
          handleChangeThemeColor={handleChangeThemeColor}
          {...props}
        />
      )}
    </AuthConsumer>
  )
}

export default ResetPasswordPageWrapper;