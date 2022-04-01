import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';
import {Button} from '@material-ui/core';


const styles = theme => ({
  dangerButton: {
    backgroundColor: theme.palette.danger.main,
    color: theme.palette.getContrastText(theme.palette.danger.main),
    '&:hover': {
      backgroundColor: theme.palette.danger.dark,
    },
  },
});

function ButtonDanger({children, classes, className, ...props}) {
  return (
    <Button {...props} className={classnames(classes.dangerButton, className)}>
      {children}
    </Button>
  )
}

export default withStyles(styles)(ButtonDanger);