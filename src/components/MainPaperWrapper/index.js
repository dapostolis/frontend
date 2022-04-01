import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Paper} from '@material-ui/core';


const styles = theme => ({
  mainWrap: {
    position: 'relative',
    width: 'calc(100% - 40px)',
    minHeight: 300,
    margin: 20,
    marginTop: theme.mixins.toolbar.minHeight + 29,
    padding: theme.spacing.unit * 3,
  }
});

function MainPaperWrapper({classes, children}) {

  return (
    <Paper className={classes.mainWrap}>
      {children}
    </Paper>
  )

}

export default withStyles(styles)(MainPaperWrapper);