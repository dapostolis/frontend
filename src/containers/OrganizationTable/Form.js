import React, {useRef, useEffect, useState} from 'react';
import {Button, FormControl, Input, InputLabel, Select, TextField, Typography} from '@material-ui/core';
import {Clear as ClearIcon, Undo as UndoIcon} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';
import {SketchPicker} from 'react-color';
import FormHelperText from '@material-ui/core/FormHelperText';
import classnames from 'classnames';
import {useSnackbar} from 'notistack';


const MAX_CHARS = 5100;

const styles = theme => ({
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
      maxHeight: 250,
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
    width: 220,
    marginTop: 10,
    padding: 5,
    border: '1px solid ' + theme.palette.primary.main,
    position: 'relative',

    '& > img': {
      maxWidth: 200,
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

function OrganizationForm({classes, loading, lists, fields, user, onHandleSubmit}) {

  const {enqueueSnackbar} = useSnackbar();
  const logoInput = useRef(null);
  const contactInput = useRef(null);

  const [fileSize, setFileSize] = useState({
    contact: {
      delimiter: 'MB',
      denominator: 1000000,
      limit: 2000000,
      value: 0,
    },

    logo: {
      delimiter: 'KB',
      denominator: 1000,
      limit: 500000,
      value: 0,
    }
  });

  const [fileContactRemove, setFileContactRemove] = useState(false);

  const [state, setState] = useState(fields
    ? fields
    : {
      id: '',
      name: '',
      url: '',
      country: '',
      disclaimer: '',
      themeColor: user.organization.themeColor || '#1e88e5',
      logoUrl: '',
      contactUrl: '',
    });

  useEffect(() => {

    if (fields) { // sometimes fields is undefined and we don't want to store it
      setState(fields);
    }

  }, [fields]);


  function handleChange(event) {
    const target = event.target,
      {id, type, value, checked} = target;

    let fieldValue = type === 'checkbox' ? checked : value;

    setState({
      ...state,
      [id]: fieldValue,
    });
  }

  function handleChangeObjectId(event) {
    let target = event.target,
      {id, value} = target;

    setState({
      ...state,
      [id]: value,
    });
  }

  function handleChangeColor(color) {
    setState({
      ...state,
      themeColor: color.hex,
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
      })
    }
  }

  // remove contact image. It is used only on UPDATE method
  function handleClickRemoveContact() {
    setFileContactRemove(!fileContactRemove);
  }

  function handleSubmit() {
    // validation
    if (state.disclaimer.length > MAX_CHARS) {
      enqueueSnackbar('You have exceeded the maximum amount of characters for disclaimer field.', {variant: 'error'});
      return;
    }

    if (fileSize.contact.value > fileSize.contact.limit) {
      enqueueSnackbar(`Contact details file should be lower than ${fileSize.contact.limit/fileSize.contact.denominator}${fileSize.contact.delimiter}. Please use another file`, {variant: 'error'});
      return;
    }

    if (fileSize.logo.value > fileSize.contact.limit) {
      enqueueSnackbar(`Logo details file should be lower than ${fileSize.logo.limit/fileSize.logo.denominator}${fileSize.logo.delimiter}. Please use another file`, {variant: 'error'});
      return;
    }
    // EoValidation

    let payload = Object.assign({}, state);
    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'string') {
        payload[key] = payload[key].trim();
      }
    });

    payload.country = {
      id: payload.country,
    };

    payload.fileContactRemove = fileContactRemove;

    onHandleSubmit(payload, logoInput.current, contactInput.current);
  }

  const {
    id,
    name,
    url,
    country,
    disclaimer,
    themeColor,
    logoUrl,
    contactUrl,
  } = state;

  return (
    <form noValidate autoComplete="off" onSubmit={event => event.preventDefault()}>

      <TextField
        id="name"
        label="Name"
        className={classes.textField}
        value={name}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        id="url"
        label="URL"
        className={classes.textField}
        value={url}
        onChange={handleChange}
        margin="normal"
      />

      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="country">Country</InputLabel>
        <Select
          native
          id="country"
          name="country"
          value={country ? country : ''}
          onChange={handleChangeObjectId}
        >
          <option value=""/>
          {lists.countries.map((c, i) => <option key={i} value={c.id}>{c.name}</option>)}
        </Select>
      </FormControl>

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
        <FormHelperText component="div" className={classnames(classes.helper, {'danger': disclaimer.length > MAX_CHARS})}>
          Characters: {disclaimer.length} / {MAX_CHARS}
        </FormHelperText>
      </FormControl>

      <fieldset className={classes.fieldgroup}>
        <legend><Typography>Contact Details</Typography></legend>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="contact-upload" shrink={true}>{id ? 'Upload new contact details' : 'Upload contact details'}</InputLabel>
          <Input
            inputRef={contactInput}
            id="contact-upload"
            type="file"
            onChange={handleChangeFileSize}
          />
          <FormHelperText component="div" className={classes.helper}>
            <div>Please use images with maximum dimensions 740x1000.</div>
            <div className={classnames({'danger': fileSize.contact.value > fileSize.contact.limit})}>Size limit: {fileSize.contact.value ? fileSize.contact.value/fileSize.contact.denominator : 0}MB / <strong>{fileSize.contact.limit/fileSize.contact.denominator}{fileSize.contact.delimiter}</strong></div>
          </FormHelperText>

          {contactUrl
            ? <div className={classes.imgWrap}>
              {fileContactRemove
                ? <UndoIcon className={classes.clearIcon} onClick={handleClickRemoveContact}/>
                : <ClearIcon className={classes.clearIcon} onClick={handleClickRemoveContact}/>}
              <img src={contactUrl} className={classnames({'disabled': fileContactRemove})}/>
            </div>
            : ''}
        </FormControl>
      </fieldset>

      <fieldset className={classes.fieldgroup}>
        <legend><Typography>Logo</Typography></legend>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="logo-upload" shrink={true}>{id ? 'Upload new logo' : 'Upload logo'}</InputLabel>
          <Input
            inputRef={logoInput}
            id="logo-upload"
            type="file"
            onChange={handleChangeFileSize}
          />
          <FormHelperText component="div" className={classes.helper}>
            <div>Proposed image dimensions: 400x85 (ratio 80:17). </div>
            <div className={classnames({'danger': fileSize.logo.value > fileSize.logo.limit})}>Size limit: {fileSize.logo.value ? fileSize.logo.value/fileSize.logo.denominator : 0}MB / <strong>{fileSize.logo.limit/fileSize.logo.denominator}{fileSize.logo.delimiter}</strong></div>
          </FormHelperText>

          {logoUrl
            ? <div className={classes.imgWrap}>
              <img src={logoUrl}/>
            </div>
            : ''}
        </FormControl>
      </fieldset>

      <FormControl className={classes.formControl}>
        <Typography className={classes.customLabel} component="div">Theme Color</Typography>
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
        Save
      </Button>
    </form>
  )
}

export default withStyles(styles)(OrganizationForm);
