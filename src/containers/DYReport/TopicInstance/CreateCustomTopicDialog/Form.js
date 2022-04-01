import React, {useRef, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack';
import {Button, FormControl, Input, InputAdornment, InputLabel, Typography} from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';
import classnames from 'classnames';


const MAX_CHARS = 475;

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

function Form({classes, onHandleDialogClose, onHandleCreateCustomTopicInstance}) {
  const {enqueueSnackbar} = useSnackbar();

  const topicImageEl = useRef(null);

  const [fileSize, setFileSize] = useState({
    topicImage: {
      delimiter: 'KB',
      denominator: 1000,
      limit: 500000,
      value: 0,
    }
  });

  const [customTopicInstance, setCustomTopicInstance] = useState({
    id: 'null',
    title: '',
    text: '',
  });


  function handleChange(event) {
    const {id, value} = event.target;

    setCustomTopicInstance({
      ...customTopicInstance,
      [id]: value,
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

  function handleSubmit() {
    //Validation
    if (fileSize.topicImage.value > fileSize.topicImage.limit) {
      enqueueSnackbar(`Topic image should be lower than ${fileSize.topicImage.limit/fileSize.topicImage.denominator}${fileSize.topicImage.delimiter}. Please use another file`, {variant: 'error'});
      return;
    }
    //EoValidation

    let cti = {
      id: 'null',
      title: customTopicInstance.title || 'Topic Title',
      text: customTopicInstance.text || 'Add some text...',
    };

    onHandleCreateCustomTopicInstance(cti, topicImageEl.current);
    onHandleDialogClose();

  }

  const {id, title, text, topicImage} = customTopicInstance;

  return (
    <form autoComplete="off">
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="title">Title</InputLabel>
        <Input
          id="title"
          name="title"
          value={title}
          inputProps={{
            'aria-label': 'title',
          }}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="text">Topic Text (Multiline text)</InputLabel>
        <Input
          multiline
          id="text"
          name="text"
          className={classes.inputMultiline}
          value={text}
          onChange={handleChange}
        />
        <FormHelperText component="div" className={classnames(classes.helper, {'danger': text.length > MAX_CHARS})}>
          Proposed characters limit: {text.length} / {MAX_CHARS}
        </FormHelperText>
      </FormControl>

      <fieldset className={classes.fieldgroup}>
        <legend><Typography>Topic Image</Typography></legend>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="topicImage-upload" shrink={true}>{id !== 'null' ? 'Upload new Topic Image' : 'Upload Topic Image'}</InputLabel>
          <Input
            inputRef={topicImageEl}
            id="topicImage-upload"
            type="file"
            onChange={handleChangeFileSize}
          />
          <FormHelperText component="div" className={classes.helper}>
            <div>Proposed image dimensions: 340x230. </div>
            <div className={classnames({'danger': fileSize.topicImage.value > fileSize.topicImage.limit})}>Size limit: {fileSize.topicImage.value ? fileSize.topicImage.value/fileSize.topicImage.denominator : 0}{fileSize.topicImage.delimiter} / <strong>{fileSize.topicImage.limit/fileSize.topicImage.denominator}{fileSize.topicImage.delimiter}</strong></div>
          </FormHelperText>

          {topicImage
            ? <div className={classes.imgWrap}>
              <img src={topicImage} alt="topic-image"/>
            </div>
            : ''}
        </FormControl>
      </fieldset>

      <Button variant="contained" color="secondary" className={classes.button} onClick={handleSubmit}>
        Import Topic
      </Button>
    </form>
  )
}

export default withStyles(styles)(Form);