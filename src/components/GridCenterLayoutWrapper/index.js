import React from 'react';
import {withStyles} from '@material-ui/core/styles';


const styles = theme => ({
  layout: {
    width: 'auto',
    marginTop: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    // marginBottom: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit * 3,
    [theme.breakpoints.up(1400 + theme.spacing.unit * 3 * 2)]: {
      maxWidth: 1400,
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
});


function GridCenterLayoutWrapper({classes, children}) {
  return (
    <div className={classes.layout}>
      {children}
    </div>
  )
}

export default withStyles(styles)(GridCenterLayoutWrapper);