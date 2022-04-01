import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography} from '@material-ui/core';
import {ExpandMore as ExpandMoreIcon} from '@material-ui/icons';
import {convertStringToMachineName} from '../../utils/generic';

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    color: '#8e8d8e',
    flexBasis: '90%',
    flexShrink: 0,
    fontWeight: 'bold',
  },
  // secondaryHeading: {
  //   fontSize: theme.typography.pxToRem(15),
  //   color: theme.palette.text.secondary,
  // },
  ExpansionPanel: {
    boxShadow: 'none',
    border: '1px solid ' + theme.palette.primary.light,
  },
  ExpansionPanelSummary: {
    paddingLeft: theme.spacing.unit * 2,
    backgroundColor: '#fcfcfc',
  },
  ExpansionPanelDetails: {
    padding: 0,
  },
});

function AccordionItem({classes, children, id, title, defaultExpanded}) {
  let mid = null;
  if (id) {
    mid = convertStringToMachineName(id);
  }

  return (
    <ExpansionPanel className={classes.ExpansionPanel} defaultExpanded={defaultExpanded}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon/>}
        aria-controls={mid + '-content'}
        id={mid}
        className={classes.ExpansionPanelSummary}
      >
        <Typography className={classes.heading}>{title}</Typography>
        {/*<Typography className={classes.secondaryHeading}>I am an expansion panel</Typography>*/}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.ExpansionPanelDetails}>
        {children}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default withStyles(styles)(AccordionItem);