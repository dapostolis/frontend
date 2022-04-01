import React, {useState} from 'react';
import {Select} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles/index';
import classnames from 'classnames';
import MenuItem from '@material-ui/core/MenuItem/index';


const styles = () => ({
  editResult: {
    cursor: 'pointer',
    fontSize: 'inherit',
    transition: '0.5s ease',

    '&:hover': {
      opacity: 0.5,
    }
  },

  editSelect: {
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
 * @oaran disabled - disabled field
 * @param onChange - callback
 * @param onClose - callback
 * @returns {*}
 * @constructor
 */
function EditSelect({classes, css = {}, id, options, fieldValue, defaultValue = 'xxx', isOpened, disabled, onChange, onClose}) {

  const [isEditMode, setIsEditMode] = useState(false);

  function handleClick(event) {
    event.stopPropagation();

    if (disabled) return;
    setIsEditMode(true);
  }

  function handleClose() {
    if (typeof onClose === 'function') {
      setTimeout(onClose, 500);
    }
    setIsEditMode(false);
  }

  return (
    <>
      {isEditMode
        ? <Select
          open={isOpened}
          inputProps={{
            id: id,
          }}
          // className={classes.editSelect}
          classes={{control: css.control}}
          value={fieldValue}
          onChange={onChange}
          onClose={handleClose}
        >
          {options && Array.isArray(options) && options.map((opt, key) =>
            <MenuItem key={key} value={opt.value}>{opt.label}</MenuItem>
          )}
        </Select>
        : <div className={classnames(classes.editResult, css.result)} onClick={handleClick}>{fieldValue}</div>
      }
    </>
  );

}

export default withStyles(styles)(EditSelect);