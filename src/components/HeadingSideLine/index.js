import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';
import classnames from 'classnames';


const styles = theme => ({
  h4: {
    fontSize: 14,
    fontWeight: 'bold',
    borderLeft: '3px solid ' + theme.palette.secondary.main,
    paddingLeft: 8,
  },
});

/**
 * Typography Heading using a side line
 *
 * @param classes - material classes prop
 * @param title - the heading title
 * @param {className} - override css
 * @returns {*}
 */
function HeadingSideLine({classes, title, className}) {
  return (
    <Typography variant="h4" color="secondary" className={classnames(classes.h4, className)}>{title}</Typography>
  )
}

export default withStyles(styles)(HeadingSideLine);