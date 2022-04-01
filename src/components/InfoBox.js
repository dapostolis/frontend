import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';
import {Typography} from '@material-ui/core';


const styles = theme => ({
  infoBox: {
    fontSize: '0.8125rem',
    padding: theme.spacing.unit,
    borderRadius: 3,

    '&.info': {
      color: theme.palette.getContrastText(theme.palette.info.light),
      backgroundColor: theme.palette.info.light,
    },
    '&.neutral': {
      color: theme.palette.getContrastText(theme.palette.primary.light),
      backgroundColor: theme.palette.primary.light,
    },
    '&.safe': {
      color: theme.palette.getContrastText(theme.palette.safe.light),
      backgroundColor: theme.palette.safe.light,
    },
    '&.warning': {
      color: theme.palette.getContrastText(theme.palette.warning.light),
      backgroundColor: theme.palette.warning.light,
    },
    '&.danger': {
      color: theme.palette.getContrastText(theme.palette.danger.light),
      backgroundColor: theme.palette.danger.light,
    },
  },
});

function InfoBox({classes, children, className, type = 'info', show}) {
  if (!show) {
    return '';
  }

  return <Typography className={classnames(classes.infoBox, type, className)}>{children}</Typography>;
}

export default withStyles(styles)(InfoBox);