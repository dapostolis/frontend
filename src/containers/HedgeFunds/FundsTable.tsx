import React from 'react';
import {
  createStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Tooltip,
  Typography
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {MoreVert as MoreVertIcon} from "@material-ui/icons";
import classnames from "classnames";
import {IFund} from "./Interface/IHedgeFundOutput";
import {convertNumberToCommas, convertNumberToPercentage} from "utils/generic";
import {TableCellSticky} from "components/Table";


const styles = (theme: Theme) => createStyles({
  tableRoot: {
    width: '100%',
    maxHeight: 374,
    position: 'relative',
    overflowY: 'auto',
    border: '1px solid ' + theme.palette.primary.light,
  },
  tRow: {
    height: 36,
  },
  tBodyRow: {
    borderBottom: '1px solid ' + theme.palette.primary.light,
    '&:last-child': {
      borderBottom: 'medium none',
    },

    '& th, & td': {
      borderBottom: 'medium none',
    },
    
    '&.highlight': {
      backgroundColor: '#e6f5ff',
    },
    '&.highlight > *': {
      fontWeight: 'bold',
    },
  },
  tCell: {
    padding: '4px 7px',

    '&:last-child': {
      textAlign: 'center',
      width: 30,
      paddingRight: 7,
      paddingLeft: 9,
    },
  },
  tCellHeader: {
    fontSize: 14,
    width: '12.5%',
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.light,
  },
  tCellName: {
    width: '30%',
  },


  infoTooltip: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
    // maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
    '& b': {
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
});


interface IProps {
  classes: any;
  funds: Array<IFund>;
  showHighlightRow?: boolean;
  isMethodsTabEnabled: boolean;
  isCombined?: boolean;
}

function FundsTable({classes, funds, showHighlightRow, isMethodsTabEnabled, isCombined}: IProps) {
  return (
    <div className={classes.tableRoot}>

      <Table>
        <TableHead>
          <TableRow className={classes.tRow}>

            <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader, classes.tCellName)}>Name</TableCellSticky>
            <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>Type</TableCellSticky>
            <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>CCY</TableCellSticky>
            <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>Strategy Type</TableCellSticky>

            {isMethodsTabEnabled
              ? <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>YTD</TableCellSticky>
              : <></>
            }

            {!isMethodsTabEnabled && !isCombined
              ? <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>Beta</TableCellSticky>
              : <></>
            }

            {isMethodsTabEnabled ? <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>TER</TableCellSticky> : <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>R2</TableCellSticky>}

            <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>AUM</TableCellSticky>
            <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>More</TableCellSticky>

          </TableRow>
        </TableHead>

        <TableBody>
          {funds && funds.map((row: IFund, key: number) =>
            <TableRow key={key} className={classnames(classes.tBodyRow, {'highlight': showHighlightRow && key === 0})}>

              <TableCell className={classes.tCell}>{row.name}</TableCell>
              <TableCell className={classes.tCell}>{row.type || '-'}</TableCell>
              <TableCell className={classes.tCell}>{row.ccy.toUpperCase()}</TableCell>
              <TableCell className={classes.tCell}>{row.strategyType || '-'}</TableCell>

              {isMethodsTabEnabled
                ? <TableCell className={classes.tCell}>{convertNumberToPercentage(row.ytd)}%</TableCell>
                : <></>}

              {!isMethodsTabEnabled && !isCombined
                ? <TableCell className={classes.tCell}>{Number(row.beta).toFixed(2)}</TableCell>
                : <></>}

              {isMethodsTabEnabled ? <TableCell className={classes.tCell}>{row.ter}%</TableCell> : <TableCell className={classes.tCell}>{convertNumberToPercentage(row.r2)}%</TableCell>}

              <TableCell className={classes.tCell}>{convertNumberToCommas(row.aum)}</TableCell>
              <TableCell className={classes.tCell}>
                <Tooltip
                  interactive
                  title={
                    <>
                      <Typography component="div">
                        <div><strong>Ann. Return</strong>: {convertNumberToPercentage(row.annualisedReturn)}%</div>
                        <div><strong>Ann. Volatility</strong>: {convertNumberToPercentage(row.annualisedVolatility)}%</div>

                        {!isMethodsTabEnabled ?
                          <>
                            <div><strong>YTD</strong>: {convertNumberToPercentage(row.ytd)}%</div>
                            <div><strong>TER</strong>: {row.ter}</div>
                          </>
                          : ''}

                        <div><strong>ISIN</strong>: {row.isin}</div>
                        <div><strong>Instrument Type</strong>: {row.instrumentType}</div>
                        <div><strong>Legal Structure</strong>: {row.legalStructure}</div>
                        <div><strong>Yield</strong>: {row.yield}%</div>
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
  )
}

export default withStyles(styles)(FundsTable);