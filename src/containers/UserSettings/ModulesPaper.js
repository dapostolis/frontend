import React from 'react';
import {Paper, Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import HeadingSideLine from 'components/HeadingSideLine';
import classnames from 'classnames';
import {modulesParser} from 'utils/generic';


const styles = theme => ({
  Paper: {
    position: 'relative',
    minHeight: 120,
    padding: theme.spacing.unit * 2,
  },

  tableRoot: {
    width: '100%',
    maxHeight: 412,
    marginTop: theme.spacing.unit * 3,
    marginRight: 10,
    position: 'relative',
    // border: '1px solid ' + theme.palette.primary.light,
    overflowY: 'scroll',

    '&:last-child': {
      marginRight: 0,
    },

    '&.left': {
      width: '90%',
    },
    '&.right': {
      width: '10%',
    },
    border: '1px solid ' + theme.palette.primary.light,
  },
  table: {},
  tHead: {
    backgroundColor: theme.palette.primary.light,
  },
  tRow: {
    height: 46,
  },
  tBodyRow: {
    '&.disabled': {
      opacity: 0.4,
    },
  },

  // CELL
  tCellGeneric: {
    padding: 10,
    cursor: 'default',

    '&:last-child': {
      paddingRight: 0,
    },
  },
  tCellHead: {
    fontSize: 14,
    color: theme.palette.secondary.main,

    '&:hover, &:focus': {
      opacity: '0.7',
    },
  },
});

function ModulesPaper({classes, user}) {
  return (
    <Paper className={classes.Paper}>
      <HeadingSideLine title="Modules"/>

      <div className={classes.tableRoot}>

        <Table className={classes.table}>
          <TableHead className={classes.tHead}>
            <TableRow className={classes.tRow}>
              <TableCell className={classnames(classes.tCellGeneric, classes.tCellHead)}>Module</TableCell>
              <TableCell className={classnames(classes.tCellGeneric, classes.tCellHead)}>Price</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {modulesParser(user.categories).map((row, key) => (
              <TableRow key={key} className={classnames(classes.tBodyRow, {'disabled': !row.enabled})}>
                <TableCell className={classes.tCellGeneric}>{row.name}</TableCell>
                <TableCell className={classes.tCellGeneric}>{row.price ? `${row.price} ${user.currency}` : '-'}</TableCell>
              </TableRow>
            ))}

          </TableBody>

        </Table>

      </div>

    </Paper>
  );
}

export default withStyles(styles)(ModulesPaper);