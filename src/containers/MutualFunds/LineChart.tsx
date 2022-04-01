import React from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import Loader from 'components/LoaderCircle';
import {createStyles, withStyles} from '@material-ui/core/styles';
import HeadingSideLine from 'components/HeadingSideLine';
import {Typography, Theme, Table, TableHead, TableRow, TableBody, TableCell} from '@material-ui/core';

import {IChartProps, ICombinedParam} from "./Interface/IFundOutput";


const styles = (theme: Theme) => createStyles({
  bigparagraph: {
    margin: '20px 0',
  },

  tableRoot: {
    width: 270,
    maxWidth: 340,
    maxHeight: 374,
    marginBottom: 20,
    position: 'relative',
    overflowY: 'auto',
    border: '1px solid ' + theme.palette.primary.light,

    '& tr:last-child td': {
      border: 'medium none',
    },
  },

  tRow: {
    height: 36,
  },

  tCellHead: {
    fontSize: 15,
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.light,
  },

  legend: {
    margin: '10px 0',
    display: 'inline-block',
    padding: 5,
    border: '1px solid ' + theme.palette.primary.main,

    '& > p': {
      fontSize: 13,
      lineHeight: 1.2,
    },
  },
  title: {
    marginBottom: 10,
  },
  noresults: {
    marginTop: 10,
  },
});


interface IProps {
  classes: any;
  loading: IChartProps;
  submitted: boolean;
  chart: any;
  isTacticalTabEnabled: boolean;
  combinedParams: Array<ICombinedParam>;
  hasCombined: boolean;
}

function LineChart({classes, loading, submitted, chart, isTacticalTabEnabled, combinedParams, hasCombined}: IProps) {
  let highchartOptions: Highcharts.Options = {

    /*title: {
      text: 'Test'
    },*/

    rangeSelector: {
      selected: undefined,
    },

    /*xAxis: {
      title: {
        text: 'Date'
      },
      type: 'datetime',
      minRange: 240000
    },*/

    //@ts-ignore
    yAxis: {
      labels: {
        formatter: function () {
          // return (this.value > 0 ? ' + ' : '') + this.value + '%';
          return this.value;
        },
      },
      plotLines: [{
        value: 0,
        width: 2,
        color: 'silver',
      }],
    },

    /*plotOptions: {
      series: {
        compare: 'percent',
        showInNavigator: true
      }
    },*/

    /*responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal'
          },
          yAxis: {
            labels: {
              align: 'left',
              x: 0,
              y: -5
            },
            title: {
              text: null
            }
          },
          subtitle: {
            text: null
          },
          credits: {
            enabled: false
          }
        }
      }]
    },*/

    legend: {
      enabled: true,
    },

    credits: {
      enabled: false,
    },

    tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>', //({point.change}%)<br/>',
      xDateFormat: '%d/%m/%Y',
      valueDecimals: 2,
      split: true,
    },

    series: chart,

  };

  let droppedAssetClasses = combinedParams.filter(param => param.beta === null).map(param => param.assetClass);
  let combinedParamsFiltered = combinedParams.filter(param => param.beta !== null);

  return (
    <>
      <Loader className={loading.className} size="small" start={loading.state}/>

      <HeadingSideLine title="Historical Performance" className={classes.title}/>

      {/*{!loading.state && chart.legend.sharpe !== null ?
        <div className={classes.legend}>
          <Typography><strong>Annualised Return:</strong> {parseFloat(chart.legend.annualisedMean).toFixed(2)}%</Typography>
          <Typography><strong>Annualised Risk:</strong> {parseFloat(chart.legend.annualisedVol).toFixed(2)}%</Typography>
          <Typography><strong>Sharpe Ratio:</strong> {parseFloat(chart.legend.sharpe).toFixed(2)}</Typography>
          <Typography><strong>Turnover:</strong> {parseFloat(chart.legend.turnover).toFixed(2)}%</Typography>
        </div>
        : ''
      }*/}

      {!loading.state && chart.length > 0 && isTacticalTabEnabled && combinedParams.length > 0 ?
        <>
          <Typography className={classes.bigparagraph}>
            The below chart shows the fund that corresponds to the selected tactical views.<br/>
            {droppedAssetClasses.length > 0 ? 'Asset ' + (droppedAssetClasses.length === 1 ? 'class ' : 'classes ') + droppedAssetClasses.join(', ') + (droppedAssetClasses.length === 1 ? ' was ' : ' were ') + 'dropped due to multi-collinearity.' : ''}
          </Typography>

          <div className={classes.tableRoot}>
            <Table>
              <TableHead className={classes.thead}>
                <TableRow className={classes.tRow}>
                  <TableCell className={classes.tCellHead}>Asset Class</TableCell>
                  <TableCell className={classes.tCellHead}>Beta</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {combinedParamsFiltered.map((param, key) => (
                  <TableRow key={key}>
                    <TableCell className={classes.tCell}>{param.assetClass}</TableCell>
                    <TableCell className={classes.tCell}>{Number(param.beta).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
        : ''}

      {!loading.state && chart.length > 0 ?
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={'stockChart'}
          options={highchartOptions}
        />
        : ''
      }

      {!loading.state && chart.length === 0 && !submitted ?
        <Typography className={classes.noresults}>No results.</Typography>
        : ''}

      {!loading.state && chart.length === 0 && !isTacticalTabEnabled && submitted ?
        <Typography className={classes.noresults}>No results.</Typography>
        : ''}

      {!loading.state && chart.length === 0 && isTacticalTabEnabled && !hasCombined && submitted ?
        <Typography className={classes.bigparagraph}>
          No available funds were found by using the selected asset class views.
        </Typography>
        : ''}
    </>
  )
}

export default withStyles(styles)(LineChart);