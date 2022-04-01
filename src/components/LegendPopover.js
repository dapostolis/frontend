import React from 'react';
import {Popover, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles/index';


const styles = theme => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing.unit,
  },
});

function LegendPopover({children, classes, id, anchorEl, onClose}) {

  const open = Boolean(anchorEl);

  return (
    <Popover
      id={id}
      className={classes.popover}
      classes={{
        paper: classes.paper,
      }}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={onClose}
      disableRestoreFocus
    >
      <Typography>
        <strong>Sub-Strategies</strong><br/>
        {children}
      </Typography>
    </Popover>
  )
}

export default withStyles(styles)(LegendPopover);