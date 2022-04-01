import React from 'react';
import {
  createStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Typography
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import classnames from "classnames";
import {convertNumberToPercentage} from "utils/generic";
import {TableCellSticky} from "components/Table";
import Loader from 'components/LoaderCircle';
import HeadingSideLine from 'components/HeadingSideLine';
import {IStrategyMethods} from "./Interface/IHedgeFundOutput";


const styles = (theme: Theme) => createStyles({
  title: {
    marginBottom: 10,
  },

  noresults: {
    marginTop: 10,
  },

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
    height: 40,
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
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 10,
  },
  tCellHeader: {
    fontSize: 14,
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.light,
  },
  tCellRightBorder: {
    borderRight: '1px solid ' + theme.palette.primary.light,
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
  loading: {[key: string]: any};
  strategyParams: IStrategyMethods | null;
}

function StrategyTable({classes, loading, strategyParams}: IProps) {
  return (
    <>
      <Loader className={loading.className} size="small" start={loading.state}/>

      <HeadingSideLine title="Summary Statistics" className={classes.title}/>

      {strategyParams !== null ?
        <div className={classes.tableRoot}>

          <Table>
            <TableHead>
              <TableRow className={classes.tRow}>

                <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)} colSpan={2} align="center">Strategy</TableCellSticky>
                <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)} align="center">Ann. Return</TableCellSticky>
                <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)} align="center">Ann. Volatility</TableCellSticky>
                <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)} align="center">Sharpe Ratio</TableCellSticky>
                <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)} align="center">YTD</TableCellSticky>

              </TableRow>
            </TableHead>

            <TableBody>
              {/*Momentum*/}
              {strategyParams.mom ?
                <>
                  <TableRow className={classnames(classes.tBodyRow)}>
                    <TableCell rowSpan={2} className={classnames(classes.tCell, classes.tCellRightBorder)}>Momentum</TableCell>

                    <TableCell className={classnames(classes.tCell, classes.tCellRightBorder)}>Backtesting Strategy</TableCell>

                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.mom.bt.annualisedReturn)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.mom.bt.annualisedVolatility)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{Number(strategyParams.mom.bt.sharpe).toFixed(2) || '-'}</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.mom.bt.ytd)}%</TableCell>
                  </TableRow>

                  <TableRow className={classnames(classes.tBodyRow)}>
                    <TableCell className={classnames(classes.tCell, classes.tCellRightBorder)}>Suggested Portfolio</TableCell>

                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.mom.sg.annualisedReturn)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.mom.sg.annualisedVolatility)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{Number(strategyParams.mom.sg.sharpe).toFixed(2) || '-'}</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.mom.sg.ytd)}%</TableCell>
                  </TableRow>
                </>
                : <></>}

              {/*Mean Reversion*/}
              {strategyParams.meanRev ?
                <>
                  <TableRow className={classnames(classes.tBodyRow)}>
                    <TableCell rowSpan={2} className={classnames(classes.tCell, classes.tCellRightBorder)}>Mean Reversion</TableCell>

                    <TableCell className={classnames(classes.tCell, classes.tCellRightBorder)}>Backtesting Strategy</TableCell>

                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.meanRev.bt.annualisedReturn)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.meanRev.bt.annualisedVolatility)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{Number(strategyParams.meanRev.bt.sharpe).toFixed(2) || '-'}</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.meanRev.bt.ytd)}%</TableCell>
                  </TableRow>

                  <TableRow className={classnames(classes.tBodyRow)}>
                    <TableCell className={classnames(classes.tCell, classes.tCellRightBorder)}>Suggested Portfolio</TableCell>

                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.meanRev.sg.annualisedReturn)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.meanRev.sg.annualisedVolatility)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{Number(strategyParams.meanRev.sg.sharpe).toFixed(2) || '-'}</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.meanRev.sg.ytd)}%</TableCell>
                  </TableRow>
                </>
                : <></>}

              {/*Min Vol*/}
              {strategyParams.minVol ?
                <>
                  <TableRow className={classnames(classes.tBodyRow)}>
                    <TableCell rowSpan={2} className={classnames(classes.tCell, classes.tCellRightBorder)}>Min Vol</TableCell>

                    <TableCell className={classnames(classes.tCell, classes.tCellRightBorder)}>Backtesting Strategy</TableCell>

                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.minVol.bt.annualisedReturn)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.minVol.bt.annualisedVolatility)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{Number(strategyParams.minVol.bt.sharpe).toFixed(2) || '-'}</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.minVol.bt.ytd)}%</TableCell>
                  </TableRow>

                  <TableRow className={classnames(classes.tBodyRow)}>
                    <TableCell className={classnames(classes.tCell, classes.tCellRightBorder)}>Suggested Portfolio</TableCell>

                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.minVol.sg.annualisedReturn)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.minVol.sg.annualisedVolatility)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{Number(strategyParams.minVol.sg.sharpe).toFixed(2) || '-'}</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.minVol.sg.ytd)}%</TableCell>
                  </TableRow>
                </>
                : <></>}

              {/*Sharpe*/}
              {strategyParams.sharpe ?
                <>
                  <TableRow className={classnames(classes.tBodyRow)}>
                    <TableCell rowSpan={2} className={classnames(classes.tCell, classes.tCellRightBorder)}>Sharpe</TableCell>

                    <TableCell className={classnames(classes.tCell, classes.tCellRightBorder)}>Backtesting Strategy</TableCell>

                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.sharpe.bt.annualisedReturn)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.sharpe.bt.annualisedVolatility)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{Number(strategyParams.sharpe.bt.sharpe).toFixed(2) || '-'}</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.sharpe.bt.ytd)}%</TableCell>
                  </TableRow>

                  <TableRow className={classnames(classes.tBodyRow)}>
                    <TableCell className={classnames(classes.tCell, classes.tCellRightBorder)}>Suggested Portfolio</TableCell>

                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.sharpe.sg.annualisedReturn)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.sharpe.sg.annualisedVolatility)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{Number(strategyParams.sharpe.sg.sharpe).toFixed(2) || '-'}</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.sharpe.sg.ytd)}%</TableCell>
                  </TableRow>
                </>
                : <></>}

              {/*Efficient Frontier*/}
              {strategyParams.al ?
                <>
                  <TableRow className={classnames(classes.tBodyRow)}>
                    <TableCell rowSpan={2} className={classnames(classes.tCell, classes.tCellRightBorder)}>Efficient Frontier</TableCell>

                    <TableCell className={classnames(classes.tCell, classes.tCellRightBorder)}>Backtesting Strategy</TableCell>

                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.al.bt.annualisedReturn)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.al.bt.annualisedVolatility)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{Number(strategyParams.al.bt.sharpe).toFixed(2) || '-'}</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.al.bt.ytd)}%</TableCell>
                  </TableRow>

                  <TableRow className={classnames(classes.tBodyRow)}>
                    <TableCell className={classnames(classes.tCell, classes.tCellRightBorder)}>Suggested Portfolio</TableCell>

                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.al.sg.annualisedReturn)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.al.sg.annualisedVolatility)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{Number(strategyParams.al.sg.sharpe).toFixed(2) || '-'}</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.al.sg.ytd)}%</TableCell>
                  </TableRow>
                </>
                : <></>}

              {/*Benchmark*/}
              {strategyParams.bench ?
                <>
                  <TableRow className={classnames(classes.tBodyRow)}>
                    <TableCell className={classnames(classes.tCell, classes.tCellRightBorder)}>User-defined Benchmark</TableCell>

                    <TableCell className={classnames(classes.tCell, classes.tCellRightBorder)}>Buy & Hold</TableCell>

                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.bench.bt.annualisedReturn)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.bench.bt.annualisedVolatility)}%</TableCell>
                    <TableCell className={classes.tCell} align="center">{Number(strategyParams.bench.bt.sharpe).toFixed(2) || '-'}</TableCell>
                    <TableCell className={classes.tCell} align="center">{convertNumberToPercentage(strategyParams.bench.bt.ytd)}%</TableCell>
                  </TableRow>
                </>
                : <></>}

            </TableBody>

          </Table>

        </div>
        : ''}

      {!loading.state && !strategyParams ?
        <Typography className={classes.noresults}>No results.</Typography> : ''}

    </>
  )
}

export default withStyles(styles)(StrategyTable);