import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import EditInput from 'components/FlatField/EditInput';
import {Typography} from '@material-ui/core';


const styles = theme => ({
  dyHeaderRightInner: {
    fontSize: 14,
    fontWeight: 'bold',
    // color: theme.palette.getContrastText(theme.palette.secondary.main),
    color: theme.palette.getContrastText('#fff'), // todo - set the dynamic backgroundColor
    display: 'inline',
    position: 'relative',
  },

  // edit custom styles
  input: {
    textAlign: 'right',
  },
});

function DYHeaderRight({classes, ...props}) {
  return (
    <Typography component="div" className={classes.dyHeaderRightInner}>
      {props.fieldValue}
    </Typography>
  );
}

export default withStyles(styles)(DYHeaderRight);