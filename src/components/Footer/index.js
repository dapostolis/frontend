import React, {useState} from 'react';
import {Paper, Typography, Link} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import DisclaimerDialog from '../DisclaimerDialog';
import TechnicalInfoDialog from '../TechnicalInfoDialog';
import FaqDialog from '../FaqDialog';
import Authorized from '../Auth/Authorized';


const style = theme => ({
  root: {
    backgroundColor: theme.palette.primary.light
  },
  Paper: {
    zIndex: theme.zIndex.drawer + 1,
    position: 'fixed',
    bottom: 0,
    width: '100%',
    height: 23,
    paddingTop: '2px',

    'body.report &': { // for dyreport public page
      display: 'none',
    },
  },
  content: {
    fontSize: 12,
  },
  LinkPri: {
    color: theme.palette.primary.dark
  },
  LinkSec: {
    cursor: 'pointer',
    color: theme.palette.secondary.main
  },
  inlineWrapper: {
    display: 'flex',
    margin: '0 auto',
    width: 500,
  },
  poweredBy: {
    marginLeft: 5,
  },
});

function Footer({classes}) {
  const [disclaimerDialogOpen, setDisclaimerDialogOpen] = useState(false);
  const [technicalInfoDialogOpen, setTechnicalInfoDialogOpen] = useState(false);
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);

  //DISCLAIMER
  function handleOpenDisclaimerDialog() {
    setDisclaimerDialogOpen(true);
  }

  function handleCloseDisclaimerDialog() {
    setDisclaimerDialogOpen(false);
  }
  //EoDISCLAIMER

  //TECHNICAL_INFO
  function handleOpenTechnicalInfoDialog() {
    setTechnicalInfoDialogOpen(true);
  }

  function handleCloseTechnicalInfoDialog() {
    setTechnicalInfoDialogOpen(false);
  }
  //EoTECHNICAL_INFO

  //FAQ
  function handleOpenFaqDialog() {
   setFaqDialogOpen(true);
  }

  function handleCloseFaqDialog() {
    setFaqDialogOpen(false);
  }

  return (
    <>
      <DisclaimerDialog
        showApproveControls={false}
        open={disclaimerDialogOpen}
        onHandleClose={handleCloseDisclaimerDialog}
        onHandleTermsAgree={() => {
        }}
        onHandleTermsDisagree={() => {
        }}
      />

      <TechnicalInfoDialog
        open={technicalInfoDialogOpen}
        onHandleClose={handleCloseTechnicalInfoDialog}
      />

      <Authorized
        resource="faq:user-component"
        yes={() => <FaqDialog open={faqDialogOpen} onHandleClose={handleCloseFaqDialog}/>}
      />

      <Paper component="footer" className={classes.Paper} classes={{root: classes.root}} square={true}>
        <div className={classes.inlineWrapper}>
          {/*{(new Date().getYear()) + 1900}*/}
          <Typography component="div" className={classes.content}>&copy; {new Date().getFullYear()} wealthium.com
            | <Link className={classes.LinkSec} href="https://wealthium.com" target="_blank" rel="noopener noreferrer">About </Link>
            | <Link color="secondary" className={classes.LinkSec} onClick={handleOpenTechnicalInfoDialog}>Technical Support </Link>
            | <Link color="secondary" className={classes.LinkSec} onClick={handleOpenDisclaimerDialog}>Terms of service </Link>
            | <Link className={classes.LinkSec} href="/">Privacy policy </Link>
            | <Authorized resource="faq:user-component" yes={() => <><Link className={classes.LinkSec} onClick={handleOpenFaqDialog}>FAQ </Link> |</>}/>
           </Typography>

          {/*<Typography component="div" className={classnames(classes.content, classes.poweredBy)}>
            Powered by <Link href="https://www.ubitech.eu"
                             target="_blank"
                             rel="noopener noreferrer"
                             className={classes.LinkPri}>UBITECH</Link>
          </Typography>*/}
        </div>
      </Paper>
    </>
  );
}

export default withStyles(style)(Footer);