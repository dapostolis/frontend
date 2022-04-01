import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@material-ui/core';
import Loader from 'components/LoaderCircle';
import HeadingSideLine from 'components/HeadingSideLine';
import TrendingFlat from 'assets/images/trendingflat.png';
import TrendingUp from 'assets/images/trendingup.png';
import TrendingDown from 'assets/images/trendingdown.png';
import {format as dateFormat} from 'date-fns';
import classnames from 'classnames';


const styles = theme => ({
  noresults: {
    marginTop: 10,
  },

  // table css
  tableRoot: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    position: 'relative',
    border: '1px solid ' + theme.palette.primary.light,
    /*'&.loading::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        opacity: '.5',
    },*/

    '& .combo': {
      backgroundColor: '#e6f5ff',
    },
    '& .combo > *': {
      fontWeight: 'bold',
    },
  },
  table: {
    minWidth: 500,
  },
  // tableWrapper: {
  //   overflowX: 'auto',
  // },
  tHead: {
    backgroundColor: theme.palette.primary.light,
  },
  tRow: {
    height: 36,
  },
  tCell: {
    fontSize: 14,
    color: theme.palette.secondary.main,
    '&:hover, &:focus': {
      // color: theme.palette.secondary.dark,
      opacity: '0.7',
    }
  },

  indexIcon: {
    width: 20,
    height: 'auto',
    verticalAlign: 'middle',
    marginLeft: 10,
  },

  infoCell: {
    marginTop: 5,
    padding: '4px 56px 4px 24px',
    backgroundColor: '#d4dced',

    border: '1px solid ' + theme.palette.primary.light,
    // borderBottom: '1px solid ' + theme.palette.primary.light,
    // borderLeft: '1px solid ' + theme.palette.primary.light,
  },
});

function ResultsTable({classes, loading, table, buyAndHold}) {
  //RENDER
  let forecastDate = null;

  if (table.length > 0) {
    forecastDate = table[0].forecast.time;
  }

  return (
    <>

      <Loader className={loading.className} size="small" start={loading.state}/>

      <HeadingSideLine title="Forecasts & Metrics"/>

      {!loading.state && table.length > 0 ?
        <>
          <div className={classes.tableRoot}>

            <Table className={classes.table}>
              <TableHead className={classes.tHead}>
                <TableRow className={classes.tRow}>

                  <TableCell className={classes.tCell}>Methodology</TableCell>
                  <TableCell className={classes.tCell}>Hit Ratio</TableCell>
                  <TableCell className={classes.tCell}>Ann. Return</TableCell>
                  <TableCell className={classes.tCell}>Market Participation</TableCell>
                  <TableCell className={classes.tCell}>Forecast ({forecastDate ? dateFormat(forecastDate, 'DD/MM/YYYY') : ''})</TableCell>

                </TableRow>
              </TableHead>

              <TableBody>
                {table.map((row, key) => {
                  let ForecastIcon = TrendingFlat,
                    forecastLabel = 'Neutral';

                  if (row.forecast.value < 0) {
                    ForecastIcon = TrendingDown;
                    forecastLabel = 'Negative';
                  } else if (row.forecast.value > 0) {
                    ForecastIcon = TrendingUp;
                    forecastLabel = 'Positive';
                  }

                  return (
                    <TableRow key={key} className={classnames({'combo': row.forecast.key === 'combined'})}>
                      <TableCell component="th" scope="row">{row.forecast.label}</TableCell>
                      <TableCell>{row.hit}%</TableCell>
                      <TableCell>{row.annualised_return}%</TableCell>
                      <TableCell>{row.market_participation}%</TableCell>
                      <TableCell>{forecastLabel} <img className={classes.indexIcon} src={ForecastIcon} alt="forecast-icon"/></TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>

            </Table>

          </div>

          {buyAndHold.value ?
            <div className={classes.infoCell}>
              <Typography>{buyAndHold.label} Ann. Return: {buyAndHold.value}%</Typography>
            </div> : ''}
        </>
      : ''}

      {!loading.state && table.length === 0 ?
        <Typography className={classes.noresults}>No results.</Typography> : ''}

    </>
  );
}

export default withStyles(styles)(ResultsTable);
