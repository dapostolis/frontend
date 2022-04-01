import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Paper} from '@material-ui/core';


const styles = () => ({
  Paper: {
    marginTop: 65,
    width: '25%',
    minWidth: 200,
  },
});

/**
 * SidebarWrapper usually used in a flex-box container
 *
 * @param {classes}
 * @param {children}
 * @param {className} - override css or add new
 * @returns {*}
 */
function SidebarWrapper({classes, children, className, id}) {
  return (
    <Paper square={true} elevation={0} classes={{root: classes.Paper}} id={id} className={className}>
      {children}
    </Paper>
  )
}

export default withStyles(styles)(SidebarWrapper);