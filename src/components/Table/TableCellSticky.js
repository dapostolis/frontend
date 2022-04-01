import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {TableCell} from '@material-ui/core';
import classnames from 'classnames';


const styles = () => ({
  tCellHeader: {
    zIndex: 1,
    position: 'sticky',
    top: 0,
    left: 0,
  },
});

function TableCellSticky({classes, children, className, ...props}) {
  return (
    <TableCell className={classnames(classes.tCellHeader, className)} {...props}>{children}</TableCell>
  )
}

export default withStyles(styles)(TableCellSticky);