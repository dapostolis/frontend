/**
 * Generic pagination
 */

import React from 'react';
import {ListItem, ListItemIcon, Paper} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import {ChevronLeft, ChevronRight, FirstPage, LastPage} from '@material-ui/icons';


const styles = theme => ({
  paperOv: {
    width: 'auto',
    display: 'inline-flex',
    marginRight: theme.spacing.unit * 3,
    border: '1px solid ' + theme.palette.primary.main,
    borderRadius: 8,
  },

  item: {
    textAlign: 'center',
    // paddingRight: 0,
    padding: 0,
    paddingTop: 2,
    paddingBottom: 3,
    paddingLeft: theme.spacing.unit * 2,
    borderRight: '1px solid ' + theme.palette.primary.main,
    '&:last-child': {
      borderRight: 'medium none',
    }
  },
  icons: {
    fontSize: 28
  }
});

function Pager({
                 classes,
                 marginClass,
                 count,
                 page,
                 rowsPerPage,
                 onChangePage
               }) {

  const handleFirstPageButtonClick = () => {
    onChangePage(0);
  };

  const handleBackButtonClick = () => {
    onChangePage(page - 1);
  };

  const handleNextButtonClick = () => {
    onChangePage(page + 1);
  };

  const handleLastPageButtonClick = () => {
    onChangePage(count - 1);
  };

  return (
    <div className={classes.paperOv}>

      <ListItem
        button
        disabled={page === 0}
        className={classes.item}
        onClick={handleFirstPageButtonClick}
      >
        <ListItemIcon><FirstPage className={classes.icons}/></ListItemIcon>
      </ListItem>

      <ListItem
        button
        disabled={page === 0}
        className={classes.item}
        onClick={handleBackButtonClick}
      >
        <ListItemIcon><ChevronLeft className={classes.icons}/></ListItemIcon>
      </ListItem>

      <ListItem
        button
        disabled={page >= count-1}
        className={classes.item}
        onClick={handleNextButtonClick}
      >
        <ListItemIcon><ChevronRight className={classes.icons}/></ListItemIcon>
      </ListItem>

      <ListItem
        button
        disabled={page >= count-1}
        className={classes.item}
        onClick={handleLastPageButtonClick}
      >
        <ListItemIcon><LastPage className={classes.icons}/></ListItemIcon>
      </ListItem>

    </div>
  )
}

export default withStyles(styles)(Pager);