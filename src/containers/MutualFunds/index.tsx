import React, {useEffect, useState} from 'react';
import {createStyles, withStyles, Theme} from '@material-ui/core/styles';
import MainBareWrapper from 'components/MainBareWrapper';
import SidebarWrapper from 'components/SidebarWrapper';
import Heading from 'components/HeadingSingleLine';
import MainHeaderWrapper from 'components/MainHeaderWrapper';
import {request} from 'constants/alias';
import {API} from 'constants/config';
import {Paper} from '@material-ui/core';
import {useSnackbar} from 'notistack';
import {
  constructMethodsHighchartInputObject,
  constructTacticalHighchartInputObject,
  constructCompareHighchartInputObject,
  createFilteringRequestObject
} from './fundsUtils';
import AccordionTables from './MethodsAccordion';
import FundsTabs from './FundsTabs';
import TacticalAccordionTables from './TacticalAccordionTables';
import LineChart from './LineChart';
import StrategyTable from "./StrategyTable";
import FundsTableCompare from "./FundsTableCompare";
import {Canceler} from "axios";

import {IAssetClass, IAvailableFunds, IFactor, IFundsSpecificStateFields, IGlobalStateFields, IKeyValue, ItybVariableWeightField} from './Interface/IFundInput';
import {ILists} from './Interface/IFundFetcher';
import {IRequestFundsTO} from './Interface/IFundRequest';
import {ITacticalAccordion} from "./Interface/IFundOutput";
import DisclaimerPaper from "../../components/DisclaimerPaper";


let timeout: number;
const CancelToken = request.CancelToken;
let cancelTokens:Array<Canceler> = [];


const styles = (theme: Theme) => createStyles({
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


interface IProps {
  classes: any;
}

function MutualFunds({classes}: IProps) {
  const {enqueueSnackbar} = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState<ILists>({
    country: [],
    assetClass: {},
    currency: [],
    distributionStatus: [],

    equities: [],
    fixedincome: [],
    macro: [],
  });
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [availableFunds, setAvailableFunds] = useState<IAvailableFunds>({
    number: 0,
    loading: false,
  });
  const [fields, setFields] = useState<IGlobalStateFields>({
    number: 1,
    country: '',
    // country: '2',

    assetClass: '',
    // assetClass: 'allocation',
    focus: [],
    style: [],

    currency: [],
    // currency: [{id: 2, label: 'Euro'}],
    distributionStatus: [],
    trackRecordRange: '3',
    excludeETF: false,
  });
  const [tab, setTab] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  // set this object on tyb RUN response
  const [results, setResults] = useState({
    fundsMethods: {},
    tacticalAccordion: [],
    chart: [],
    strategyParams: null,
    combinedParams: [],
    compare: null,
  });

  useEffect(() => {
    function fetchInit() {

      setFetchLoading(true);
      setAvailableFunds({
        ...availableFunds,
        loading: true,
      });

      function getCountries() {
        return request.get(`${API}alchemistfetcher/mutualfund/country`);
      }

      function getAssetClasses() {
        return request.get(`${API}alchemistfetcher/mutualfund/assetclass`);
      }

      function getCurrencies() {
        return request.get(`${API}alchemistfetcher/mutualfund/currency`);
      }

      function getFactors() {
        return request.get(`${API}alchemistfetcher/tyb/factors`);
      }

      function getDistributionStatus() {
        return request.get(`${API}alchemistfetcher/mutualfund/distributionstatus`);
      }


      request.all([getCountries(), getAssetClasses(), getCurrencies(), getFactors(), getDistributionStatus()])
        .then(request.spread((countryAxios, assetClassAxios, currencyAxios, factorsAxios, distributionStatusAxios) => {
          let currencies: Array<IKeyValue>,
            countries: Array<IKeyValue>,
            assetClasses: {[key: string]: IAssetClass},
            factors: Array<IFactor>,
            distributionStatus: Array<IKeyValue>;

          countries = countryAxios.data.returnobject.objects || [];
          assetClasses = assetClassAxios.data.returnobject.assetClass;
          currencies = currencyAxios.data.returnobject.objects || [];
          factors = factorsAxios.data.returnobject.factors || [];
          distributionStatus = distributionStatusAxios.data.returnobject.objects || [];

          factors = factors.map((factor: IFactor) => {
            if (factor.category.toLowerCase().indexOf('equities') === -1 && factor.category.toLowerCase().indexOf('fixed') === -1) {
              return {
                ...factor,
                category: 'macro',
              };
            }

            return factor;
          });


          setLists({
            country: countries,
            assetClass: assetClasses,
            currency: currencies,
            distributionStatus: distributionStatus,

            equities: factors.filter((factor: IFactor) => factor.category.toLowerCase().indexOf('equities') !== -1),
            fixedincome: factors.filter((factor: IFactor) => factor.category.toLowerCase().indexOf('fixed') !== -1),
            macro: factors.filter((factor: IFactor) => factor.category.toLowerCase().indexOf('macro') !== -1),
          });

          setFetchLoading(false);
        }))
        .catch(error => {
          console.log(error);
          setFetchLoading(false);
        });

    }

    fetchInit();
  }, []);
  useEffect(() => {
    handleUpdateAvailableFunds();
  }, [fields.country, fields.currency, fields.trackRecordRange, fields.excludeETF, fields.distributionStatus, fields.assetClass, fields.focus, fields.style]);

  function handleUpdateAvailableFunds(): void {
    setAvailableFunds({
      number: '-',
      loading: true,
    });

    let dataTO = createFilteringRequestObject(fields, lists);

    if (cancelTokens.length > 0) {
      cancelTokens.forEach((c: Canceler) => c());
    }

    request.post(`${API}alchemistfetcher/mutualfund/universe`, dataTO, {
      cancelToken: new CancelToken(function executor(cancel: Canceler) {
        cancelTokens.push(cancel);
      }),
    })
      .then(({data: {returnobject}}) => {
        if (timeout) clearInterval(timeout);

        timeout = window.setTimeout(() => {
          setAvailableFunds({
            number: returnobject,
            loading: false,
          });
        }, 1200);
      })
      .catch(error => {
        console.log(error);
        if (!request.isCancel(error)) {
          setAvailableFunds({
            ...availableFunds,
            loading: false,
          });
        }
      })
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    let target = event.target;
    const {id, type, value, checked} = target;

    let fieldValue = type === 'checkbox' ? checked : value;

    setFields({
      ...fields,
      [id]: fieldValue,
    });
  }

  function handleChangeSingleSelect(event: React.ChangeEvent<HTMLSelectElement>): void {
    let target = event.target;
    const {name, value} = target;

    setFields({
      ...fields,
      [name]: value,
    });
  }

  function handleChangeMultiple({target: {value, name}}: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
    setFields({
      ...fields,
      [name]: value,
    });
  }

  function handleChangeFundsNumber({target: {value}}: React.ChangeEvent<HTMLInputElement>): void {
    let pValue = parseInt(value);

    if (value !== '' && (isNaN(pValue) || (pValue < 1 || pValue > 200))) {
      return;
    }

    setFields({
      ...fields,
      number: isNaN(pValue) ? '' : pValue,
    });
  }

  function handleChangeAssetClass(event: React.ChangeEvent<HTMLSelectElement>): void {
    // Object.keys(lists.assetClass).filter(acKey => lists.assetClass[acKey].id === event.target.value);

    setFields({
      ...fields,
      assetClass: event.target.value,
      focus: [],
      style: [],
    });
  }

  function handleChangeTabs(event: any, value: number) {
    setTab(value);
    if (!loading) {
      handleResetResults();
    }
  }

  function handleChangeTrackRecordRange(value: string) {
    setFields({
      ...fields,
      trackRecordRange: value,
    });
  }

  function handleResetInput() {
    setFields({
      number: 1,
      country: '',
      // country: '2',

      assetClass: '',
      // assetClass: 'allocation',
      focus: [],
      style: [],

      currency: [],
      // currency: [{id: 2, label: 'Euro'}],
      distributionStatus: [],
      trackRecordRange: '3',
      excludeETF: false,
    });
  }

  function handleResetResults() {
    setResults({
      fundsMethods: {},
      tacticalAccordion: [],
      chart: [],
      strategyParams: null,
      combinedParams: [],
      compare: null,
    });

    setSubmitted(false);
  }

  async function handleSubmit(childFields: IFundsSpecificStateFields) {

    let isCompareTabEnabled = 'tybVariableWeightTOs' in childFields;
    let isTacticalTabEnabled = 'selectedFactors' in childFields;
    // let isMethodsTabEnabled = 'method' in childFields;

    //VALIDATION
    if (!Boolean(fields.number)) {
      enqueueSnackbar('Number of funds is required', {variant: 'error'});
      return;
    }

    if (fields.number < 0 || fields.number > 200) {
      enqueueSnackbar('Number of funds must be greater than 0 and lower than 201', {variant: 'error'});
      return;
    }

    if (!fields.country) {
      enqueueSnackbar('Country field is required', {variant: 'error'});
      return;
    }

    if (!fields.trackRecordRange) {
      enqueueSnackbar('Track Record Change field is required', {variant: 'error'});
      return;
    }

    if (!Boolean(fields.assetClass)) {
      enqueueSnackbar('Asset Class field is required', {variant: 'error'});
      return;
    }

    if (fields.currency.length === 0) {
      enqueueSnackbar('Currency field is required', {variant: 'error'});
      return;
    }

    if (fields.distributionStatus.length === 0) {
      enqueueSnackbar('Distribution Status field is required', {variant: 'error'});
      return;
    }

    if (availableFunds.number === 0) {
      enqueueSnackbar('There are no available funds for the selected options. Please redefine your filtering criteria. ', {variant: 'error'});
      return;
    }

    // validation on specific tabs
    if (isCompareTabEnabled) {

      if (childFields.tybVariableWeightTOs.length === 0) {
        enqueueSnackbar('You have to setup your portfolio before to continue', {variant: 'error'});
        return;
      }

      let method = childFields.method;
      let isOneMethodologySelected = method.momentum || method.meanReversion || method.minimumVolatility || method.sharpe || method.alchemist;
      if (!isOneMethodologySelected) {
        enqueueSnackbar('At least one methodology has to be selected', {variant: 'error'});
        return;
      }


      if (childFields.tybVariableWeightTOs.length === 1 && !childFields.tybVariableWeightTOs[0].weight) {
        childFields.tybVariableWeightTOs[0].weight = '100';
      } else {

        try {

          childFields.tybVariableWeightTOs.forEach((isin, key) => {
            if (!isin.weight) {
              throw `ISIN "${childFields.tybVariableWeightTOs[key].name}" weight is required`;
            }
          });

        } catch (ex) {
          console.log(ex);
          enqueueSnackbar(ex, {variant: 'error'});
          return;
        }

      }

    } else if (isTacticalTabEnabled) {

      let hasSelectedFactors = Object.keys(childFields.selectedFactors).length > 0;
      if (!hasSelectedFactors) {
        enqueueSnackbar('Select at least one Asset Class View', {variant: 'error'});
        return;
      }

      try {
        Object.keys(childFields.selectedFactors).forEach((sfKey: string) => {
          if (childFields.selectedFactors[sfKey].sign === '') {
            throw `Tactical view for factor ${childFields.selectedFactors[sfKey].friendly_name} is not selected`;
          }
        });
      } catch (exception) {
        console.log(exception);
        enqueueSnackbar(exception, {variant: 'error'});
        return;
      }

      if (availableFunds.number === 0) {
        enqueueSnackbar('There are no available funds for the selected options. Please redefine your filtering criteria. ', {variant: 'error'});
        return;
      }

    } else {

      let method = childFields.method;
      let isOneMethodologySelected = method.momentum || method.meanReversion || method.minimumVolatility || method.sharpe || method.alchemist;
      if (!isOneMethodologySelected) {
        enqueueSnackbar('At least one methodology has to be selected', {variant: 'error'});
        return;
      }

    }
    //EoVALIDATION

    setLoading(true);

    handleResetResults();

    let dataTO: IRequestFundsTO = {
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

    // enhance transfer object
    if (isCompareTabEnabled) {

      dataTO.tybVariableWeightTOs = childFields.tybVariableWeightTOs.map((isin: ItybVariableWeightField) => ({
        variable: isin.variable,
        pointsInMonths: isin.pointsInMonths,
        weight: isin.weight,
      }));

      dataTO.momentum = childFields.method.momentum;
      dataTO.meanReversion = childFields.method.meanReversion;
      dataTO.minimumVolatility = childFields.method.minimumVolatility;
      dataTO.sharpe = childFields.method.sharpe;
      dataTO.alchemist = childFields.method.alchemist;

    } else if (isTacticalTabEnabled) {

      dataTO.selectedFactors = Object.keys(childFields.selectedFactors).map((sfKey: string) => ({
        id: childFields.selectedFactors[sfKey].id,
        sign: childFields.selectedFactors[sfKey].sign === 'over' ? true : false,
      }));

    } else {

      dataTO.momentum = childFields.method.momentum;
      dataTO.meanReversion = childFields.method.meanReversion;
      dataTO.minimumVolatility = childFields.method.minimumVolatility;
      dataTO.sharpe = childFields.method.sharpe;
      dataTO.alchemist = childFields.method.alchemist;

    }

    try {

      const {data: {returnobject:response}} = await request.post(`${API}alchemist/mutualfund`, dataTO);

      let fundsMethods = {},
        tacticalAccordion = [],
        chart = [],
        strategyParams = null,
        combinedParams = [],
        compare;

      if (isCompareTabEnabled) {

        // compare = response.compare;
        let compareFunds = response.compare.filter((row: any) => row.name !== 'Portfolio');
        if (compareFunds.length > 5) {
          compare = compareFunds.slice(0, 5);

          let portfolio = response.compare[response.compare.length-1];
          compare.push(portfolio);
        } else {
          compare = response.compare;
        }

        chart = constructCompareHighchartInputObject(response);

      } else if (isTacticalTabEnabled) {

        tacticalAccordion = response.accordion;
        chart = constructTacticalHighchartInputObject(response);
        combinedParams = response.combined_params;

      } else {

        fundsMethods = {
          momentum: {
            title: 'Momentum',
            list: response.funds.mom,
          },
          meanReversion: {
            title: 'Mean Reversion',
            list: response.funds.meanRev,
          },
          sharpe: {
            title: 'Sharpe',
            list: response.funds.sharpe,
          },
          minimumVolatility: {
            title: 'Minimum Volatility',
            list: response.funds.minVol,
          },
          alchemist: {
            title: 'Efficient Frontier',
            list: response.funds.al,
          },
        };

        chart = constructMethodsHighchartInputObject(response);
        strategyParams = response.strategy_params;

      }


      setResults({
        fundsMethods: fundsMethods,
        tacticalAccordion: tacticalAccordion,
        chart: chart,
        strategyParams: strategyParams,
        combinedParams: combinedParams || [],
        compare: compare || null,
      });

      setSubmitted(true);

    } catch (ex) {
      // todo check error
      console.log(ex);

      let response = ex.response;

      if (response && 'data' in response && 'code' in response.data && response.data.code === '-1' && response.data.message) {
        enqueueSnackbar(response.data.message, {variant: 'error'});
      } else {
        enqueueSnackbar('Something went wrong. Please contact your system administrator', {variant: 'error'});
      }

    }

    setLoading(false);

  }

  let isMethodsTabEnabled = 'momentum' in results.fundsMethods;
  let isCompareTabEnabled = window.Boolean(results.compare);

  return (
    <div className={classes.container}>

      <SidebarWrapper className={classes.sidebar}>
        <FundsTabs
          loading={loading}
          tab={tab}
          lists={lists}
          availableFunds={availableFunds}
          globalFields={fields}
          handleChangeTabs={handleChangeTabs}
          onHandleChange={handleChange}
          onHandleChangeMultiple={handleChangeMultiple}
          onHandleChangeFundsNumber={handleChangeFundsNumber}
          onHandleChangeAssetClass={handleChangeAssetClass}
          onHandleChangeSingleSelect={handleChangeSingleSelect}
          onHandleChangeTrackRecordRange={handleChangeTrackRecordRange}
          onHandleResetInput={handleResetInput}
          onHandleResetResults={handleResetResults}
          handleSubmit={handleSubmit}
        />
      </SidebarWrapper>

      <MainBareWrapper className={classes.main}>
        <MainHeaderWrapper>
          <Heading title="Mutual Funds"/>
        </MainHeaderWrapper>

        {tab === 0 ?
          <Paper className={classes.Paper}>
            <StrategyTable
              loading={{className: classes.loader, state: loading}}
              strategyParams={results.strategyParams}
            />
          </Paper>
          : ''}

        <Paper className={classes.Paper}>
          {isMethodsTabEnabled ?
            <AccordionTables loading={{className: classes.loader, state: loading}} fundsMethods={results.fundsMethods}/>
            : [
              (isCompareTabEnabled
                ? <FundsTableCompare loading={{className: classes.loader, state: loading}} compare={results.compare}/>
                : <TacticalAccordionTables loading={{className: classes.loader, state: loading}} tacticalAccordion={results.tacticalAccordion}/>
              )
            ]
          }
        </Paper>

        <Paper className={classes.Paper}>
          <LineChart
            loading={{className: classes.loader, state: loading}}
            submitted={submitted}
            chart={results.chart}
            isTacticalTabEnabled={!isMethodsTabEnabled && !isCompareTabEnabled}
            combinedParams={results.combinedParams}
            hasCombined={results.tacticalAccordion.filter((accordionItem: ITacticalAccordion) => accordionItem.assetClass === 'Combined' && accordionItem.funds && accordionItem.funds.length > 0).length === 1}
          />
        </Paper>

        <Paper className={classes.Paper}>
          <DisclaimerPaper/>
        </Paper>
      </MainBareWrapper>

    </div>
  )
}

export default withStyles(styles)(MutualFunds);
