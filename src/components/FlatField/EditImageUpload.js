import React, {useRef, useState} from 'react';
import {Button, Input} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles/index';
import classnames from 'classnames';


const styles = theme => ({
  editImageWrap: {
    textAlign: 'left',
    width: '100%',
    height: 'inherit',
    padding: 10,
    border: '2px dotted ' + theme.palette.secondary.main,
  },
  editResult: {
    cursor: 'pointer',
    fontSize: 'inherit',
    transition: '0.5s ease',

    '&:hover': {
      opacity: 0.5,
    }
  },

  editInput: {
    fontSize: 'inherit',
    padding: 0,
  },

  buttonWrap: {
    marginTop: 20,
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
 * @param css
 * @param id
 * @param fieldValue - the value of field
 * @param defaultValue - if no fieldValue provided, the defaultValue is applied, else 'xxx'
 * @oaran disabled - disabled field
 * @param forceEmptyValue - boolean. It will force run onBlur method, even if value is empty
 * @param onChange - callback
 * @returns {*}
 * @constructor
 */
function EditImageUpload({classes, css = {}, id, fieldValue, defaultValue, disabled, forceEmptyValue = false, onSave}) {

  const inputEl = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);

  function handleClose() {
    setIsEditMode(false);
  }

  function handleClick(event) {
    // event.preventDefault();
    event.stopPropagation();

    if (disabled) return;
    setIsEditMode(true);
  }

  function handleSave() {
    onSave(inputEl.current);
    handleClose();
  }

  const InputImageWrap = () => <div className={classes.editImageWrap}>
    <Input
      inputRef={inputEl}
      type="file"
      id={id}
      className={classes.editInput}
      classes={{input: css.control}}
      onClick={event => event.stopPropagation()}
    />
    <div className={classes.buttonWrap}>
      <Button variant="contained" color="secondary" size="small" className={classes.button} onClick={handleSave}>Save</Button>
      <Button variant="contained" color="secondary" size="small" className={classes.button} onClick={handleClose}>Cancel</Button>
    </div>
  </div>

  return (
    <>
      {isEditMode
        ? <InputImageWrap/>
        : <img src={fieldValue} className={classnames(classes.editResult, css.result)} onClick={handleClick}/>
      }
    </>
  );

}

export default withStyles(styles)(EditImageUpload);