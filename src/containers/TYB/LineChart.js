import React from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import Loader from 'components/LoaderCircle'
import {withStyles} from '@material-ui/core/styles'
import HeadingSideLine from 'components/HeadingSideLine'
import {Typography} from '@material-ui/core'
import {convertNumberToPercentage} from '../../utils/generic';


const styles = theme => ({
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
  portfolioMetrics: {
    fontSize: 13,
    marginBottom: 5,
    textDecoration: 'underline',
  },
});

function LineChart({classes, loading, chart}) {
  console.log(chart.legend);
  return (
    <>
      <Loader className={loading.className} size="small" start={loading.state}/>

      <HeadingSideLine title="Historical Performance" className={classes.title}/>

      {!loading.state && chart.data.length > 0 && chart.legend.sharpe !== null ?
        <div className={classes.legend}>
          <Typography variant="h5" className={classes.portfolioMetrics}>Portfolio metrics</Typography>
          <Typography><strong>Annualised Return:</strong> {convertNumberToPercentage(chart.legend.annualisedRet)}%</Typography>
          <Typography><strong>Annualised Risk:</strong> {convertNumberToPercentage(chart.legend.annualisedVol)}%</Typography>
          <Typography><strong>Sharpe Ratio:</strong> {parseFloat(chart.legend.sharpe).toFixed(2)}</Typography>
        </div>
        : ''
      }

      {!loading.state && chart.data.length > 0 ?
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={'stockChart'}
          options={{

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

            yAxis: {
              // title: {
              //   text: 'Step',
              // },
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

            series: chart.data,

          }}
        />
        : ''
      }

      {!loading.state && chart.data.length === 0 ?
        <Typography className={classes.noresults}>No results.</Typography> : ''}
    </>
  )
}

export default withStyles(styles)(LineChart);