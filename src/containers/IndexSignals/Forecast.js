import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography} from '@material-ui/core';
import {Info as InfoIcon} from '@material-ui/icons';
import classnames from 'classnames';
import TrendingFlat from 'assets/images/trendingflat.png';
import TrendingUp from 'assets/images/trendingup.png';
import TrendingDown from 'assets/images/trendingdown.png';
import HeadingSideLine from 'components/HeadingSideLine';
import Loader from 'components/LoaderCircle';
import InfoBox from 'components/InfoBox';


const styles = theme => ({
  infoBox: {
    marginTop: 20,
  },

  tableRoot: {
    width: '100%',
    maxHeight: 320,
    marginTop: theme.spacing.unit * 3,
    marginRight: 10,
    position: 'relative',
    border: '1px solid ' + theme.palette.primary.main,
    overflowY: 'scroll',

    // '&:last-child': {
    //   marginRight: 0,
    // },
  },
  table: {},
  tHead: {
    backgroundColor: theme.palette.primary.light,
  },
  tRow: {
    height: 46,
    borderBottom: '1px solid ' + theme.palette.primary.main,
  },
  tBodyRow: {
    borderBottom: '1px solid ' + theme.palette.primary.main,
    '&:last-child': {
      border: 'medium none',
    },
  },

  tCell: {
    borderBottom: 'medium none',
    padding: 10,
  },
  tCellHead: {
    fontSize: 14,
    color: theme.palette.secondary.main,
  },
  tCellHeadFirst: {
    width: 200,
    backgroundColor: theme.palette.primary.light,
  },

  icon: {
    width: 20,
    height: 'auto',
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: 5,
  },

  forecastText: {
    display: 'inline-block',
    verticalAlign: 'middle',
  },

  noresults: {
    marginTop: 10,
  },

  flexCellInner: {
    display: 'flex',
    alignItems: 'center',
  },
  infoIcon: {
    cursor: 'pointer',
    marginRight: 7,
  },

  tooltipTypo: {
    color: 'white',
  },
});

function Forecast({classes, loading, isReadyToReceiveData, assetClass, signal}) {

  // Asset Allocation
  let TrendingIcon = TrendingFlat,
    trendingText = 'Neutral',
    assetAllocPercentage = 0;

  /*if (signal.value <= 1 && signal.value >= 0.8) {
    assetAllocPercentage = 1.0;
  } else if (signal.value >= 0.6 && signal.value < 0.799) {
    assetAllocPercentage = 0.9;
  } else if (signal.value >= 0.4 && signal.value < 0.599) {
    assetAllocPercentage = 0.8;
  } else if (signal.value >= 0.2 && signal.value < 0.399) {
    assetAllocPercentage = 0.7;
  } else if (signal.value >= 0.05 && signal.value < 0.199) {
    assetAllocPercentage = 0.6;
  } else if (signal.value >= -0.0499 && signal.value < 0.0499) {
    assetAllocPercentage = 0.5;
  } else if (signal.value >= -0.2 && signal.value < -0.05) {
    assetAllocPercentage = 0.4;
  } else if (signal.value >= -0.4 && signal.value < -0.201) {
    assetAllocPercentage = 0.3;
  } else if (signal.value >= -0.6 && signal.value < -0.401) {
    assetAllocPercentage = 0.2;
  } else if (signal.value >= -0.8 && signal.value < -0.601) {
    assetAllocPercentage = 0.1;
  } else if (signal.value >= -1 && signal.value < -0.801) {
    assetAllocPercentage = 0.0;
  }*/

  if (signal.value <= 1 && signal.value >= 0.8) {
    assetAllocPercentage = 100;
  } else if (signal.value < 0.8 && signal.value >= 0.6) {
    assetAllocPercentage = 90;
  } else if (signal.value < 0.6 && signal.value >= 0.4) {
    assetAllocPercentage = 80;
  } else if (signal.value < 0.4 && signal.value >= 0.2) {
    assetAllocPercentage = 70;
  } else if (signal.value < 0.2 && signal.value >= 0.05) {
    assetAllocPercentage = 60;

  } else if (signal.value < 0.05 && signal.value >= -0.05) {
    assetAllocPercentage = 50;

  } else if (signal.value < -0.05 && signal.value >= -0.2) {
    assetAllocPercentage = 40;
  } else if (signal.value < -0.2 && signal.value >= -0.4) {
    assetAllocPercentage = 30;
  } else if (signal.value < -0.4 && signal.value >= -0.6) {
    assetAllocPercentage = 20;
  } else if (signal.value < -0.6 && signal.value >= -0.8) {
    assetAllocPercentage = 10;
  } else if (signal.value < -0.8 && signal.value >= -1) {
    assetAllocPercentage = 0;
  }

  if (assetAllocPercentage < 50) {
    TrendingIcon = TrendingDown;
    trendingText = 'Underweight';
  } else if (assetAllocPercentage > 50) {
    TrendingIcon = TrendingUp;
    trendingText = 'Overweight';
  }

  return (

    <>
      <HeadingSideLine title="Proposed Actions and Metrics"/>

      <Loader className={loading.className} size="small" start={loading.state}/>

      <InfoBox className={classes.infoBox} show={!loading.state && signal.value !== null && signal.metrics}>
        Results for asset class <strong>{assetClass}</strong> and strategy <strong>{signal.name}</strong>
      </InfoBox>

      {!loading.state && signal.value !== null && signal.metrics ?
        <div className={classes.tableRoot}>

          <Table className={classes.table}>
            <TableHead className={classes.tHead}>
              <TableRow className={classes.tRow}>

                <TableCell className={classnames(classes.tCell, classes.tCellHead, classes.tCellHeadFirst)}></TableCell>

                <TableCell className={classnames(classes.tCell, classes.tCellHead)}>Forecast</TableCell>

                <TableCell className={classnames(classes.tCell, classes.tCellHead)}>Market Participation</TableCell>

                <TableCell className={classnames(classes.tCell, classes.tCellHead)}>Allocation Weight</TableCell>

                <TableCell className={classnames(classes.tCell, classes.tCellHead)}>Ann. Return</TableCell>

                <TableCell className={classnames(classes.tCell, classes.tCellHead)}>Ann. Risk</TableCell>

                <TableCell className={classnames(classes.tCell, classes.tCellHead)}>Sharpe Ratio</TableCell>

              </TableRow>
            </TableHead>

            <TableBody>

              {/*Invested Cash - Absolute Return Framework*/}
              <TableRow className={classes.tBodyRow}>

                <TableCell scope="row" component="th" className={classnames(classes.tCell, classes.tCellHead, classes.tCellHeadFirst)}>
                  <div className={classes.flexCellInner}>
                    <Tooltip placement="bottom" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The portfolio is invested 100% in the selected asset class when the signal is greater than zero. Otherwise, allocation goes to cash</Typography>}>
                      <InfoIcon className={classes.infoIcon}/>
                    </Tooltip>
                    <span>Invested / Cash framework</span>
                  </div>
                </TableCell>

                <TableCell style={{whiteSpace: 'nowrap'}} className={classes.tCell}>
                  {signal.value > 0 ? 'Invested' : 'Cash'}
                </TableCell>

                <TableCell style={{whiteSpace: 'nowrap'}} className={classes.tCell}>
                  {window.Number(signal.metrics.marketParticipationVolatility0*100).toFixed(2)}%
                </TableCell>

                <TableCell style={{whiteSpace: 'nowrap'}} className={classes.tCell}>
                  {signal.value > 0 ? 100 : 0}%
                </TableCell>

                <TableCell style={{whiteSpace: 'nowrap'}} className={classes.tCell}>
                  {window.Number(signal.metrics.annualisedReturn0*100).toFixed(2)}%
                </TableCell>

                <TableCell style={{whiteSpace: 'nowrap'}} className={classes.tCell}>
                  {window.Number(signal.metrics.annualisedVolatility0*100).toFixed(2)}%
                </TableCell>

                <TableCell style={{whiteSpace: 'nowrap'}} className={classes.tCell}>
                  {window.Number(signal.metrics.sharpe0).toFixed(2)}
                </TableCell>

              </TableRow>

              {/*Asset Allocation Framework*/}
              <TableRow className={classes.tBodyRow}>

                <TableCell scope="row" component="th" className={classnames(classes.tCell, classes.tCellHead, classes.tCellHeadFirst)}>
                  <div className={classes.flexCellInner}>
                    <Tooltip placement="bottom" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The allocation weight is a linear function of the signals's value. It goes from 0% to 100% and helps in asset allocation decisions</Typography>}>
                      <InfoIcon className={classes.infoIcon}/>
                    </Tooltip>
                    <span>Asset Allocation framework</span>
                  </div>
                </TableCell>

                <TableCell style={{whiteSpace: 'nowrap'}} className={classes.tCell}>
                  <span className={classes.forecastText}>{trendingText}</span> <img className={classes.icon} src={TrendingIcon} alt="forecast trending icon"/>
                </TableCell>

                <TableCell style={{whiteSpace: 'nowrap'}} className={classes.tCell}>
                  {window.Number(signal.metrics.marketParticipationVolatility50*100).toFixed(2)}%
                </TableCell>

                <TableCell style={{whiteSpace: 'nowrap'}} className={classes.tCell}>
                  {assetAllocPercentage}%
                </TableCell>

                <TableCell style={{whiteSpace: 'nowrap'}} className={classes.tCell}>
                  {window.Number(signal.metrics.annualisedReturn50*100).toFixed(2)}%
                </TableCell>

                <TableCell style={{whiteSpace: 'nowrap'}} className={classes.tCell}>
                  {window.Number(signal.metrics.annualisedVolatility50*100).toFixed(2)}%
                </TableCell>

                <TableCell style={{whiteSpace: 'nowrap'}} className={classes.tCell}>
                  {window.Number(signal.metrics.sharpe50).toFixed(2)}
                </TableCell>

              </TableRow>

              {/*Benchmark*/}
              <TableRow className={classes.tBodyRow}>

                <TableCell scope="row" component="th" className={classnames(classes.tCell, classes.tCellHead, classes.tCellHeadFirst)}>
                  <div className={classes.flexCellInner}>
                    <Tooltip placement="bottom" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The portfolio is 100% invested in the selected asset class</Typography>}>
                      <InfoIcon className={classes.infoIcon}/>
                    </Tooltip>
                    <span>Buy & Hold</span>
                  </div>
                </TableCell>

                <TableCell style={{whiteSpace: 'nowrap'}} className={classes.tCell}>-</TableCell>

                <TableCell style={{whiteSpace: 'nowrap'}} className={classes.tCell}>
                  {/*{window.Number(signal.metrics.marketParticipationBenchmark*100).toFixed(2)}%*/}
                  100%
                </TableCell>

                <TableCell style={{whiteSpace: 'nowrap'}} className={classes.tCell}>-</TableCell>

                <TableCell style={{whiteSpace: 'nowrap'}} className={classes.tCell}>
                  {window.Number(signal.metrics.annualisedReturnBenchmark*100).toFixed(2)}%
                </TableCell>

                <TableCell style={{whiteSpace: 'nowrap'}} className={classes.tCell}>
                  {window.Number(signal.metrics.annualisedVolatilityBenchmark*100).toFixed(2)}%
                </TableCell>

                <TableCell style={{whiteSpace: 'nowrap'}} className={classes.tCell}>
                  {window.Number(signal.metrics.sharpeBenchmark).toFixed(2)}
                </TableCell>

              </TableRow>

            </TableBody>

          </Table>

        </div> : ''}

      {!loading.state && signal.value === null ?
        <Typography className={classes.noresults}>
          No results.<br/> {isReadyToReceiveData ? 'Please select one of the five strategies (Fundamental, Relative, Mean Reversion, Momentum, Combo) to get Forecasts & Metrics.' : ''}
        </Typography> : ''}

    </>
  );
}

export default withStyles(styles)(Forecast);
