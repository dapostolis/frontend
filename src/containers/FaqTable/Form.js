import React, {useRef, useEffect, useState} from 'react';
import {Button, FormControl, Input, InputLabel, Select, TextField, Typography} from '@material-ui/core';
import {Clear as ClearIcon, Undo as UndoIcon} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';
import {SketchPicker} from 'react-color';
import FormHelperText from '@material-ui/core/FormHelperText';
import classnames from 'classnames';
import {useSnackbar} from 'notistack';


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

function OrganizationForm({classes, loading, lists, fields, onHandleSubmit}) {

  const {enqueueSnackbar} = useSnackbar();

  const [state, setState] = useState(fields
    ? fields
    : {
      id: '',
      title: '',
      description: '',
      category: ''
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

  function handleSubmit() {
    // validation

    if (state.title === "") {
      enqueueSnackbar(`Title is required.`, {variant: 'error'});
      return;
    }

    if (state.description === "") {
      enqueueSnackbar(`Description is required.`, {variant: 'error'});
      return;
    }

    if (state.category === "") {
      enqueueSnackbar(`Category is required.`, {variant: 'error'});
      return;
    }

    // EoValidation

    let payload = Object.assign({}, state);
    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'string') {
        payload[key] = payload[key].trim();
      }
    });

    onHandleSubmit(payload);
  }

  const {
    id,
    title,
    description,
    category,
  } = state;

  return (
    <form noValidate autoComplete="off" onSubmit={event => event.preventDefault()}>

      <TextField
        id="title"
        label="title"
        className={classes.textField}
        value={title}
        onChange={handleChange}
        margin="normal"
      />

      <FormControl className={classes.formControl}>
          <InputLabel htmlFor="description">Description</InputLabel>
          <Input
            multiline
            id="description"
            name="description"
            className={classes.inputMultiline}
            value={description}
            onChange={handleChange}
          />
        </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="category">Category</InputLabel>
        <Select
          native
          id="category"
          name="category"
          value={category ? category : ''}
          onChange={handleChangeObjectId}
        >
          <option value=""/>
          {lists.categories.map((c, i) => <option key={i} value={c.name}>{c.friendlyName}</option>)}
        </Select>
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
