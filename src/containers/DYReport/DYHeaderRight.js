import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import EditInput from 'components/FlatField/EditInput';
import {Typography} from '@material-ui/core';


const styles = theme => ({
  dyHeaderRightInner: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.palette.getContrastText('#fff'), // todo - set the dynamic backgroundColor
    display: 'inline',
    position: 'relative',
    minWidth: 20,
    minHeight: 20,
  },

  // edit custom styles
  input: {
    textAlign: 'right',
    minWidth: 20,
    minHeight: 20,
  },

  result: {
    minWidth: 20,
    minHeight: 20,
  }
});

function DYHeaderRight({classes, ...props}) {
  return (
    <Typography component="div" className={classes.dyHeaderRightInner}>
      <EditInput
        css={{
          control: classes.input,
          result: classes.result,
        }}
        {...props}
      />
    </Typography>
  );
}

export default withStyles(styles)(DYHeaderRight);