import React from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import Loader from 'components/LoaderCircle'
import {withStyles} from '@material-ui/core/styles'
import HeadingSideLine from 'components/HeadingSideLine'
import {Typography} from '@material-ui/core'


const styles = theme => ({
  heading: {
    marginBottom: 15,
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

  chartContainer: {
    display: 'flex',
    marginRight: 10,
    width: '100%',

    '&:last-child': {
      marginRight: 0,
    },

    '& > div': {
      width: '50%',
      borderRight: '2px solid ' + theme.palette.primary.light,
    },

    '& > div:last-child': {
      borderRight: 'medium none',
    }
  },

  noresults: {
    marginTop: 10,
  },
});

function LineChart({classes, loading, isReadyToReceiveData, resultTableSelectedValue, chart}) {
  // {/*series: chart.allocation,*/}

  return (
    <>
      <Loader className={loading.className} size="small" start={loading.state}/>

      <HeadingSideLine className={classes.heading} title="Historical Performance"/>

      {!loading.state && chart.length > 0 ?
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={{

              title: {
                text: resultTableSelectedValue.assetClass,
              },

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

            }}
          />
        : ''
      }

      {!loading.state && chart.length === 0 ?
        <Typography className={classes.noresults}>No results.<br/> {isReadyToReceiveData ? 'Please select one of the five strategies (Fundamental, Relative, Mean Reversion, Momentum, Combo) to load the Historical Performance charts.' : ''}</Typography> : ''}
    </>
  )
}

export default withStyles(styles)(LineChart);