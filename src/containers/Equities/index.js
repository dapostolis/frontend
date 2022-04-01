import React, {useEffect, useState} from 'react'
import {withStyles} from '@material-ui/core/styles'
import {request} from 'constants/alias'
import SidebarWrapper from 'components/SidebarWrapper'
import MainHeaderWrapper from 'components/MainHeaderWrapper'
import Heading from 'components/HeadingSingleLine'
import MainBareWrapper from 'components/MainBareWrapper'
import Paper from '@material-ui/core/Paper'
import SelectedFactors from './SelectedFactors'
import DiagnosticsTable from './DiagnosticsTable'
import LineChart from './LineChart'
import {getTime as getTimestamp} from 'date-fns'
import Form from './Form'
import {API} from 'constants/config'
import {useSnackbar} from 'notistack';
import STATIC_LISTS from './static_lists';
import DisclaimerPaper from 'components/DisclaimerPaper';


function convertDateToTimestamp(date) {
  let sDate = date.split(' '); //split date
  let jsDate = new Date(sDate[0], sDate[1]-1, sDate[2], 10, 0, 0);
  return getTimestamp(jsDate);
}

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
  },
});

function Equities({classes}) {
  const {enqueueSnackbar} = useSnackbar();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alchemistMode, setAlchemistMode] = useState(false);
  const [input, setInput] = useState({
    n: 1, // max 30
    regions: [],
    sectors: [],
    market_cap: [],
    benchmark: [],
    ref_currency: '',
    frequency: '',
    esg: false,
    hedged: false,
    shariah: false,
    factors: {
      R: {
        weight: '',
        fields: [],
      },
      M: {
        weight: '',
        fields: [],
      },
      /*S: {
        weight: '',
        fields: [],
      },*/
      V: {
        weight: '',
        fields: [],
      },
      Q: {
        weight: '',
        fields: [],
      },
      I: {
        weight: '',
        fields: [],
      },
      G: {
        weight: '',
        fields: [],
      },
    },
  }); // todo - useReducer to setUnlockWeight
  useEffect(() => {
    let enabledCats = Object.keys(input.factors).filter(cat => input.factors[cat].fields.length > 0);

    if (enabledCats.length > 1) {
      setUnlockWeight(true);
    } else {
      setUnlockWeight(false);
    }
  }, [input.factors]);

  useEffect(() => {
    if (alchemistMode) {
      setFetchLoading(true);

      setInput({
        ...input,
        factors: {
          R: {
            weight: '',
            fields: [],
          },
          M: {
            weight: '',
            fields: [],
          },
          /*S: {
            weight: '',
            fields: [],
          },*/
          V: {
            weight: '',
            fields: [],
          },
          Q: {
            weight: '',
            fields: [],
          },
          I: {
            weight: '',
            fields: [],
          },
          G: {
            weight: '',
            fields: [],
          },
        },
      });

      // setup object
      let dataTO = {
        regions: input.regions,
        sectors: input.sectors,
        market_cap: input.market_cap,
      };

      if (fields.esg) {
        dataTO.esg = input.esg;
      }

      if (fields.shariah) {
        dataTO.shariah = input.shariah;
      }

      request.post(`${API}alchemistfetcher/equities/alchemistmode`, {
        key: JSON.stringify(dataTO)
      })
        .then(({data: {returnobject: {fields}}}) => {
          let RList = [], MList = [], VList = [], GList = [], IList = [], QList = [];

          let weightsDict = {
            RWeight: -1,
            MWeight: -1,
            VWeight: -1,
            QWeight: -1,
            IWeight: -1,
            GWeight: -1
          };
          let enabledCatsArraySymbols = [];

          fields && fields.forEach(field => {
            let newField = {
              id: field.id,
              category: field.category,
              name: field.description,
            };
            switch (field.category) {
              case 'R':
                RList.push(newField);
                break;
              case 'M':
                MList.push(newField);
                break;
              case 'V':
                VList.push(newField);
                break;
              case 'Q':
                QList.push(newField);
                break;
              case 'I':
                IList.push(newField);
                break;
              case 'G':
                GList.push(newField);
                break;
              default:
                console.log('Something went wrong parsing fields to dict');
            }
          });

          let enabledCats = 0;
          if (RList.length > 0) {
            enabledCats++;
            enabledCatsArraySymbols.push('RWeight');
          }
          if (MList.length > 0) {
            enabledCats++;
            enabledCatsArraySymbols.push('MWeight');
          }
          if (VList.length > 0) {
            enabledCats++;
            enabledCatsArraySymbols.push('VWeight');
          }
          if (QList.length > 0) {
            enabledCats++;
            enabledCatsArraySymbols.push('QWeight');
          }
          if (IList.length > 0) {
            enabledCats++;
            enabledCatsArraySymbols.push('IWeight');
          }
          if (GList.length > 0) {
            enabledCats++;
            enabledCatsArraySymbols.push('GWeight');
          }

          let equallyWeightedValue = window.Number((100/enabledCats).toFixed(2));

          if (enabledCats === 1 || enabledCats === 2 || enabledCats === 4 || enabledCats === 5) {
            weightsDict.RWeight = equallyWeightedValue;
            weightsDict.MWeight = equallyWeightedValue;
            weightsDict.VWeight = equallyWeightedValue;
            weightsDict.QWeight = equallyWeightedValue;
            weightsDict.IWeight = equallyWeightedValue;
            weightsDict.GWeight = equallyWeightedValue;
          } else if (enabledCats === 3) {
            for (let i = 0; i < (enabledCatsArraySymbols.length - 1); i++) {
              let weightKey = enabledCatsArraySymbols[i];
              weightsDict[weightKey] = 33;
            }

            weightsDict[enabledCatsArraySymbols[enabledCatsArraySymbols.length-1]] = 34;
          } else if (enabledCats === 6) {
            for (let i = 0; (i < enabledCatsArraySymbols.length - 1); i++) {
              let weightKey = enabledCatsArraySymbols[i];
              weightsDict[weightKey] = 17;
            }

            weightsDict[enabledCatsArraySymbols[enabledCatsArraySymbols.length-1]] = 15;
          }

          setInput({
            ...input,
            factors: {
              R: {
                weight: RList.length > 0 ? weightsDict.RWeight : '',
                fields: RList,
              },
              M: {
                weight: MList.length > 0 ? weightsDict.MWeight : '',
                fields: MList,
              },
              V: {
                weight: VList.length > 0 ? weightsDict.VWeight : '',
                fields: VList,
              },
              Q: {
                weight: QList.length > 0 ? weightsDict.QWeight : '',
                fields: QList,
              },
              I: {
                weight: IList.length > 0 ? weightsDict.IWeight : '',
                fields: IList,
              },
              G: {
                weight: GList.length > 0 ? weightsDict.GWeight : '',
                fields: GList,
              },
            },
          });

          setFetchLoading(false);
        })
        .catch(error => {
          console.log(error);
          setFetchLoading(false);

          enqueueSnackbar('alchemist mode is not available for these input fields. Please try a different selection.', {variant: 'error'});
        });
    }

    // request get alchemist mode factors
  }, [input.regions, input.sectors, input.market_cap, input.esg, input.shariah]);

  const [unlockWeight, setUnlockWeight] = useState(false);
  const [results, setResults] = useState({
    stocks: [],
    chart: {
      data: [],
      legend: {
        sharpe: null,
        annualisedVol: null,
        turnover: null,
        annualisedMean: null,
      },
    },
  });
  const [fields, setFields] = useState({
    /*R: {
      friendlyName: 'Minimum Volatility',
      list: [],
    },
    M: {
      friendlyName: 'Momentum',
      list: [],
    },
    S: {
      friendlyName: 'Sentiment',
      list: [],
    },
    V: {
      friendlyName: 'Value',
      list: [],
    },
    G: {
      friendlyName: 'Growth',
      list: [],
    },
    I: {
      friendlyName: 'Income',
      list: [],
    },
    Q: {
      friendlyName: 'Quality',
      list: [],
    },
    ESG: {
      friendlyName: 'ESG',
      list: [], // Optional. No fields for this category
    },*/
  });
  useEffect(() => {
    fetchInit();
  }, []);


  function fetchInit() {

    setFetchLoading(true);

    request.get(`${API}alchemistfetcher/equities/fields`)
      .then(({data: {returnobject: {fields}}}) => {

        let RList = [], MList = [], SList = [], VList = [], GList = [], IList = [], QList = [];

        fields && fields.forEach(field => {
          let newField = {
            id: field.id,
            category: field.category,
            name: field.description,
          };
          switch (field.category) {
            case 'R':
              RList.push(newField);
              break;
            case 'M':
              MList.push(newField);
              break;
            case 'S':
              SList.push(newField);
              break;
            case 'V':
              VList.push(newField);
              break;
            case 'Q':
              QList.push(newField);
              break;
            case 'I':
              IList.push(newField);
              break;
            case 'G':
              GList.push(newField);
              break;
            default:
              console.log('Something went parsing fields to dict');
          }
        });

        function compareFactors(next, current) {
          let nameA = next.name.toUpperCase();
          let nameB = current.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        }

        // we know in front friendly names
        setFields({
          R: {
            friendlyName: 'Minimum Volatility',
            list: RList.sort(compareFactors),
          },
          M: {
            friendlyName: 'Momentum',
            list: MList.sort(compareFactors),
          },
          /*S: {
            friendlyName: 'Sentiment',
            list: SList.sort(compareFactors),
          },*/
          V: {
            friendlyName: 'Value',
            list: VList.sort(compareFactors),
          },
          Q: {
            friendlyName: 'Quality',
            list: QList.sort(compareFactors),
          },
          I: {
            friendlyName: 'Income',
            list: IList.sort(compareFactors),
          },
          G: {
            friendlyName: 'Growth',
            list: GList.sort(compareFactors),
          },
        });

        setFetchLoading(false);

      })
      .catch(error => {
        console.log(error);
        setFetchLoading(false);
      });

  }

  function handleChangeAlchemistMode(event) {
    setAlchemistMode(event.target.checked);

    if (event.target.checked) {
      setInput({
        ...input,
        market_cap: 'all',
        regions: 'world',
        sectors: 'all',

        factors: {
          R: {
            weight: '',
            fields: [],
          },
          M: {
            weight: '',
            fields: [],
          },
          V: {
            weight: '',
            fields: [],
          },
          Q: {
            weight: '',
            fields: [],
          },
          I: {
            weight: '',
            fields: [],
          },
          G: {
            weight: '',
            fields: [],
          },
        }
      });
    } else {
      // check NON alchemist mode but ESG enabled case
      if (input.esg) {
        setInput({
          ...input,
          market_cap: STATIC_LISTS.market_cap,
          regions: STATIC_LISTS.regions,
          sectors: STATIC_LISTS.sectors,

          factors: {
            R: {
              weight: '',
              fields: [],
            },
            M: {
              weight: '',
              fields: [],
            },
            V: {
              weight: '',
              fields: [],
            },
            Q: {
              weight: '',
              fields: [],
            },
            I: {
              weight: '',
              fields: [],
            },
            G: {
              weight: '',
              fields: [],
            },
          }
        });
      } else {
        setInput({
          ...input,
          market_cap: [],
          regions: [],
          sectors: [],

          factors: {
            R: {
              weight: '',
              fields: [],
            },
            M: {
              weight: '',
              fields: [],
            },
            V: {
              weight: '',
              fields: [],
            },
            Q: {
              weight: '',
              fields: [],
            },
            I: {
              weight: '',
              fields: [],
            },
            G: {
              weight: '',
              fields: [],
            },
          }
        });
      }
    }
  }

  /**
   * Generic handler
   *
   * @param event
   */
  function handleChange(event) {

    const target = event.target,
      {id, type, value, checked} = target;

    let fieldValue = type === 'checkbox' ? checked : value;


    let marketCap = input.market_cap,
      regions = input.regions,
      sectors = input.sectors;
    if (id === 'esg') {

      if (!alchemistMode) {
        // multiselect
        if (input.esg) { // check previous value
          marketCap = [];
          regions = [];
          sectors = [];
        } else {
          marketCap = STATIC_LISTS.market_cap;
          regions = STATIC_LISTS.regions;
          sectors = STATIC_LISTS.sectors;
        }
      } else {
        // single select
        if (input.esg) { // check previous value
          marketCap = 'all';
          regions = 'world';
          sectors = 'all';
        } else {
          marketCap = 'all';
          regions = 'world';
          sectors = 'all';
        }
      }
    }


    setInput({
      ...input,
      market_cap: marketCap,
      regions: regions,
      sectors: sectors,
      [id]: fieldValue,
    });

  }
  function handleChangeSelectAlchemist(event) {

    const target = event.target,
      {id, value} = target;

    setInput({
      ...input,
      [id]: value,
    });

  }

  function handleChangeMultiple({target: {value, name}}) {
    let values = value;

    let currentSelectedValueList = values.map(v => v.value);

    if (name === 'regions') {

      if (input.regions.length === STATIC_LISTS.regions.length && currentSelectedValueList.indexOf('world') === -1) {
        values = [];
      } else if (currentSelectedValueList.indexOf('world') !== -1 && input.regions.map(region => region.value).indexOf('world') === -1) {
        values = STATIC_LISTS.regions;
      } else {
        // filter "world" in case is selected from a previous click
        values = values.filter(region => region.value !== 'world');
      }

      // if every option is selected without using world, then select also world
      if (currentSelectedValueList.indexOf('world') === -1 && values.filter(region => region.value !== 'world').length === (STATIC_LISTS.regions.length-1)) {
        values = STATIC_LISTS.regions;
      }
    }

    if (name === 'sectors') {
      if (input.sectors.length === STATIC_LISTS.sectors.length && currentSelectedValueList.indexOf('all') === -1) {
        values = [];
      } else if (currentSelectedValueList.indexOf('all') !== -1 && input.sectors.map(sector => sector.value).indexOf('all') === -1) {
        values = STATIC_LISTS.sectors;
      } else {
        // filter "all" in case is selected from a previous click
        values = values.filter(sector => sector.value !== 'all');
      }

      // if every option is selected without using all, then select also all
      if (currentSelectedValueList.indexOf('all') === -1 && values.filter(sector => sector.value !== 'all').length === (STATIC_LISTS.sectors.length-1)) {
        values = STATIC_LISTS.sectors;
      }
    }

    if (name === 'market_cap') {
      if (input.market_cap.length === STATIC_LISTS.market_cap.length && currentSelectedValueList.indexOf('all') === -1) {
        values = [];
      } else if (currentSelectedValueList.indexOf('all') !== -1 && input.market_cap.map(mc => mc.value).indexOf('all') === -1) {
        values = STATIC_LISTS.market_cap;
      } else {
        // filter "all" in case is selected from a previous click
        values = values.filter(mc => mc.value !== 'all');
      }

      // if every option is selected without using all, then select also all
      if (currentSelectedValueList.indexOf('all') === -1 && values.filter(mc => mc.value !== 'all').length === (STATIC_LISTS.market_cap.length-1)) {
        values = STATIC_LISTS.market_cap;
      }
    }

    setInput({
      ...input,
      [name]: values,
    });
  }

  function handleChangeStocks({target: {value}}) {
    let pValue = parseInt(value);

    if (value !== '' && (isNaN(pValue) || (pValue < 1 || pValue > 30))) {
      return false;
    }

    setInput({
      ...input,
      n: isNaN(pValue) ? '' : pValue,
    })
  }

  function handleChangeFields({target: {value, name}}) {

    let factors = input.factors;

    let cat_factors = Object.keys(input.factors),
      enabledCats = cat_factors.filter(cat => input.factors[cat].fields.length > 0);

    // Conditionals
    let noCategoryEnabledAndUserHasSelectedField = enabledCats.length === 0 && value.length > 0;
    let oneCategoryEnabledAndUserWantsToDisableThisCategory = enabledCats.length === 1 && value.length === 0;
    let twoCategoriesEnabledAndUserWantsToDisableOneOfThem = enabledCats.length === 2 && value.length === 0;
    let moreThanTwoCategoriesEnabledAndUserDisableOneOfThem = enabledCats.length > 2 && value.length === 0;

    if (noCategoryEnabledAndUserHasSelectedField) {

      factors = {
        ...factors,
        [name]: {
          ...factors[name],
          fields: value,
          weight: 100,
        }
      };

    } else if (oneCategoryEnabledAndUserWantsToDisableThisCategory) {

      factors = {
        ...factors,
        [name]: {
          ...factors[name],
          fields: value,
          weight: '',
        }
      };

    } else if (twoCategoriesEnabledAndUserWantsToDisableOneOfThem) {

      Object.keys(factors).forEach(cat => {
        if (cat === name) {
          factors[cat].weight = '';
          factors[cat].fields = value;
        } else if (cat !== name && factors[cat].fields.length > 0) {
          factors[cat].weight = 100;
          setUnlockWeight(false);
        }
      });

    } else if (moreThanTwoCategoriesEnabledAndUserDisableOneOfThem) {

      Object.keys(factors).forEach(cat => {
        if (cat === name) {
          factors[cat].weight = '';
          factors[cat].fields = value;
        }
      });

    } else {

      // In this case there is no need to handle weights.
      // This conditional is enabled when a user enables/disables a field but not a whole category.

      factors = {
        ...factors,
        [name]: {
          ...factors[name],
          fields: value,
        }
      };

    }


    setInput({
      ...input,
      factors: factors,
    });

  }

  function handleClickResetFields(cat) {

    let cat_factors = Object.keys(input.factors),
      factors = input.factors;

    let enabledCats = cat_factors.filter(cat => input.factors[cat].fields.length > 0);

    // two categories are enabled, so disable the selected category and set the weight of the last one to 100
    if (enabledCats.length === 2) {

      cat_factors.forEach(prevCat => {
        if (cat === prevCat) {
          factors[cat].weight = '';
          factors[cat].fields = [];
        } else if (cat !== prevCat && factors[prevCat].fields.length > 0) {
          factors[prevCat].weight = 100;
          setUnlockWeight(false);
        }
      });

    } else {

      factors = {
        ...factors,
        [cat]: {
          weight: '',
          fields: [],
        },
      };

    }

    setInput({
      ...input,
      factors: factors,
    });

  }

  function handleChangeFieldWeight(event) {
    let {target: {name, value}} = event,
      parsedValue = '';

    // extract category from name attribute
    let cat = name.split('-')[0];

    // validate value if it's number
    if (Boolean(value)) {
      parsedValue = parseInt(value);

      if (isNaN(parsedValue) || parsedValue <= 0 || parsedValue > 100) {
        console.log('Weight isNaN or 0 or > 100');
        return;
      }
    }

    setInput({
      ...input,
      factors: {
        ...input.factors,
        [cat]: {
          ...input.factors[cat],
          weight: parsedValue,
        },
      },
    });
  }

  async function handleSubmit(event, combo = false) {
    event.preventDefault();

    let cat_factors = Object.keys(input.factors);

    //VALIDATION
    if (input.n <= 0 || input.n > 30) {
      enqueueSnackbar('"Stocks" field is required with a maximum value of 30 stocks', {variant: 'error'});
      return;
    }

    if (!input.frequency) {
      enqueueSnackbar('"Rebalancing Frequency" field is required', {variant: 'error'});
      return;
    }

    if (!input.ref_currency) {
      enqueueSnackbar('"Reference Currency" field is required', {variant: 'error'});
      return;
    }

    // factors fields max selected 10
    if (!alchemistMode) {
      let countFields = 0;
      cat_factors.forEach(cat => {
        countFields += input.factors[cat].fields.length;
      });

      if (countFields > 10) {
        enqueueSnackbar('Only ten factor fields can be selected', {variant: 'error'});
        return;
      }
    }

    // check weights
    let enabledCats = cat_factors.filter(cat => input.factors[cat].fields.length > 0);

    let weightsAdd = 100;
    if (enabledCats.length > 1) {
      weightsAdd = enabledCats.map(cat => ({weight: input.factors[cat].weight})).reduce((accumulator, {weight: currentValue}) => {
        return accumulator + currentValue;
      }, 0);
    }

    if (weightsAdd !== 100) {
      enqueueSnackbar('Total sum of weights must be 100%. Please change weights and retry', {variant: 'error'});
      return;
    }
    //EoVALIDATION


    // Setup transfer objects
    let catWeightsTO = [], fieldsTO = [];

    cat_factors.map(cat => {
      let catObject = input.factors[cat];
      if (catObject.fields.length > 0) {

        catWeightsTO.push({
          category: cat,
          weight: catObject.weight,
        });

        let fieldsParsedTO = catObject.fields.map(({id}) => ({id})); // List<Object> where object={id:xx}
        fieldsTO = fieldsTO.concat(fieldsParsedTO);

      }
    });
    if (catWeightsTO.length === 1) {
      catWeightsTO[0].weight = 100;
    }


    let marketCapTO = [], regionsTO = [], sectorsTO = [];

    if (!alchemistMode) {

      marketCapTO = input.market_cap.map(mcap => mcap.value);
      if (marketCapTO.indexOf('all') !== -1) {
        marketCapTO = [];
      }

      regionsTO = input.regions.map(region => region.value);
      if (regionsTO.length === 0 || regionsTO.indexOf('world') !== -1) {
        regionsTO = ['world'];
      }

      sectorsTO = input.sectors.map(sector => sector.value);
      if (sectorsTO.indexOf('all') !== -1) {
        sectorsTO = [];
      }

    } else {

      marketCapTO = [input.market_cap];
      if (input.market_cap === 'all') {
        // marketCapTO = STATIC_LISTS.market_cap
        //   .filter(mcap => mcap.value !== 'all')
        //   .map(mcap => mcap.value);
        marketCapTO = [];
      }

      regionsTO = [input.regions];
      if (input.regions === 'world') {
        regionsTO = ['world'];
      }

      sectorsTO = [input.sectors];
      if (input.sectors === 'all') {
        sectorsTO = [];
      }

    }

    try {
      // extra validation after enumerating factors
      if (!combo && !catWeightsTO.length) {
        enqueueSnackbar('At least one Factor must be selected', {variant: 'info'});
        throw 'At least one Factor must be selected';
      }

      setLoading(true);

      let data = {
        'combo': combo,
        'n': input.n, //10,
        'regions': regionsTO,
        'sectors': sectorsTO,
        'market_cap': marketCapTO,
        'benchmark': regionsTO, // same with regions
        'ref_currency': input.ref_currency, //"USD",
        'frequency': input.frequency, //"M",
        'fields': fieldsTO,
        'cat_weights': catWeightsTO,
        'esg': input.esg ? 1 : 0,
        'shariah': input.shariah ? 1 : 0,
        'hedged': input.hedged,
      };


      const {data: {returnobject:results}} = await request.post(`${API}alchemist/equity`, data);

      // CREATE_CHARTS
      let chartData = [];

      let chartPerf = results.returns.filter(r => r.label === 'Portfolio Performance').map(r => ([convertDateToTimestamp(r.time), r.value]));
      chartData.push({
        name: 'Portfolio',
        data: chartPerf,
      });


      window.Array.isArray(input.regions) && input.regions.length > 0 && input.regions.forEach(({value}) => {
        let filteredRegionReturns = results.returns
          .filter(r => r.label === value.toUpperCase() + ' Benchmark Performance')
          .map(r => [convertDateToTimestamp(r.time), r.value]);

        let chartName = value.toUpperCase() === 'WORLD' ? 'World' : value.toUpperCase();

        if (chartName === 'UK') {
          chartName = 'UK100';
        } else if (chartName === 'US') {
          chartName = 'SP500'
        } else if (chartName === 'EU') {
          chartName = 'Eurostoxx'
        } else if (chartName == 'CH') {
          chartName = 'SMI'
        }

        if (filteredRegionReturns.length > 0) {
          chartData.push({
            name: chartName,
            data: filteredRegionReturns,
          });
        }
      });

      if (window.Array.isArray(input.regions) && input.regions.length === 0) {
        let filteredRegionReturns = results.returns
          .filter(r => r.label === 'World'.toUpperCase() + ' Benchmark Performance')
          .map(r => [convertDateToTimestamp(r.time), r.value]);

        if (filteredRegionReturns.length > 0) {
          chartData.push({
            name: 'world'.toUpperCase() === 'WORLD' ? 'World' : 'world'.toUpperCase(),
            data: filteredRegionReturns,
          });
        }
      }

      if (!window.Array.isArray(input.regions)) {
        let filteredRegionReturns = results.returns
          .filter(r => r.label === input.regions.toUpperCase() + ' Benchmark Performance')
          .map(r => [convertDateToTimestamp(r.time), r.value]);

        let chartName = input.regions.toUpperCase() === 'WORLD' ? 'World' : input.regions.toUpperCase();

        if (chartName === 'UK') {
          chartName = 'UK100';
        } else if (chartName === 'US') {
          chartName = 'SP500'
        } else if (chartName === 'EU') {
          chartName = 'Eurostoxx'
        } else if (chartName == 'CH') {
          chartName = 'SMI'
        }

        if (filteredRegionReturns.length > 0) {
          chartData.push({
            name: chartName,
            data: filteredRegionReturns,
          });
        }
      }

      if (input.esg) {
        let filteredESGReturns = results.returns
          .filter(r => r.label === 'ESG Benchmark Performance')
          .map(r => [convertDateToTimestamp(r.time), r.value]);

        chartData.push({
          name: 'ESG',
          data: filteredESGReturns,
        });
      }

      if (window.Array.isArray(input.sectors) && input.sectors.length === 1) {
        let sectorName = input.sectors[0].name;

        let filteredSectorReturns = results.returns
          .filter(r => r.label === sectorName.toUpperCase() + ' Benchmark Performance')
          .map(r => [convertDateToTimestamp(r.time), r.value]);

        chartData.push({
          name: sectorName,
          data: filteredSectorReturns,
        });
      }

      if (!window.Array.isArray(input.sectors) && input.sectors !== 'all') {
        let filteredSectorReturns = results.returns
          .filter(r => r.label === input.sectors.toUpperCase() + ' Benchmark Performance')
          .map(r => [convertDateToTimestamp(r.time), r.value]);

        chartData.push({
          name: input.sectors,
          data: filteredSectorReturns,
        });
      }
      // EoCREATE_CHARTS


      setResults({
        stocks: results.stocks,
        chart: {
          data: chartData,
          legend: {
            sharpe: results.sharpe,
            annualisedVol: results.annualisedVol*100,
            turnover: results.turnover,
            annualisedMean: results.annualisedMean*100,
          },
        },
      });
    } catch (ex) {
      console.error(ex);
      //reset results page
      setResults({
        stocks: [],
        chart: {
          data: [],
          legend: {
            sharpe: null,
            annualisedVol: null,
            turnover: null,
            annualisedMean: null,
          },
        },
      });
    }

    setLoading(false);

  }

  function handleReset() {
    if (!alchemistMode) {
      setInput({
        n: 1, // max 30
        regions: [],
        sectors: [],
        market_cap: [],
        benchmark: [],
        ref_currency: '',
        frequency: '',
        esg: false,
        hedged: false,
        shariah: false,
        factors: {
          R: {
            weight: '',
            fields: [],
          },
          M: {
            weight: '',
            fields: [],
          },
          V: {
            weight: '',
            fields: [],
          },
          Q: {
            weight: '',
            fields: [],
          },
          I: {
            weight: '',
            fields: [],
          },
          G: {
            weight: '',
            fields: [],
          },
        },
      });
    } else {
      setInput({
        ...input,
        n: 1, // max 30
        market_cap: 'all',
        regions: 'world',
        sectors: 'all',
        benchmark: [],
        ref_currency: '',
        frequency: '',
        esg: false,
        hedged: false,
        shariah: false,
      });
    }
  }


  //RENDER
  let selectedFactors = [];
  Object.keys(input.factors).map(cat => {
    let catObject = input.factors[cat];
    if (catObject.fields.length > 0) {
      selectedFactors = selectedFactors.concat(catObject.fields);
    }
  });

  return (
    <div className={classes.container}>

      <div id="sidebar-bg"></div>

      <SidebarWrapper className={classes.sidebar}>

        <Form
          STATIC_LISTS={STATIC_LISTS}
          input={input}
          unlockWeight={unlockWeight}
          fields={fields}
          fetchLoading={fetchLoading}
          loading={loading}
          alchemistMode={alchemistMode}
          handleChangeAlchemistMode={handleChangeAlchemistMode}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleReset={handleReset}
          handleClickResetFields={handleClickResetFields}
          handleChangeFields={handleChangeFields}
          handleChangeFieldWeight={handleChangeFieldWeight}
          handleChangeMultiple={handleChangeMultiple}
          handleChangeStocks={handleChangeStocks}
          handleChangeSelectAlchemist={handleChangeSelectAlchemist}
        />

      </SidebarWrapper>

      <MainBareWrapper className={classes.main}>

        <MainHeaderWrapper>
          <Heading title="Equities"/>
        </MainHeaderWrapper>

        <Paper className={classes.Paper}>
          <SelectedFactors fields={fields} input={input} unlockWeight={unlockWeight}/>
        </Paper>

        <Paper className={classes.Paper}>
          <DiagnosticsTable
            loading={{className: classes.loader, state: loading}}
            stocks={results.stocks}
          />
        </Paper>

        <Paper className={classes.Paper}>
          <LineChart
            loading={{className: classes.loader, state: loading}}
            chart={results.chart}
          />
        </Paper>

        <Paper className={classes.Paper}>
          <DisclaimerPaper/>
        </Paper>

      </MainBareWrapper>

    </div>
  )
}

export default withStyles(styles)(Equities)
