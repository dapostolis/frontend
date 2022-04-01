import React from 'react';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';

const styles = theme => ({
  title: {
    fontWeight: 'bold',
    display: 'inline-block',
    position: 'relative',
    marginBottom: 20,
    paddingBottom: 10,
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: 5,
      left: 0,
      width: '60%',
      borderBottom: '2px solid ' + theme.palette.secondary.main,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '40%',
      borderBottom: '2px solid ' + theme.palette.secondary.main,
    },
  },
});

let HeadingTwoLines = ({children, classes, variant='h4', className}) => (
  <Typography variant={variant} className={classnames(classes.title, className)}>{children}</Typography>
);

export default withStyles(styles)(HeadingTwoLines);