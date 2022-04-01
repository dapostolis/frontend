import React from 'react';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
  headingWrapper: {
    flex: '0 0 auto',
  },
  h1: {
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
    position: 'relative',
    paddingBottom: 5,
    display: 'inline',

    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '60%',
      borderBottom: '2px solid ' + theme.palette.secondary.main,
    },
  },
  subhead: {
    fontSize: 13,
    color: '#818181',
    marginTop: 15,
  },
});

let HeadingSingleLine = ({children, classes, title, subtitle}) => (
  <div className={classes.headingWrapper}>
    <Typography variant="h1" classes={{h1: classes.h1}}>{title}</Typography>
    {subtitle
      ? <Typography variant="h3" classes={{h3: classes.subhead}}>{subtitle}</Typography>
      : ''}
  </div>
);

export default withStyles(styles)(HeadingSingleLine);