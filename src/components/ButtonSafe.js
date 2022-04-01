import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';
import {Button} from '@material-ui/core';


const styles = theme => ({
  safeButton: {
    backgroundColor: theme.palette.safe.main,
    color: theme.palette.getContrastText(theme.palette.safe.main),
    '&:hover': {
      backgroundColor: theme.palette.safe.dark,
    },
  },
});

function ButtonSafe({children, classes, className, ...props}) {
  return (
    <Button {...props} className={classnames(classes.safeButton, className)}>
      {children}
    </Button>
  )
}

export default withStyles(styles)(ButtonSafe);