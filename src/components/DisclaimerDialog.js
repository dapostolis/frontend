import React, {useEffect, useLayoutEffect, useRef} from 'react';
import {List, ListItem, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';


const styles = theme => ({
  bodyTitle: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  bodySubtitle: {
    marginTop: 4,
    marginBottom: 0,
  },

  bullets: {
    '& > li:before': {
      content: '""',
      position: 'absolute',
      top: theme.spacing.unit * 2 + 3,
      left: 0,
      width: 5,
      height: 5,
      backgroundColor: theme.palette.secondary.main,
    },
  },
});

const DisclaimerDialog = ({classes, showApproveControls, open, disclaimerActionButtonsDisabled, onHandleClose, onHandleTermsDisagree, onHandleTermsAgree}) => (
  <Dialog
    id="disclaimer-modal"
    open={open}
    onClose={onHandleClose}
  >
    <DialogTitle>Welcome to αlchemist!</DialogTitle>
    <DialogContent id="scroll-area">
      <DialogContentText component="div">
        <p>
          You are about to enter the alchemist platform which is for professional investors.
        </p>
        <p>
          Professional investors (asset or wealth managers, financial planners, investment portfolio managers) are
          authorized by relevant regulators to provide their clients with investment and/or pension advice.
          Any other users such as family offices or high net worth individuals must be considered per se or elective
          professional clients under the rules and guidelines of MiFID.
        </p>

        <div>
          <h4 className={classes.bodyTitle}>Terms of use</h4>
          <div>
            <h5 className={classes.bodySubtitle}>General legal information</h5>
            <List className={classes.bullets}>
              <ListItem>The information and content on this platform is approved for issue by Wealthium Ltd.</ListItem>
              <ListItem>Any forecasts, figures, opinions, statements of financial market trends or investment techniques and strategies expressed are unless otherwise stated our own at the date of the relevant content. They are considered to be reliable, but may not be all-inclusive and their accuracy and any forecasts are not guaranteed. They may be subject to change without reference or notification to you.</ListItem>
              <ListItem>We will try to keep the platform operational at all times. However, we cannot guarantee that the platform or any of the features on it will always be available. We accept no liability for any data transmission errors such as data loss or damage or alteration of any kind.</ListItem>
              <ListItem>Nothing on the platform should be regarded as constituting legal, tax or investment advice.</ListItem>
              <ListItem>All copyright, patent, intellectual and other property in the information contained on the platform is held by us. Rights of copying, reproducing, transmitting, or displaying of results are licensed under the white-labeling agreement.</ListItem>
            </List>
          </div>

          <div>
            <h5 className={classes.bodySubtitle}>Key investment risks</h5>
            <List className={classes.bullets}>
              <ListItem>Both past performance and yield may not be a reliable guide to future performance.</ListItem>
              <ListItem>The value of investments and income from them may fall as well as rise and investors may not get back the full amount invested.</ListItem>
              <ListItem>Estimates of future returns or indications of past performance on the platform are for information purposes and should not be construed as a guarantee of future performance.</ListItem>
              <ListItem>Exchange rate changes may cause the value of underlying overseas investments to go down as well as up.</ListItem>
            </List>
          </div>
        </div>

      </DialogContentText>
    </DialogContent>
    {showApproveControls ?
      <DialogActions>
        <Button onClick={onHandleTermsDisagree} color="secondary" disabled={disclaimerActionButtonsDisabled}>
          Decline
        </Button>
        <Button variant="contained" onClick={onHandleTermsAgree} color="secondary" autoFocus disabled={disclaimerActionButtonsDisabled}>
          Accept
        </Button>
      </DialogActions>
      : ''}

  </Dialog>
);

export default withStyles(styles)(DisclaimerDialog);