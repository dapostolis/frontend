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
  constructHighchartInputObject,
  constructTacticalHighchartInputObject,
  createFilteringRequestObject
} from './fundsUtils';
import AccordionTables from './MethodsAccordion';
import FundsTabs from './FundsTabs';
import TacticalAccordionTables from './TacticalAccordionTables';
import LineChart from './LineChart';
import StrategyTable from "containers/HedgeFunds/StrategyTable";
import {Canceler} from "axios";

import {ILists} from "./Interface/IHedgeFundFetcher";
import {ITacticalAccordion} from "./Interface/IHedgeFundOutput";
import {IGlobalStateFields, IAvailableFunds, IFactor, IKeyValue, IFundsSpecificStateFields} from "./Interface/IHedgeFundInput";
import {IRequestFundsTO} from './Interface/IHedgeFundRequest';
import DisclaimerPaper from "../../components/DisclaimerPaper";


const CancelToken = request.CancelToken;
let cancelTokens:Array<Canceler> = [];

let timeout: number;

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

function HedgeFunds({classes}: IProps) {
  const {enqueueSnackbar} = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [lists, setLists] = useState<ILists>({
    types: [],
    currency: [],
    strategyType: [],

    equities: [],
    fixedincome: [],
    macro: [],
  });
  const [tab, setTab] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [availableFunds, setAvailableFunds] = useState<IAvailableFunds>({
    number: 0,
    loading: false,
  });
  const [fields, setFields] = useState<IGlobalStateFields>({
    number: 1,
    type: [],
    trackRecordRange: '3',
    currency: [],
    strategyType: [],
  });
  // set this object on tyb RUN response
  const [results, setResults] = useState({
    fundsMethods: {},
    tacticalAccordion: [],
    chart: [],
    strategyParams: null,
    combinedParams: [],
  });

  useEffect(() => {
    function fetchInit() {

      setFetchLoading(true);
      setAvailableFunds({
        ...availableFunds,
        loading: true,
      });

      function getCurrencies() {
        return request.get(`${API}alchemistfetcher/hedgefund/currency`);
      }

      function getStrategyType() {
        return request.get(`${API}alchemistfetcher/hedgefund/strategytype`);
      }

      function getFactors() {
        return request.get(`${API}alchemistfetcher/tyb/factors`);
      }


      request.all([getCurrencies(), getStrategyType(), getFactors()])
        .then(request.spread((currencyAxios, strategyTypeAxios, factorsAxios) => {
          let currencies: Array<IKeyValue>,
            strategyType: Array<IKeyValue>,
            factors: Array<IFactor>;

          currencies = currencyAxios.data.returnobject.objects || [];
          strategyType = strategyTypeAxios.data.returnobject.objects || [];
          factors = factorsAxios.data.returnobject.factors || [];

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
            types: ['OFFSHORE', 'UCITS'],
            currency: currencies,
            strategyType: strategyType,

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
    function handleUpdateAvailableFunds(): void {
      setAvailableFunds({
        number: '-',
        loading: true,
      });

      let dataTO = createFilteringRequestObject(fields, lists);

      if (cancelTokens.length > 0) {
        cancelTokens.forEach((c: Canceler) => c());
      }

      request.post(`${API}alchemistfetcher/hedgefund/universe`, dataTO, {
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

    handleUpdateAvailableFunds();
  }, [fields.type, fields.trackRecordRange, fields.currency, fields.strategyType]);

  function handleResetInput() {
    setFields({
      number: 1,
      type: [],
      trackRecordRange: '3',
      currency: [],
      strategyType: [],
    });
  }

  function handleResetResults() {
    setResults({
      fundsMethods: {},
      tacticalAccordion: [],
      chart: [],
      strategyParams: null,
      combinedParams: [],
    });

    setSubmitted(false);
  }

  function handleChangeTabs(event: any, value: number) {
    setTab(value);
    if (!loading) {
      handleResetResults();
    }
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

  async function handleSubmit(childFields: IFundsSpecificStateFields) {

    let isMethodsTabEnabled = !('selectedFactors' in childFields);

    //VALIDATION
    if (!Boolean(fields.number)) {
      enqueueSnackbar('Number of funds is required', {variant: 'error'});
      return;
    }

    if (fields.number < 0 || fields.number > 200) {
      enqueueSnackbar('Number of funds must be greater than 0 and lower than 201', {variant: 'error'});
      return;
    }

    if (fields.type.length === 0) {
      enqueueSnackbar('Type field is required', {variant: 'error'});
      return;
    }

    if (!fields.trackRecordRange) {
      enqueueSnackbar('Track Record Change is required', {variant: 'error'});
      return;
    }

    if (fields.currency.length === 0) {
      enqueueSnackbar('Currency field is required', {variant: 'error'});
      return;
    }

    if (fields.strategyType.length === 0) {
      enqueueSnackbar('Strategy Type field is required', {variant: 'error'});
      return;
    }

    // validation on specific tabs
    if (isMethodsTabEnabled) {

      let isOneMethodologySelected = childFields.method.momentum || childFields.method.meanReversion || childFields.method.minimumVolatility || childFields.method.sharpe || childFields.method.alchemist;
      if (!isOneMethodologySelected) {
        enqueueSnackbar('At least one methodology has to be selected', {variant: 'error'});
        return;
      }

    } else {

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

    }
    //EoVALIDATION

    setLoading(true);

    handleResetResults();

    let dataTO: IRequestFundsTO = {
      number: Number(fields.number),
      type: fields.type,
      trackRecordRange: Number(fields.trackRecordRange),
      currency: fields.currency.map((currency: IKeyValue) => currency.id),
      strategyType: fields.strategyType.map((st: IKeyValue) => st.label),
    };

    if (isMethodsTabEnabled) {
      dataTO.momentum = childFields.method.momentum;
      dataTO.meanReversion = childFields.method.meanReversion;
      dataTO.minimumVolatility = childFields.method.minimumVolatility;
      dataTO.sharpe = childFields.method.sharpe;
      dataTO.alchemist = childFields.method.alchemist;
    } else {
      dataTO.selectedFactors = Object.keys(childFields.selectedFactors).map((sfKey: string) => ({
        id: childFields.selectedFactors[sfKey].id,
        sign: childFields.selectedFactors[sfKey].sign === 'over' ? true : false,
      }));
    }

    try {

      const {data: {returnobject:response}} = await request.post(`${API}alchemist/hedgefund`, dataTO);

      let fundsMethods = {},
        tacticalAccordion = [],
        chart = [],
        strategyParams = null,
        combinedParams = [];

      if (isMethodsTabEnabled) {
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

        chart = constructHighchartInputObject(response);
        strategyParams = response.strategy_params;

      } else {
        tacticalAccordion = response.accordion;
        chart = constructTacticalHighchartInputObject(response);
        combinedParams = response.combined_params;
      }


      setResults({
        fundsMethods: fundsMethods,
        tacticalAccordion: tacticalAccordion,
        chart: chart,
        strategyParams: strategyParams,
        combinedParams: combinedParams,
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
          onHandleChangeFundsNumber={handleChangeFundsNumber}
          onHandleChangeMultiple={handleChangeMultiple}
          onHandleChangeSingleSelect={handleChangeSingleSelect}
          onHandleResetInput={handleResetInput}
          onHandleResetResults={handleResetResults}
          handleSubmit={handleSubmit}
        />
      </SidebarWrapper>

      <MainBareWrapper className={classes.main}>
        <MainHeaderWrapper>
          <Heading title="Hedge Funds"/>
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
          {isMethodsTabEnabled
            ? <AccordionTables loading={{className: classes.loader, state: loading}} fundsMethods={results.fundsMethods}/>
            : <TacticalAccordionTables loading={{className: classes.loader, state: loading}} tacticalAccordion={results.tacticalAccordion}/>}
        </Paper>

        <Paper className={classes.Paper}>
          <LineChart
            loading={{className: classes.loader, state: loading}}
            submitted={submitted}
            chart={results.chart}
            isTacticalTabEnabled={!isMethodsTabEnabled}
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

export default withStyles(styles)(HedgeFunds);