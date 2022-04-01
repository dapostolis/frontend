import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import MainBareWrapper from '../../components/MainBareWrapper';
import SidebarWrapper from '../../components/SidebarWrapper';
import Heading from '../../components/HeadingSingleLine';
import MainHeaderWrapper from '../../components/MainHeaderWrapper';
import Form from './Form';
import {request} from '../../constants/alias';
import {API} from '../../constants/config';
import {Paper} from '@material-ui/core';
import LineChart from './LineChart';
import FactorsResultsTable from './FactorsResultsTable';
import {useSnackbar} from 'notistack/build';
import InfoBox from 'components/InfoBox';
import DisclaimerPaper from '../../components/DisclaimerPaper';


const styles = theme => ({
  container: {
    display: 'flex',

    '& #sidebar-bg': {
      position: 'fixed',
      top: 0,
      width: 350,
      height: '100%',
      backgroundColor: '#fff',
    },
  },

  loader: {
    top: 35,
  },


  // Sidebar
  sidebar: {
    position: 'relative',
    minWidth: 350,
    maxWidth: 350,
  },

  // Main
  main: {
    width: 'calc(100% - ' + 350 + 'px)',
  },

  Paper: {
    position: 'relative',
    minHeight: 120,
    marginTop: 15,
    padding: theme.spacing.unit * 2,

    // '&:last-child': {
    //   marginBottom: 70,
    // },
  },
});

function TYB({classes}) {
  const {enqueueSnackbar} = useSnackbar();
  const [loading, setLoading] = useState(false);
  // set this object on tyb RUN response
  const [results, setResults] = useState({
    alchemistMode: false,
    rsq: 0.0,
    table: {
      uni: [],
      multi: [],
    },
    chart: {
      legend: {
        annualisedRet: null,
        annualisedVol: null,
        sharpe: null,
      },
      data: [],
    },
  });
  const [significantError, setSignificantError] = useState(false);

  function handleResetResults() {
    setResults({
      alchemistMode: false,
      rsq: 0.0,
      table: {
        uni: [],
        multi: [],
      },
      chart: {
        legend: {
          annualisedRet: null,
          annualisedVol: null,
          sharpe: null,
        },
        data: [],
      },
    });
  }

  async function handleSubmit(fields) {
    setSignificantError(false);
    setLoading(true);

    handleResetResults();

    try {
      const {data: {returnobject:response}} = await request.post(`${API}alchemist/tyb`, {
        alchemistMode: fields.alchemistMode,
        tybVariableWeightTOs: fields.isins,
        tybFactors: fields.factors,
      });

      // CHART PARSER
      let chart = {
        legend: {
          annualisedRet: response.annualisedRet,
          annualisedVol: response.annualisedVol,
          sharpe: response.sharpe,
        },
        data: [],
      };
      if (window.Array.isArray(response.parsedReturns.actual)) {
        chart.data.push({
          name: 'Portfolio',
          data: response.parsedReturns.actual.map(data => ([
            parseInt(data.timestamp + '000'),
            parseFloat(data.value.toFixed(2)),
          ]))
        });
      }
      if (window.Array.isArray(response.parsedReturns.fitted)) {
        chart.data.push({
          name: 'Replication',
          data: response.parsedReturns.fitted.map(data => ([
            parseInt(data.timestamp + '000'),
            parseFloat(data.value.toFixed(2)),
          ]))
        });
      }

      // Create a multi table by merging alpha and holdings
      let rsq = null;
      if (response.rsq) {
        rsq = (response.rsq*100).toFixed(2);
      }

      let correlation = null;
      if (response.correlation) {
        correlation = (response.correlation*100).toFixed(2);
      }

      let tableUni = [];
      if (response.holdings && window.Array.isArray(response.holdings) && response.holdings.length > 0) {
        tableUni = response.holdings.map(({name, beta, tStat}) => (
          // {name: factorsDict[ticker], beta: beta.toFixed(2), tStat: tStat.toFixed(2)})
          {name: name, beta: beta.toFixed(2), tStat: tStat.toFixed(2)})
        );
      }

      // if (window.Boolean(response.alpha)) {
      //   tableUni = tableUni.concat([{name: 'Constant (Alpha)', beta: response.alpha.value.toFixed(2), tStat: response.alpha.tStat.toFixed(2)}]);
      // }

      // create single table
      let tableMulti = [];
      if (fields.alchemistMode && window.Array.isArray(response.survived_holdings) && response.survived_holdings.length > 0) {
        tableMulti = response.survived_holdings.map(({name, beta, tStat}) => (
          // {name: factorsDict[ticker], beta: beta.toFixed(2), tStat: tStat.toFixed(2)})
          {name: name, beta: beta.toFixed(2), tStat: tStat.toFixed(2)})
        );
      }

      setResults({
        alchemistMode: fields.alchemistMode,
        droppedFactors: response.dropped_factors,
        rsq: rsq,
        correlation: correlation,
        table: {
          uni: tableUni,
          multi: tableMulti,
        },
        chart: chart,
      });

      if (tableUni.length === 0) {
        setSignificantError(true);
      }

    } catch (ex) {
      // todo check error
      console.log(ex);

      let response = ex.response;

      if ('data' in response && 'code' in response.data && response.data.code === '26') {
        setSignificantError(true);
      } else if ('data' in response && 'code' in response.data && response.data.code === '-1' && response.data.message) {
        enqueueSnackbar(response.data.message, {variant: 'error'});
      } else {
        // enqueueSnackbar('There are no data for these parameters. Please change your preferences. If the error persists, please contact your system administrator', {variant: 'info'});
        enqueueSnackbar('Something went wrong. Please contact your system administrator', {variant: 'error'});
      }

    }

    setLoading(false);

  }

  return (
    <div className={classes.container}>
      {/*<div id="sidebar-bg"></div>*/}

      <SidebarWrapper className={classes.sidebar}>
        <Form loading={loading} onHandleResetResults={handleResetResults} onHandleSubmit={handleSubmit}/>
      </SidebarWrapper>

      <MainBareWrapper className={classes.main}>
        <MainHeaderWrapper>
          <Heading title="Test Your Banker"/>
        </MainHeaderWrapper>

        <InfoBox show={significantError}>No significant exposures were found</InfoBox>

        <Paper className={classes.Paper}>
          <FactorsResultsTable
            loading={{className: classes.loader, state: loading}}
            isAlchemistModeEnabled={results.alchemistMode}
            droppedFactors={results.droppedFactors}
            rsq={results.rsq}
            correlation={results.correlation}
            tableData={results.table}
          />
        </Paper>

        <Paper className={classes.Paper}>
          <LineChart loading={{className: classes.loader, state: loading}} chart={results.chart}/>
        </Paper>

        <Paper className={classes.Paper}>
          <DisclaimerPaper/>
        </Paper>

      </MainBareWrapper>
    </div>
  )
}

export default withStyles(styles)(TYB);