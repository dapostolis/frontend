import React from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import Loader from 'components/LoaderCircle';
import HeadingSideLine from 'components/HeadingSideLine';
import {Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';


const styles = () => ({
  title: {
    marginBottom: 10,
  },
  noresults: {
    marginTop: 10,
  },
});

function LineChart({classes, loading, chart}) {
  return (
    <>
      <Loader className={loading.className} size="small" start={loading.state}/>

      <HeadingSideLine title="Historical Performance" className={classes.title}/>

      {!loading.state && chart.length > 0 ?
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={'stockChart'}
          options={{

            /*title: {
              text: 'Test'
            },*/

            rangeSelector: {
              // enabled: false,
              selected: undefined,
            },

            xAxis: {
              startOfWeek: 5,
              /*title: {
                text: 'Date'
              },
              type: 'datetime',
              minRange: 240000*/
            },


            yAxis: {
              // title: {
              //   text: 'Step',
              // },
              labels: {
                formatter: function () {
                  // return (this.value > 0 ? ' + ' : '') + this.value + '%';
                  return this.value;
                }
              },
              plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
              }]
            },

            /*plotOptions: {
              series: {
                compare: 'percent',
                showInNavigator: true
              }
            },*/

            legend: {
              enabled: true
            },

            credits: {
              enabled: false
            },

            tooltip: {
              // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>', //({point.change}%)<br/>',
              // xDateFormat: '%d/%m/%Y',
              // valueDecimals: 2,
              // split: true
              useHTML: true,
              formatter: function () {
                let s = '';
                this.points.forEach(function (point, i) {
                  s += '<b><span style = "color:' + point.series.color + ';">' + point.series.name + ' </span>' + ' : ' + point.y + '</b><br />';
                });
                s += '<br/><b>' + Highcharts.dateFormat('%b %e, %Y', this.x) + '</b><br />';

                return s;
              },
            },

            series: chart

          }}
        />
        : ''}

      {!loading.state && chart.length === 0 ?
        <Typography className={classes.noresults}>No results.</Typography> : ''}
    </>
  );
}

export default withStyles(styles)(LineChart);