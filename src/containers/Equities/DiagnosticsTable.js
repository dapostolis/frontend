import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography} from '@material-ui/core';
import HeadingSideLine from 'components/HeadingSideLine';
import Loader from 'components/LoaderCircle';
import STATIC_LISTS from './static_lists';
import {convertNumberToCommas} from 'utils/generic';
import {MoreVert as MoreVertIcon} from '@material-ui/icons';
import {TableCellSticky} from 'components/Table';


const styles = theme => ({
  noresults: {
    marginTop: 10,
  },

  tableRoot: {
    width: '100%',
    maxHeight: 320,
    marginTop: theme.spacing.unit * 3,
    position: 'relative',
    border: '1px solid ' + theme.palette.primary.light,
    overflowY: 'scroll',
  },
  table: {
    minWidth: 500,
  },
  tRow: {
    height: 36,
  },
  tCell: {
    fontSize: 14,
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.light,

    '&:last-child': {
      textAlign: 'center',
      width: 30,
      paddingRight: 12,
      paddingLeft: 9,
    },
  },
  tCellMore: {
    textAlign: 'center',
    color: theme.palette.primary.dark,
    width: 30,
    paddingLeft: 9,

    '&:last-child': {
      paddingRight: 12,
    },
  },
  bullet: {
    position: 'relative',
    paddingLeft: 10,
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 'calc(50% - 2px)',
      left: 1,
      width: 4,
      height: 4,
      backgroundColor: theme.palette.secondary.main,
    },
  },

  infoTooltip: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
    '& b': {
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
});

function DiagnosticsTable({classes, loading, stocks}) {
  return (
    <>
      <HeadingSideLine title="Suggested Names"/>

      <Loader className={loading.className} size="small" start={loading.state}/>

      {!loading.state && stocks.length > 0 ?
        <div className={classes.tableRoot}>

          <Table className={classes.table}>
            <TableHead>
              <TableRow className={classes.tRow}>

                <TableCellSticky className={classes.tCell}>Name</TableCellSticky>
                <TableCellSticky className={classes.tCell}>Region</TableCellSticky>
                <TableCellSticky className={classes.tCell}>Sector</TableCellSticky>
                <TableCellSticky className={classes.tCell}>Sub-sector</TableCellSticky>
                <TableCellSticky className={classes.tCell}>Market Cap</TableCellSticky>
                <TableCellSticky className={classes.tCell}>More</TableCellSticky>

              </TableRow>
            </TableHead>

            <TableBody>
              {stocks && stocks.map((stock, key) =>
                <TableRow key={key}>
                  <TableCell component="th" scope="row">{stock.name}</TableCell>
                  <TableCell>{STATIC_LISTS.regionsDict[stock.region]}</TableCell>
                  <TableCell>{stock.sector}</TableCell>
                  <TableCell>{stock.sub_sector}</TableCell>
                  <TableCell>{stock.marketCap ? convertNumberToCommas(window.Number(stock.marketCap)) : '-'}</TableCell>
                  <TableCell className={classes.tCellMore}>
                    <Tooltip
                      title={
                        <>
                          <Typography component="div">
                            {stock.fields.map(sf => {
                              if (sf.value === null) {
                                return <div className={classes.bullet}>{sf.field}: -</div>
                              }
                              return <div className={classes.bullet}>{sf.field}: {window.Number(sf.type === '%' ? (sf.value*100) : sf.value).toFixed(2)} {sf.type || ''}</div>
                            })}
                          </Typography>
                        </>
                      }
                      classes={{tooltip: classes.infoTooltip}}
                    >
                      <MoreVertIcon/>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>

        </div>
        : ''
      }

      {!loading.state && stocks.length === 0 ? <Typography className={classes.noresults}>No results.</Typography> : ''}
    </>
  )
}

export default withStyles(styles)(DiagnosticsTable)
