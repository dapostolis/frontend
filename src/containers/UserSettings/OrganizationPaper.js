import React, {useRef, useState} from 'react';
import {Button, FormControl, Input, InputLabel, Paper, Typography} from '@material-ui/core';
import HeadingSideLine from '../../components/HeadingSideLine';
import {withStyles} from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import classnames from 'classnames';
import {Clear as ClearIcon, Undo as UndoIcon} from '@material-ui/icons';
import {useSnackbar} from 'notistack';
import {SketchPicker} from 'react-color';
import {request} from '../../constants/alias';
import {API} from '../../constants/config';
import {Base64} from 'js-base64';


const MAX_CHARS = 5100;

const styles = theme => ({
  Paper: {
    position: 'relative',
    minHeight: 120,
    padding: theme.spacing.unit * 2,
  },


  customLabel: {
    color: 'rgba(0, 0, 0, 0.54)',
    marginTop: 10,
    marginBottom: 5,
    padding: 0,
    fontSize: '1rem',
  },
  fieldgroup: {
    border: '3px dotted ' + theme.palette.secondary.main,
    marginTop: 16,
    padding: '0 15px 15px 15px',
  },
  helper: {
    // fontSize: 14,

    '& > div': {
      marginBottom: 5,
    },
  },
  formControl: {
    width: '100%',
    marginTop: 16,

    '& .danger': {
      color: theme.palette.danger.main,
    },

    '& .disabled': {
      opacity: 0.4,
    }
  },
  inputMultiline: {
    '& > div': {
      maxHeight: 150,
      overflow: 'auto',
    },
  },

  textField: {
    width: '100%',
  },

  button: {
    marginTop: 20,
  },

  LinearProgressRoot: {
    position: 'absolute',
    width: '100%',
    height: 5,
  },

  imgWrap: {
    textAlign: 'center',
    width: 220,
    marginTop: 10,
    padding: 5,
    border: '1px solid ' + theme.palette.primary.main,
    position: 'relative',

    '& > img': {
      maxWidth: 200,
      maxHeight: 125,
    },
  },
  clearIcon: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: 'white',
    border: '1px solid black',
    borderRadius: 15,
    cursor: 'pointer',
    transition: 'transform 0.4s ease',

    '&:hover': {
      transform: 'scale(1.2)',
    },
  },

  color: {
    width: '36px',
    height: '14px',
    borderRadius: '2px',
    // background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
  },
  swatch: {
    padding: '5px',
    background: '#fff',
    borderRadius: '1px',
    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    display: 'inline-block',
    cursor: 'pointer',
  },
  popover: {
    position: 'absolute',
    zIndex: '2',
  },
  cover: {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
});

function OrganizationPaper({classes, user, onHandleChangeUser, onHandleChangeThemeColor}) {
  // const contactInput = useRef(null);
  const {enqueueSnackbar} = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    disclaimer: user.organization.disclaimer || '',
    themeColor: user.organization.themeColor,
  });
  const [fileContactRemove, setFileContactRemove] = useState(false);
  const [fileSize, setFileSize] = useState({
    contact: {
      delimiter: 'MB',
      denominator: 1000000,
      limit: 2000000,
      value: 0,
    },
  });

  function handleChange(event) {
    const target = event.target,
      {id, type, value, checked} = target;

    let fieldValue = type === 'checkbox' ? checked : value;

    setState({
      ...state,
      [id]: fieldValue,
    });
  }

  function handleChangeFileSize(event) {
    const target = event.target,
      {id, files} = target;

    if (files.length > 0) {
      let fileName = id.split('-')[0];

      setFileSize({
        ...fileSize,
        [fileName]: {
          ...fileSize[fileName],
          value: files[0].size,
        },
      });
    }
  }

  // remove contact image. It is used only on UPDATE method
  function handleClickRemoveContact() {
    setFileContactRemove(!fileContactRemove);
  }

  function handleChangeColor(color) {
    setState({
      ...state,
      themeColor: color.hex,
    });
  }

  async function handleSubmit() {
    // validation
    if (state.disclaimer.length > MAX_CHARS) {
      enqueueSnackbar('You have exceeded the maximum amount of characters for disclaimer field.', {variant: 'error'});
      return;
    }

    if (fileSize.contact.value > fileSize.contact.limit) {
      enqueueSnackbar(`Contact details file should be lower than ${fileSize.contact.limit / fileSize.contact.denominator}${fileSize.contact.delimiter}. Please use another file`, {variant: 'error'});
      return;
    }
    // EoValidation


    setLoading(true);

    try {
      // const contactFile = contactInput.current;
      const encodedData = Base64.encode(JSON.stringify({
        disclaimer: disclaimer.trim(),
        themeColor: themeColor,
        fileContactRemove: fileContactRemove,
      }));
      const formData = new FormData();

      formData.append('fieldsData', encodedData);
      // if (contactFile.files.length > 0) {
      //   formData.append('contact', contactFile.files[0]);
      // }

      let {data: {returnobject: contactUrl}} = await request.post(`${API}organization/${user.organization.id}/update/limited`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const organizationState = {};

      if (state.themeColor !== user.organization.themeColor) {
        organizationState.themeColor = state.themeColor;
        onHandleChangeThemeColor(state.themeColor);
      }

      if (state.disclaimer !== user.organization.disclaimer) {
        organizationState.disclaimer = state.disclaimer;
      }

      if (contactUrl !== user.organization.contactUrl) {
        organizationState.contactUrl = contactUrl;
      }

      onHandleChangeUser({
        ...user,
        organization: {
          ...user.organization,
          ...organizationState,
        }
      });

      // contactFile.value = '';

    } catch (ex) {
      console.log(ex);
    }

    setFileContactRemove(false);
    setLoading(false);
  }

  const {disclaimer, themeColor} = state;

  return (
    <Paper className={classes.Paper}>
      <HeadingSideLine title="Organization"/>

      <form noValidate autoComplete="off" onSubmit={event => event.preventDefault()}>

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="disclaimer">Disclaimer (Multiline text)</InputLabel>
          <Input
            multiline
            id="disclaimer"
            name="disclaimer"
            className={classes.inputMultiline}
            value={disclaimer}
            onChange={handleChange}
          />
          <FormHelperText component="div"
                          className={classnames(classes.helper, {'danger': disclaimer.length > MAX_CHARS})}>
            Characters: {disclaimer.length} / {MAX_CHARS}
          </FormHelperText>
        </FormControl>


        {/*<fieldset className={classes.fieldgroup}>
          <legend><Typography>Contact Details</Typography></legend>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="contact-upload" shrink={true}>Upload new contact details</InputLabel>
            <Input
              inputRef={contactInput}
              id="contact-upload"
              type="file"
              onChange={handleChangeFileSize}
            />
            <FormHelperText component="div" className={classes.helper}>
              <div>Please use images with maximum dimensions 740x1000.</div>
              <div className={classnames({'danger': fileSize.contact.value > fileSize.contact.limit})}>Size
                limit: {fileSize.contact.value ? fileSize.contact.value / fileSize.contact.denominator : 0}MB
                / <strong>{fileSize.contact.limit / fileSize.contact.denominator}{fileSize.contact.delimiter}</strong>
              </div>
            </FormHelperText>

            {user.organization.contactUrl
              ? <div className={classes.imgWrap}>
                {fileContactRemove
                  ? <UndoIcon className={classes.clearIcon} onClick={handleClickRemoveContact}/>
                  : <ClearIcon className={classes.clearIcon} onClick={handleClickRemoveContact}/>}
                <img src={user.organization.contactUrl} className={classnames({'disabled': fileContactRemove})}/>
              </div>
              : ''}
          </FormControl>
        </fieldset>*/}


        <FormControl className={classes.formControl}>
          <Typography className={classes.customLabel} component="div">Change Theme Color</Typography>
          <div>
            <SketchPicker
              width={250}
              color={themeColor}
              onChangeComplete={handleChangeColor}
            />
          </div>
        </FormControl>


        <Button variant="contained" color="secondary" className={classes.button}
                disabled={loading}
                onClick={handleSubmit}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>


      </form>


    </Paper>
  );
}

export default withStyles(styles)(OrganizationPaper);