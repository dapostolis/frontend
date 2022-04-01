import React from 'react';
import {Dialog, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles/index';
import Form from './Form';


const styles = () => ({
  paperScrollPaper: {
    height: 'calc(100% - ' + 96 + 'px)', // todo make 96 dynamic
  }
});

function CreateCustomTopicDialog({classes, isOpened, onToggleCustomTopicInstanceDialog, onHandleCreateCustomTopicInstance}) {

  function handleClose() {
    onToggleCustomTopicInstanceDialog();
  }

  return (
    <Dialog fullWidth maxWidth="md" classes={{paperScrollPaper: classes.paperScrollPaper}} open={isOpened} onClose={handleClose}>

      <DialogTitle>Create your Topic</DialogTitle>

      <DialogContent>
        <DialogContentText component="div">
          Please fill out the form below.
        </DialogContentText>

        <Form
          onHandleDialogClose={handleClose}
          onHandleCreateCustomTopicInstance={onHandleCreateCustomTopicInstance}
        />

      </DialogContent>
    </Dialog>
  )
}

export default withStyles(styles)(CreateCustomTopicDialog);