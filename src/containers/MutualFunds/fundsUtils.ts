import {ILists} from './Interface/IFundFetcher';
import {IKeyValue, IGlobalStateFields} from './Interface/IFundInput';
import {IRequestFundsTO} from './Interface/IFundRequest';


// todo - @type
export function constructMethodsHighchartInputObject(obj: any): any {
  let chart:any = [];

  if (!Boolean(obj)) return chart;

  const chartsLegendName = {
    benchmarkPerformance: 'User-defined Universe',

    backtestingPerformance_mom: 'Momentum Backtesting',
    backtestingPerformance_meanRev: 'Mean Reversion Backtesting',
    backtestingPerformance_minVol: 'Minimum Volatility Backtesting',
    backtestingPerformance_sharpe: 'Sharpe Backtesting',
    backtestingPerformance_al: 'Efficient Frontier Backtesting',

    portfolioPerformance_mom: 'Momentum Portfolio',
    portfolioPerformance_meanRev: 'Mean Reversion Portfolio',
    portfolioPerformance_minVol: 'Minimum Volatility Portfolio',
    portfolioPerformance_sharpe: 'Sharpe Portfolio',
    portfolioPerformance_al: 'Efficient Frontier Portfolio',
  };

  if (obj.bc_perf && Array.isArray(obj.bc_perf) && obj.bc_perf.length > 0) {
    chart.push({
      name: chartsLegendName.benchmarkPerformance,
      data: obj.bc_perf.map((data: any) => ([
        Number.parseInt(data.timestamp + '000'),
        Number.parseFloat(data.value.toFixed(2)),
      ]))
    });
  }

  // backtesting
  Object.keys(obj.bt_perf).forEach(btKey => {
    if (Array.isArray(obj.bt_perf[btKey]) && obj.bt_perf[btKey].length > 0) {
      chart.push({
        //@ts-ignore
        name: chartsLegendName['backtestingPerformance_' + btKey],
        data: obj.bt_perf[btKey].map((data: any) => ([
          Number.parseInt(data.timestamp + '000'),
          Number.parseFloat(data.value.toFixed(2)),
        ]))
      });
    }
  });

  // portfolio
  Object.keys(obj.pt_perf).forEach(ptKey => {
    if (Array.isArray(obj.pt_perf[ptKey]) && obj.pt_perf[ptKey].length > 0) {
      chart.push({
        //@ts-ignore
        name: chartsLegendName['portfolioPerformance_' + ptKey],
        data: obj.pt_perf[ptKey].map((data: any) => ([
          Number.parseInt(data.timestamp + '000'),
          Number.parseFloat(data.value.toFixed(2)),
        ]))
      });
    }
  });


  return chart;
}

// todo - @type
export function constructTacticalHighchartInputObject(obj: any): any {
  let chart:any = [];

  if (!Boolean(obj)) return chart;

  if (obj.pt_perf && Array.isArray(obj.pt_perf) && obj.pt_perf.length > 0) {
    let name = '';
    let lastAccordionItem = obj.accordion[obj.accordion.length - 1];
    if (lastAccordionItem.assetClass === 'Combined') {
      let firstFundItem = lastAccordionItem.funds[0];
      name = firstFundItem.name;
    } else {
      if (obj.combined_params.length === 1) {
        let assetClassName = obj.combined_params[0].assetClass;
        let selectedAssetClass = obj.accordion.filter((accordionItem: any) => accordionItem.assetClass === assetClassName);
        if (selectedAssetClass.length === 1 && selectedAssetClass[0].funds.length > 0) {
          let firstFundItem = selectedAssetClass[0].funds[0];
          name = firstFundItem.name;
        }
      }
    }

    chart.push({
      // name: 'Portfolio',
      name: name,
      data: obj.pt_perf.map((data: any) => ([
        Number.parseInt(data.timestamp + '000'),
        Number.parseFloat(data.value.toFixed(2)),
      ]))
    });
  }

  if (obj.rp_perf && Array.isArray(obj.rp_perf) && obj.rp_perf.length > 0) {
    chart.push({
      name: 'Replication',
      data: obj.rp_perf.map((data: any) => ([
        Number.parseInt(data.timestamp + '000'),
        Number.parseFloat(data.value.toFixed(2)),
      ]))
    });
  }

  return chart;
}

// todo - @type
export function constructCompareHighchartInputObject(obj: any): any {
  let chart:any = [];

  if (!Boolean(obj)) return chart;

  let fundsPerformanceArray = [];
  if (obj.funds_perf.length > 5) {
    fundsPerformanceArray = obj.funds_perf.slice(0, 5);
  } else {
    fundsPerformanceArray = obj.funds_perf;
  }

  if (fundsPerformanceArray && Array.isArray(fundsPerformanceArray) && fundsPerformanceArray.length > 0) {
    fundsPerformanceArray.forEach((fundChart: any, key: number) => {

      chart.push({
        name: fundChart.name,
        data: fundChart.chart_data.map((data: any) => ([
          Number.parseInt(data.timestamp + '000'),
          Number.parseFloat(data.value.toFixed(2)),
        ]))
      });

    });
  }

  if (obj.portfolio_perf && Array.isArray(obj.portfolio_perf) && obj.portfolio_perf.length > 0) {
    chart.push({
      name: 'Portfolio',
      data: obj.portfolio_perf.map((data: any) => ([
        Number.parseInt(data.timestamp + '000'),
        Number.parseFloat(data.value.toFixed(2)),
      ]))
    });
  }

  return chart;
}

// todo - @type
export function createFilteringRequestObject(fields: IGlobalStateFields, lists: ILists): IRequestFundsTO {
  let dataTO: IRequestFundsTO;

  dataTO = {
    number: Number(fields.number),

    country: (fields.country && Number(fields.country)) || null,

    assetClass: (lists.assetClass[fields.assetClass] && lists.assetClass[fields.assetClass].id) || null,
    focus: fields.focus.map((focus: IKeyValue) => focus.id),
    style: fields.style.map((style: IKeyValue) => style.id),

    currency: fields.currency.map((currency: IKeyValue) => currency.id),
    distributionStatus: fields.distributionStatus.map((distr: IKeyValue) => distr.id),
    trackRecordRange: Number(fields.trackRecordRange),
    excludeETF: fields.excludeETF,
  };

  return dataTO;
}
