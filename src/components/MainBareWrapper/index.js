import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Paper} from '@material-ui/core';
import classnames from 'classnames';


const styles = theme => ({
  mainWrap: {
    position: 'relative',
    width: '100%',
    minHeight: 300,
    marginTop: theme.mixins.toolbar.minHeight,
    padding: theme.spacing.unit * 3,
    backgroundColor: 'transparent',
  }
});

function MainBareWrapper({classes, className, children}) {

  return (
    <Paper id="main-bare-wrapper" elevation={0} square={true} className={classnames(classes.mainWrap, className)}>
      {children}
    </Paper>
  )

}

export default withStyles(styles)(MainBareWrapper);