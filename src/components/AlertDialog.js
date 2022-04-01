import React, {useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

/**
 *
 * @param isOpened | boolean
 * @param title | Dialog title
 * @param description | Dialog description
 * @param label | label
 * @param negative | label for the negative button
 * @param positive | label for the positive button
 * @param yes | callback function that is executed when user selects the positive button
 * @param onHandleClose | function if we want to execute extra code on dialog close
 * @returns {*}
 */
function AlertDialog({
                       isOpened,
                       title = 'Please Confirm',
                       description = 'Are you absolutely sure to delete this item?',
                       label,
                       yes,
                       onHandleClose
                     }) {

  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    setOpen(isOpened ? true : false);
  }, [isOpened])


  function handleYes() {
    if (typeof yes === 'function') {
      yes();
    }
    handleClose();
  }

  function handleClose() {
    setOpen(false);

    if (typeof onHandleClose === 'function') {
      onHandleClose();
    }
  }

  // Rendering
  let negative = 'No', positive = 'Yes';
  if (label) {
    if (label.negative) negative = label.negative;
    if (label.positive) positive = label.positive;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          {negative}
        </Button>
        <Button onClick={handleYes} color="secondary" autoFocus>
          {positive}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AlertDialog;