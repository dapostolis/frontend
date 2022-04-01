/**
 * Component Currencies & Commodities
 */

import React, {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Paper} from '@material-ui/core';
import SidebarWrapper from 'components/SidebarWrapper';
import {request} from 'constants/alias';
import {API} from 'constants/config';
import MainBareWrapper from 'components/MainBareWrapper';
import MainHeaderWrapper from 'components/MainHeaderWrapper';
import Heading from 'components/HeadingSingleLine';
import {useSnackbar} from 'notistack/build';
import LineChart from './LineChart';
import ResultsTable from './ResultsTable';
import Form from './Form';
import InfoBox from 'components/InfoBox';
import DisclaimerPaper from '../../components/DisclaimerPaper';


const styles = theme => ({

  container: {
    display: 'flex',

    '& #sidebar-bg': {
      position: 'fixed',
      top: 0,
      width: 300,
      height: '100%',
      backgroundColor: '#fff',
    },

    '& .disabled': {
      cursor: 'no-drop',
      opacity: 0.5,
    },
  },

  infoBox: {
    marginBottom: 10,
  },

  loader: {
    top: 35,
  },

  // Sidebar
  sidebar: {
    position: 'relative',
    minWidth: 300,
    maxWidth: 300,
  },

  // Main
  Paper: {
    position: 'relative',
    minHeight: 120,
    marginTop: 15,
    padding: theme.spacing.unit * 2,
  },

});

function Currencies({classes}) {
  const {enqueueSnackbar} = useSnackbar();

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState({
    buyAndHold: {},
    table: [
      /*{
        methodology: 'AR',
        forecast: '',
        hits: '',
      }*/
    ],
    chart: [], // object that includes methodologies with an array of values
  });

  // todo - check scheduler
  const [isSchedulerRunning, setIsSchedulerRunning] = useState(false);

  useEffect(() => {
    // checkSchedulerStatus();
  }, []);

  function checkSchedulerStatus() {
    request.get(`${API}scheduler/markets`)
      .then(({data: {returnobject: {status}}}) => {
        setIsSchedulerRunning(status === 0 ? false : true);
      })
      .catch(error => console.log(error));
  }

  function handleSubmit(form) {
    // reset current page state
    setResult({
      buyAndHold: {},
      table: [],
      chart: [],
    });

    // Validation
    if (!form.instrument) {
      enqueueSnackbar('Currency field is required. You have to select one option among the above fields', {variant: 'error'});
      return;
    }

    if (!form.ar && !form.momentum && !form.trend && !form.hurst) {
      enqueueSnackbar('You have to select at least one methodology', {variant: 'error'});
      return;
    }

    if (!form.frequency) {
      enqueueSnackbar('Frequency field is required', {variant: 'error'});
      return;
    }
    // EoValidation

    let models = [];
    if (form.ar) models.push('AR');
    if (form.momentum) models.push('Momentum');
    if (form.trend) models.push('Trend');
    if (form.hurst) models.push('Hurst');

    let data = {
      instrument: form.instrument,
      models: models,
      combo: form.combo,
      frequency: form.frequency,
    };

    setLoading(true);

    request
      .post(`${API}alchemist/currency`, data)
      .then(({data: {returnobject: body}}) => {

        let table = body.forecasts.filter(forecast => forecast.key !== 'buy_hold').map(forecast => ({
          forecast: forecast,
          hit: '',
          annualised_return: '',
          market_participation: '',
        }));

        let buyAndHold = body.annualised_return.filter(annualisedReturn => annualisedReturn.key === 'buy_hold').map(annualisedReturn => ({
          label: annualisedReturn.label,
          value: (window.Number.parseFloat(annualisedReturn.value)*100).toFixed(2),
        }));

        table.forEach((t, key) => {
          if (body.hits && body.hits[key].key === t.forecast.key) {
            table[key].hit = (Number.parseFloat(body.hits[key].value)*100).toFixed(0);
          }
          if (body.annualised_return && body.annualised_return[key].key === t.forecast.key) {
            table[key].annualised_return = (window.Number.parseFloat(body.annualised_return[key].value)*100).toFixed(2);
          }
          if (body.market_participation && body.market_participation[key].key === t.forecast.key) {
            table[key].market_participation = (window.Number.parseFloat(body.market_participation[key].value)*100).toFixed(0);
          }
        });

        // setup chart
        let chart = [], chartAR, chartMomentum, chartCombo, chartTrend, chartHurst, chartDefault;

        if (body.parsedReturns.ar && body.parsedReturns.ar.length > 0) {

          chartAR = body.parsedReturns.ar.map(c => ([
            parseInt(c.timestamp + '000'),
            parseFloat(c.value.toFixed(2)),
          ]));

          chart.push({
            name: 'AR',
            data: chartAR
          });

        }

        if (body.parsedReturns.trend && body.parsedReturns.trend.length > 0) {

          chartTrend = body.parsedReturns.trend.map(c => ([
            parseInt(c.timestamp + '000'),
            parseFloat(c.value.toFixed(2)),
          ]));

          chart.push({
            name: 'Trend',
            data: chartTrend
          });

        }

        if (body.parsedReturns.momentum && body.parsedReturns.momentum.length > 0) {

          chartMomentum = body.parsedReturns.momentum.map(c => ([
            parseInt(c.timestamp + '000'),
            parseFloat(c.value.toFixed(2)),
          ]));

          chart.push({
            name: 'Momentum',
            data: chartMomentum
          });

        }

        if (body.parsedReturns.hurst && body.parsedReturns.hurst.length > 0) {

          chartHurst = body.parsedReturns.hurst.map(c => ([
            parseInt(c.timestamp + '000'),
            parseFloat(c.value.toFixed(2)),
          ]));

          chart.push({
            name: 'Hurst',
            data: chartHurst
          });

        }

        if (body.parsedReturns.combo && body.parsedReturns.combo.length > 0) {

          chartCombo = body.parsedReturns.combo.map(c => ([
            parseInt(c.timestamp + '000'),
            parseFloat(c.value.toFixed(2)),
          ]));

          chart.push({
            name: 'Combined',
            data: chartCombo
          });

        }

        if (body.parsedReturns.default && body.parsedReturns.default.length > 0) {

          chartDefault = body.parsedReturns.default.map(c => ([
            parseInt(c.timestamp + '000'),
            parseFloat(c.value.toFixed(2)),
          ]));

          chart.push({
            name: form.instrument.toUpperCase(),
            data: chartDefault
          });

        }


        setResult({
          buyAndHold: buyAndHold.length > 0 ? buyAndHold[0] : {},
          table: table,
          chart: chart,
        });


        setLoading(false);

      })
      .catch(error => {
        setLoading(false);
        setResult({
          buyAndHold: {},
          table: [],
          chart: [],
        });
        console.log(error);
      });
  }


  return (

    <div className={classes.container}>

      <div id="sidebar-bg"></div>

      <SidebarWrapper id="currencies-sidebar-panel" className={classes.sidebar}>
        <Form loading={loading} onHandleSubmit={handleSubmit}/>
      </SidebarWrapper>

      <MainBareWrapper>

        <MainHeaderWrapper id="currencies-top-main">
          <Heading title="Currencies"/>
        </MainHeaderWrapper>

        <InfoBox show={isSchedulerRunning}>Alchemist is updating data. xxxx</InfoBox>

        <Paper className={classes.Paper}>
          <ResultsTable loading={{className: classes.loader, state: loading}} table={result.table} buyAndHold={result.buyAndHold}/>
        </Paper>

        <Paper className={classes.Paper}>
          <LineChart loading={{className: classes.loader, state: loading}} chart={result.chart}/>
        </Paper>

        <Paper className={classes.Paper}>
          <DisclaimerPaper/>
        </Paper>

      </MainBareWrapper>


    </div>
  );

}

export default withStyles(styles)(Currencies);
