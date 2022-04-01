import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import {Button, Checkbox, FormControl, Paper, TextField, Typography} from '@material-ui/core';
import {request} from 'constants/alias';
import {API} from 'constants/config';
import logo from 'assets/images/logo.png';
import Loader from 'components/LoaderCircle';
import {AuthConsumer} from 'context/AuthContext';
import {useSnackbar} from 'notistack/build';
import InfoBox from '../../components/InfoBox';
import InputLabel from '@material-ui/core/InputLabel';
import DisclaimerDialog from '../../components/DisclaimerDialog';


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

  linkReadDisclaimer: {
    fontSize: 16,
    cursor: 'pointer',
  },

  inlineField: {
    display: 'flex',
    alignItems: 'center',
  },

  checkboxLabel: {
    marginTop: 2,
  },
});

function ValidationPage({classes, history, match: {params: {uid, vid}}, user, handleChangeUser, handleChangeThemeColor}) {
  const {enqueueSnackbar} = useSnackbar();
  const [disclaimerDialogOpen, setDisclaimerDialogOpen] = useState(false);
  const [disclaimerActionButtonsDisabled, setDisclaimerActionButtonsDisabled] = useState(true);
  const [page, setPage] = useState({
    loading: true,
    logoUrl: '',
    themeColor: '',
  });
  const [form, setForm] = useState({
    loading: false,
    values: {
      password: '',
      verifyPassword: '',
      acceptTermsAndConditions: false,
    },
    errors: {
      password: '',
      verifyPassword: '',
    },
  });

  useEffect(() => {
    // validate requested url
    request
      .get(`${API}auth/validate/${uid}/${vid}`)
      .then(({data: {returnobject: organization}}) => {

        setPage({
          loading: false,
          logoUrl: organization.logoUrl,
          themeColor: organization.themeColor,
        });

        if (organization.themeColor) {
          handleChangeThemeColor(organization.themeColor);
        }

      })
      .catch(() => {
        history.push('/');
      });

    //SCROLLING_EVENT - disclaimer modal
    function scrollCb(event) {
      let scrollTarget = event.target;

      if (scrollTarget.id === 'scroll-area') {
        if (scrollTarget.scrollHeight - (scrollTarget.offsetHeight * 1.07) <= scrollTarget.scrollTop) {
          setDisclaimerActionButtonsDisabled(false);
        } else {
          setDisclaimerActionButtonsDisabled(true);
        }
      }
    }

    window.addEventListener('scroll', scrollCb, true);
    //EoSCROLLING_EVENT

    let observer;
    (function setupObserver() {
      // Select the node that will be observed for mutations
      const targetNode = document.body;

      // Options for the observer (which mutations to observe)
      const config = {childList: true};

      // Callback function to execute when mutations are observed
      const observerCb = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
          if (mutation.type === 'childList') {
            if (mutation.addedNodes.length > 0) {

              for (let addedNode of mutation.addedNodes) {

                if (addedNode.id === 'disclaimer-modal') {

                  // modal is opened
                  const scrollArea = document.getElementById('scroll-area');

                  if (scrollArea) {

                    // check scrolling height
                    if (scrollArea.scrollHeight - scrollArea.offsetHeight === scrollArea.scrollTop) {
                      setDisclaimerActionButtonsDisabled(false);
                    } else {
                      setDisclaimerActionButtonsDisabled(true);
                    }

                  }

                }

              }

            }
          }
        }
      };

      // Create an observer instance linked to the callback function
      observer = new MutationObserver(observerCb);

      // Start observing the target node for configured mutations
      observer.observe(targetNode, config);

    })();

    // unmount component
    return () => {
      window.removeEventListener('scroll', scrollCb, true);

      observer.disconnect();
    }

  }, []);

  function handleChange(event) {
    const target = event.target,
      {id, type, value, checked} = target;

    let fieldValue = type === 'checkbox' ? checked : value;

    setForm({
      ...form,
      values: {
        ...form.values,
        [id]: fieldValue,
      },
    });
  }

  function handleSubmit(event) {

    event.preventDefault();

    // Validate required fields
    if (!form.values.acceptTermsAndConditions) {
      enqueueSnackbar('In order to continue, you have to accept the Terms & Conditions', {variant: 'error'});
      return false;
    }

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
      .put(`${API}auth/enable/${uid}/${vid}`, form.values)
      .then(() => {
        enqueueSnackbar('Your password successfully saved', {variant: 'success'});

        // if password has been correctly set, then store the user's theme preferences
        let theme = {
          themeColor: page.themeColor,
          logoUrl: page.logoUrl,
        };

        window.localStorage.setItem('th', window.btoa(JSON.stringify(theme)));

        handleChangeUser({
          ...user,
          organization: {
            logoUrl: theme.logoUrl,
            themeColor: theme.themeColor,
          },
        });

        // move to login page
        history.push('/');
      })
      .catch(error => {
        console.log(error);

        const {response: {data}} = error;

        if (data) {

          if (data.code === '20') {
            enqueueSnackbar('Your password is too weak. Password minimum length is 10 characters, use at least one capital letter and a special character (!@#$%^&* etc)', {variant: 'error'});
          } else if (data.code === '27') {
            enqueueSnackbar('In order to continue, you have to accept the Terms & Conditions', {variant: 'error'});
          } else {
            enqueueSnackbar('Something went wrong. Please contact your system administrator', {variant: 'error'});
          }

        }

        setForm({
          ...form,
          loading: false,
        });
      });

  }

  //DISCLAIMER
  function handleOpenDisclaimerDialog() {
    setDisclaimerDialogOpen(true);
  }
  function handleCloseDisclaimerDialog() {
    setDisclaimerDialogOpen(false);
    setDisclaimerActionButtonsDisabled(true);
  }

  function handleTermsAgree() {
    setForm({
      ...form,
      values: {
        ...form.values,
        acceptTermsAndConditions: true,
      },
    });
    setDisclaimerDialogOpen(false);
  }

  function handleTermsDisagree() {
    setForm({
      ...form,
      values: {
        ...form.values,
        acceptTermsAndConditions: false,
      },
    });
    setDisclaimerDialogOpen(false);
  }
  //EoDISCLAIMER

  //RENDER
  let logoUrl = page.logoUrl ? page.logoUrl : logo;

  if (page.loading) {
    return (
      <Loader start={true}/>
    )
  }

  return (
    <Paper className={classes.paper}>

      <Link to="/"><div id="logo" className={classes.logoWrap}><img className={classes.img} src={logoUrl} alt="logo"/></div></Link>

      <InfoBox show={true} type="neutral">
        Set your password to activate your account
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

        <div className={classes.inlineField}>
          <DisclaimerDialog
            showApproveControls={true}
            open={disclaimerDialogOpen}
            disclaimerActionButtonsDisabled={disclaimerActionButtonsDisabled}
            onHandleClose={handleCloseDisclaimerDialog}
            onHandleTermsAgree={handleTermsAgree}
            onHandleTermsDisagree={handleTermsDisagree}
          />
          <Checkbox
            id="acceptTermsAndConditions"
            checked={form.values.acceptTermsAndConditions}
            // onChange={handleChange}
            // disabled={true}
            onClick={handleOpenDisclaimerDialog}
          />
          <InputLabel className={classes.checkboxLabel} htmlFor="acceptTermsAndConditions" onClick={handleOpenDisclaimerDialog}>Accept Terms & Conditions</InputLabel>
          {/*<Typography><Link color="secondary" className={classes.linkReadDisclaimer} onClick={handleOpenDisclaimerDialog}>Terms & Conditions</Link></Typography>*/}
          {/*<InputLabel htmlFor="acceptTermsAndConditions">Accept&nbsp;</InputLabel>
          <Typography><Link color="secondary" className={classes.linkReadDisclaimer} onClick={handleOpenDisclaimerDialog}>Terms & Conditions</Link></Typography>*/}
        </div>


        <Button type="submit"
                variant="contained"
                color="secondary"
                className={classes.button}
                disabled={form.loading}
        >
          Set Password
        </Button>

      </form>

    </Paper>
  )
}

const EnhancedValidationPage = withStyles(style)(ValidationPage);

function ValidationPageWrapper(props) {
  return (
    <AuthConsumer>
      {({user, handleChangeUser, handleChangeThemeColor}) => (
        <EnhancedValidationPage
          user={user}
          handleChangeUser={handleChangeUser}
          handleChangeThemeColor={handleChangeThemeColor}
          {...props}
        />
      )}
    </AuthConsumer>
  )
}

export default ValidationPageWrapper;
