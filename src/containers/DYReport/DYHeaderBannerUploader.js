import React, {useRef, useState} from 'react';
import {Button, Input} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles/index';
import classnames from 'classnames';


const styles = theme => ({
  editImageWrap: {
    display: 'flex',
    width: '100%',
    textAlign: 'left',
    // width: '100%',
    // height: 'inherit',
    padding: 10,
    color: 'black',
    backgroundColor: 'white',
    margin: '0 10px',
  },

  editInput: {
    fontSize: 'inherit',
    marginRight: 10,
    padding: 0,
  },

  grow: {
    flexGrow: 1,
  },

  buttonWrap: {
    display: 'flex',
    // marginTop: 20,
  },
  button: {
    marginRight: 10,
  },
});

/**
 * Use this component as a hybrid state between a label and an input field.
 * When the user clicks the label, an input field is shown and the label instantly becomes editable.
 *
 * @param classes
 * @param onHandleCloseUploader
 * @param onSave
 * @returns {*}
 * @constructor
 */
function DYHeaderBannerUploader({classes, canRemoveBanner, onHandleCloseUploader, onHandleRemoveBanner, onSave}) {

  const inputEl = useRef(null);

  function handleCloseUploader() {
    onHandleCloseUploader();
  }

  function handleRemoveBanner() {
    onHandleRemoveBanner();
  }

  function handleSaveBanner() {
    onSave(inputEl.current);
  }

  return (
    <div className={classes.editImageWrap}>
      <Input
        inputRef={inputEl}
        type="file"
        className={classes.editInput}
        onClick={event => event.stopPropagation()}
        // onChange={event => console.log(event)}
      />
      <div className={classes.grow}/>
      <div className={classes.buttonWrap}>
        <Button variant="contained" color="secondary" size="small" className={classes.button} onClick={handleSaveBanner}>Save</Button>
        <Button variant="contained" color="secondary" size="small" className={classes.button} disabled={!canRemoveBanner} onClick={handleRemoveBanner}>Remove Banner</Button>
        <Button variant="contained" color="secondary" size="small" className={classes.button} onClick={onHandleCloseUploader}>Close</Button>
      </div>
    </div>
  );

}

export default withStyles(styles)(DYHeaderBannerUploader);