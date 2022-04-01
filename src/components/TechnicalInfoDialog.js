import React from 'react';
import {Link} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';


const TechnicalInfoDialog = ({open, onHandleClose}) => (
  <Dialog
    id="technical-info-modal"
    open={open}
    onClose={onHandleClose}
  >
    <DialogTitle>Technical Support Information</DialogTitle>
    <DialogContent id="scroll-area">
      <DialogContentText component="div">
        <p>tel: <Link color="secondary" href="tel:+44 2034880901">+44 2034880901</Link></p>
        <p>email: <Link color="secondary" href="mailto:alchemist@wealthium.com">alchemist@wealthium.com</Link></p>
      </DialogContentText>
    </DialogContent>
  </Dialog>
);

export default TechnicalInfoDialog;