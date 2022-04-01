import React, {useEffect, useRef, useState} from 'react';
import {Input} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles/index';
import classnames from 'classnames';


const styles = () => ({
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
 * @param required - if it is required, it uses the default value when user removes text
 * @oaran disabled - disabled field
 * @param multiline - boolean. if we need a textarea field
 * @param forceEmptyValue - boolean. It will force run onBlur method, even if value is empty todo remove it (duplicated business logic because of required field)
 * @param onChange - callback
 * @param onBlur - callback
 * @returns {*}
 * @constructor
 */
function EditInput({classes, css = {}, id, fieldValue, defaultValue = 'xxx', required = false, disabled, multiline = false, forceEmptyValue = false, onChange, onBlur}) {

  const inputEl = useRef();
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      inputEl.current.focus();
      inputEl.current.setSelectionRange(0, fieldValue.length);
    }
  }, [isEditMode]);

  function handleClick(event) {
    // event.preventDefault();
    event.stopPropagation();

    if (disabled) return;
    setIsEditMode(true);
  }

  function isFieldValueEmpty() {
    // reset value if fieldValue is empty
    if (fieldValue.trim() === '') {
      let event = {
        target: {
          id: id,
          value: (required ? defaultValue : ''),
        }
      };
      onChange(event);
      return true;
    }
    return false;
  }

  function handleBlur() {
    if (forceEmptyValue || !isFieldValueEmpty() || !required) {
      if (typeof onBlur === 'function') {
        onBlur();
      }
    }
    setIsEditMode(false);
  }

  function handleKeyUp(event) {
    if (multiline) return;

    if (event.keyCode === 13) { //Enter
      handleBlur();
    }
  }


  return (
    <>
      {isEditMode
        ? <Input
          inputRef={inputEl}
          id={id}
          className={classes.editInput}
          classes={{input: css.control}}
          value={fieldValue}
          onClick={event => event.stopPropagation()}
          onChange={onChange}
          onBlur={handleBlur}
          onKeyUp={handleKeyUp}
          disableUnderline={true}
          multiline={multiline}
        />
        : <div className={classnames(classes.editResult, css.result)} onClick={handleClick}>{fieldValue}</div>
      }
    </>
  );

}

export default withStyles(styles)(EditInput);