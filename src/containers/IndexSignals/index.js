import React, {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Paper} from '@material-ui/core';
import {request} from 'constants/alias';
import MainBareWrapper from 'components/MainBareWrapper';
import {API} from 'constants/config';
import {useSnackbar} from 'notistack';
import SidebarWrapper from 'components/SidebarWrapper';
import Form from './Form';
import MainHeaderWrapper from 'components/MainHeaderWrapper';
import Heading from 'components/HeadingSingleLine';
import ResultsTable from './ResultsTable';
import LineChart from './LineChart';
import classnames from 'classnames';
import Forecast from './Forecast';
import DisclaimerPaper from '../../components/DisclaimerPaper';


const styles = theme => ({
  container: {
    display: 'flex',
    height: '100%',

    '& #sidebar-bg': {
      position: 'fixed',
      top: 0,
      width: 300,
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
    minWidth: 300,
    maxWidth: 300,
    height: 'calc(100% - 20px)',
  },


  // Main
  main: {
    width: 'calc(100% - ' + 300 + 'px)',
  },

  Paper: {
    position: 'relative',
    minHeight: 120,
    marginTop: 15,
    padding: theme.spacing.unit * 2,

    '&:last-child': {
      marginBottom: 70,
    },
  },
});

function IndexSignals({classes}) {
  const {enqueueSnackbar} = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);
  const [resultTable, setResultTable] = useState([]);
  const [resultChart, setResultChart] = useState([]);
  const [resultTableSelectedValue, setResultTableSelectedValue] = useState({
    column: '', // methodology name
    row: 0,
    assetClass: '', // asset class name
    signalValue: null,
  });
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    // check App component css
    document.documentElement.classList.add('full-height');

    return () => {
      document.documentElement.classList.remove('full-height');
    }
  }, []);

  async function handleSubmit(data) {
    if (resultTable.length > 0) setResultTable([]);
    if (resultChart.length > 0) setResultChart([]);
    setResultTableSelectedValue({column: '', row: 0, assetClass: '', signalValue: null});
    setMetrics(null);

    // validation
    if (data.assetClasses.length === 0) {
      enqueueSnackbar('Please select at least one Asset Class', {variant: 'error'});
      return;
    }

    setLoading(true);

    try {
      const {data: {returnobject: {assetClasses}}} = await request.post(`${API}alchemist/indexsignal`, data);
      // get the enhanced asset clases table
      setResultTable(assetClasses);
    } catch (e) {
      console.log(e);
      enqueueSnackbar('Something went wrong, please contact your system administrator', {variant: 'error'});
    }

    setLoading(false);
  }

  async function handleGetChart(signalId, assetClass, row, column, signalValue) {
    if (loadingChart) return;

    setResultTableSelectedValue({column, row, assetClass, signalValue});

    setResultChart([]);

    setMetrics(null);

    setLoadingChart(true);

    try {
      const {data: {returnobject: {graph, ...other}}} = await request.post(`${API}alchemist/indexsignalhistorical/${signalId}`);

      setMetrics(other);

      // CHART PARSER
      // let absolute = [],
      //   allocation = [],
      //   chartBenchmark50 = [],
      let chart = [],
        chartOutperformance0 = [],
        chartOutperformance50 = [];

      // Benchmark is the same for both charts
      // graph.forEach(data => {
      //   if (data['benchmark_50_target_m'] !== null && !isNaN(data['benchmark_50_target_m']) && data.timestamp) {
      //     chartBenchmark50.push([
      //       parseInt(data.timestamp + '000'),
      //       parseFloat(data['benchmark_50_target_m'].toFixed(2)),
      //     ]);
      //   }
      // });

      graph.map(data => {
        if (data['outperformance_0_target_m'] !== null && !isNaN(data['outperformance_0_target_m']) && data.timestamp) {
          chartOutperformance0.push([
            parseInt(data.timestamp + '000'),
            parseFloat(data['outperformance_0_target_m'].toFixed(2)),
          ]);
        }
      });

      graph.map(data => {
        if (data['outperformance_50_target_m'] !== null && !isNaN(data['outperformance_50_target_m']) && data.timestamp) {
          chartOutperformance50.push([
            parseInt(data.timestamp + '000'),
            parseFloat(data['outperformance_50_target_m'].toFixed(2)),
          ]);
        }
      });


      // chart.push({
      //   name: assetClass,
      //   data: chartBenchmark50,
      // });
      chart.push({
        // name: column,
        name: 'Invested/cash',
        data: chartOutperformance0,
      });
      // chart.push({
      //   name: assetClass,
      //   data: chartBenchmark50,
      // });
      chart.push({
        name: 'Asset allocation',
        data: chartOutperformance50,
      });

      setResultChart(chart);

    } catch (e) {
      console.log(e);
    }
    setLoadingChart(false);
  }

  return (
    <div className={classes.container}>

      <div id="sidebar-bg"></div>

      <SidebarWrapper className={classes.sidebar}>
        <Form loading={loading || loadingChart} onHandleSubmit={handleSubmit}/>
      </SidebarWrapper>

      <MainBareWrapper className={classes.main}>
        <MainHeaderWrapper>
          <Heading title="Quant Strategist"/>
        </MainHeaderWrapper>

        <Paper className={classes.Paper}>
          <ResultsTable
            loading={{className: classes.loader, state: loading}}
            tableData={resultTable}
            resultTableSelectedValue={resultTableSelectedValue}
            onHandleGetChart={handleGetChart}
          />
        </Paper>

        <Paper className={classes.Paper}>
          <Forecast
            loading={{className: classes.loader, state: loadingChart}}
            isReadyToReceiveData={resultTable.length > 0}
            assetClass={resultTableSelectedValue.assetClass}
            signal={{
              name: resultTableSelectedValue.column,
              value: resultTableSelectedValue.signalValue,
              metrics: metrics,
            }}
          />
        </Paper>

        <Paper className={classnames(classes.Paper, 'flex')}>
          <LineChart
            loading={{className: classes.loader, state: loadingChart}}
            isReadyToReceiveData={resultTable.length > 0}
            resultTableSelectedValue={resultTableSelectedValue}
            chart={resultChart}
          />
        </Paper>

        <Paper className={classes.Paper}>
          <DisclaimerPaper/>
        </Paper>

      </MainBareWrapper>

    </div>
  )
}

export default withStyles(styles)(IndexSignals);