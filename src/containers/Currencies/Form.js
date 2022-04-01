import React, {useEffect, useState} from 'react';
import HeadingSideLine from 'components/HeadingSideLine';
import {Button, Checkbox, FormControl, InputLabel, OutlinedInput, Select, Tooltip, Typography} from '@material-ui/core';
import {request} from 'constants/alias';
import {API} from 'constants/config';
import {convertStringToMachineName} from 'utils/generic';
import {withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';
import Loader from 'components/LoaderCircle';
import {useSnackbar} from 'notistack';
import {Info as InfoIcon} from '@material-ui/icons';

const styles = theme => ({
  sidebarBoxes: {
    padding: theme.spacing.unit * 2,
  },
  formControl: {
    display: "flex",
    alignItems: 'center',
    height: 36,
  },
  formControlOutlined: {
    width: '100%',
  },
  // disabled: {
  //   cursor: 'no-drop',
  //   opacity: '0.5',
  // },
  label: {
    minWidth: 135,
    display: 'inline-block',
    cursor: 'pointer',
    color: 'black',

    '.disabled &': {
      cursor: 'no-drop',
    },
  },
  labelOutlined: {
    transform: 'translate(14px, 26px) scale(1)',
  },
  labelOutlinedShrink: {
    transform: 'translate(14px, 10px) scale(0.75) !important',
  },
  // select: {
  //   border: '1px solid red',
  //
  //   '.disabled &': {
  //     cursor: 'no-drop',
  //   },
  // },
  selectOutlined: {
    height: 40,
    marginTop: 15,

    '.disabled &, .disabled & select': {
      cursor: 'no-drop',
    },
  },
  // checkbox: {
  //   '.disabled &': {
  //     cursor: 'no-drop',
  //   },
  // },

  headingSideLine: {
    marginBottom: 5,
  },

  loader: {
    width: 'auto',
    top: 50,
    left: 16,
  },
  currencyBox: {
    minHeight: 300,
  },

  flexFieldWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  infoIcon: {
    color: theme.palette.secondary.main,
    cursor: 'pointer',
    marginRight: 7,
    opacity: 0.6,
  },

  tooltipTypo: {
    color: 'white',
  },
});

function Form({classes, loading, onHandleSubmit}) {
  // use this state only if we want to disable the other fields
  // const [currencyCategory, setCurrencyCategory] = useState(''); // store the category of the selected currency
  const {enqueueSnackbar} = useSnackbar();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [form, setForm] = useState({
    lists: {
      currencies: {},
      cryptocurrencies: [],

      frequencies: [
        {
          value: 'W',
          label: 'Weekly',
        },
        {
          value: 'M',
          label: 'Monthly',
        },
        // {
        //   value: 'Q',
        //   label: 'Quarterly',
        // },
      ]
    },

    instrument: '',

    combo: false,
    ar: false,
    momentum: false,
    trend: false,
    hurst: false,

    frequency: '',
  });
  useEffect(() => {
    fetcher();
  }, []);

  // todo - use reducer to support combo's business logic. For now this solution is perfect
  useEffect(() => {
    if (!((form.ar && form.momentum) || (form.ar && form.trend) || (form.momentum && form.trend) || (form.ar && form.hurst) || (form.momentum && form.hurst) || (form.hurst && form.trend))) {
      setForm({
        ...form,
        combo: false,
      })
    }
  }, [form.ar, form.momentum, form.trend, form.hurst])

  function fetcher() {

    let listsRequests = [];

    listsRequests.push(
      new Promise((resolve, reject) => {
        request
          .get(`${API}alchemistfetcher/markets/currencies`)
          .then(({data: {returnobject: {currencies:lists}}}) => resolve(lists))
          .catch(error => reject(error));
      })
    );

    Promise.all(listsRequests)
      .then(lists => {
        let curList = lists[0],
          currencies = {};

        // keep a reference of a dictionary object for cryptos for later enumeration
        Form.cryptocurrencies = {};

        // Fill the currencies object
        curList.forEach(({category, ...other}) => {
          let categoryParsed = convertStringToMachineName(category);

          // HACK - Business logic only for Cryptocurrencies
          if (category === 'Cryptocurrencies') {
            Form.cryptocurrencies[other.ticker] = {category, ...other};
          }

          if (!(categoryParsed in currencies)) {

            currencies[categoryParsed] = {
              category: category,
              currency: {},
            }

          }

          // Currency category. Example, EUR, USD etc
          let curCat = other.ticker.slice(0, 3);

          if (!(curCat in currencies[categoryParsed].currency)) {
            currencies[categoryParsed].currency[curCat] = [];
          }

          currencies[categoryParsed] = {
            category: category,
            currency: {
              ...currencies[categoryParsed].currency,
              [curCat]: [
                ...currencies[categoryParsed].currency[curCat],
                {...other},
              ]
            },
          };

        });

        setForm({
          ...form,
          lists: {
            ...form.lists,
            currencies: currencies,
          }
        });

        setFetchLoading(false);

      })
      .catch(error => {
        setFetchLoading(false);
        enqueueSnackbar('No currencies fetched. If this error persists, please contact your system administrator', {variant: 'error'});
        console.log(error);
      });

  }

  /**
   * If function parameter is provided, isCryptoSelected will instantly check if the crypto is selected
   */
  function isCryptoSelected(instrument) {
    let prevStateInstrument = form.instrument;
    let ticker = instrument ? instrument : prevStateInstrument;

    if ('cryptocurrencies' in Form) {
      return window.Boolean(Form.cryptocurrencies[ticker]);
    }
    return false;
  }

  function handleChangeCurrency(event) {
    const target = event.target,
      {id, value} = target;

    // let category = id.split('-')[1];
    // setCurrencyCategory(category);

    if (isCryptoSelected(value)) {

      setForm({
        ...form,

        instrument: value,

        combo: false,
        ar: false,
        momentum: true,
        trend: false,
        hurst: false,

        frequency: 'W',
      });

    } else if (isCryptoSelected()) {

      setForm({
        ...form,

        instrument: value,

        combo: false,
        ar: false,
        momentum: false,
        trend: false,
        hurst: false,

        frequency: '',

      });

    } else {

      setForm({
        ...form,
        instrument: value,
      });

    }

  }

  function handleChange(event) {
    const target = event.target,
      {id, type, value, checked} = target;

    let fieldValue = type === 'checkbox' ? checked : value;

    setForm({
      ...form,
      [id]: fieldValue,
    });
  }

  function handleSubmit() {
    onHandleSubmit(form);
  }


  //RENDER
  let isComboEnabled = (form.ar && form.momentum) || (form.ar && form.trend) || (form.momentum && form.trend) || (form.ar && form.hurst) || (form.momentum && form.hurst) || (form.trend && form.hurst);

  let {currencies} = form.lists;

  return (
    <form autoComplete="off">

      <div className={classnames(classes.sidebarBoxes, classes.currencyBox)}>
        <HeadingSideLine title="Select Currency"/>

        {fetchLoading ? <Loader className={classes.loader} start={true} size="small"/> : ''}

        {!fetchLoading && JSON.stringify(currencies) === '{}' ? <Typography style={{marginTop: 10}}>NO_CUR_FETCHED</Typography> : ''}

        {!fetchLoading && Object.keys(currencies).map(cat =>
          <FormControl key={cat} variant="outlined" className={classes.formControlOutlined}> {/*disabled={form.instrument && cat !== currencyCategory}*/}
            <InputLabel htmlFor="instrument" className={classes.labelOutlined} classes={{
              shrink: classes.labelOutlinedShrink
            }}>{currencies[cat].category}</InputLabel>
            <Select
              native
              value={form.instrument}
              onChange={handleChangeCurrency}
              variant="outlined"
              // disabled={form.instrument && cat !== currencyCategory}
              input={
                <OutlinedInput
                  name="instrument"
                  labelWidth={currencies[cat].category.length*8}
                  id={'instrument-' + cat}
                  className={classes.selectOutlined}
                />
              }
            >

              <option value=""/>
              {Object.keys(currencies[cat].currency).map((curCat, i) =>
                <>
                  {cat !== 'cryptocurrencies' ?
                    <optgroup key={curCat + i} label={curCat}>
                      {currencies[cat].currency[curCat].map((currency, tKey) =>
                        <option key={'tic-' + tKey} value={currency.ticker}>{currency.description}</option>
                      )}
                    </optgroup>
                    : <>{currencies[cat].currency[curCat].map((currency, tKey) => <option key={'tic-' + (i+tKey)}
                                                                                          value={currency.ticker}>{currency.description}</option>)}</>
                  }
                </>
              )}

            </Select>
          </FormControl>
        )}
      </div>

      <div className={classes.sidebarBoxes}>
        <HeadingSideLine title="Methodologies" className={classes.headingSideLine}/>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The methodology uses a combination of statistically significant own past lags as predictors</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classnames(classes.formControl, {'disabled': isCryptoSelected()})}>
            <InputLabel htmlFor="ar" className={classes.label}>Econometric (AR)</InputLabel>
            <Checkbox
              id="ar"
              checked={form.ar}
              onChange={handleChange}
              disabled={isCryptoSelected()}
            />
          </div>
        </div>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The methodology examines the existence of long term memory to identify trend or mean reversion dynamics</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classnames(classes.formControl, {'disabled': isCryptoSelected()})}>
            <InputLabel htmlFor="hurst" className={classes.label}>Hurst</InputLabel>
            <Checkbox
                id="hurst"
                checked={form.hurst}
                onChange={handleChange}
                disabled={isCryptoSelected()}
            />
          </div>
        </div>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The methodology uses a combination of various lookback and forward looking windows that validate the tendency for strong rising or falling prices. Cases of mean reversion are also included</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classnames(classes.formControl, {'disabled': isCryptoSelected()})}>
            <InputLabel htmlFor="momentum" className={classes.label}>Momentum</InputLabel>
            <Checkbox
              id="momentum"
              checked={form.momentum}
              onChange={handleChange}
              disabled={isCryptoSelected()}
            />
          </div>
        </div>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The methodology uses a combination of various past value levels against current price to validate an up- or downtrend. Cases of mean reversion are also included</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classnames(classes.formControl, {'disabled': isCryptoSelected()})}>
            <InputLabel htmlFor="trend" className={classes.label}>Trend</InputLabel>
            <Checkbox
              id="trend"
              checked={form.trend}
              onChange={handleChange}
              disabled={isCryptoSelected()}
            />
          </div>
        </div>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The combination of the selected methodologies on an equally-weighted basis</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classnames(classes.formControl, {'disabled': !isComboEnabled || isCryptoSelected()})}>
            <InputLabel htmlFor="combo" className={classes.label}>Combined</InputLabel>
            <Checkbox
              id="combo"
              checked={form.combo}
              onChange={handleChange}
              // className={classes.checkbox}
              disabled={!isComboEnabled || isCryptoSelected()}
            />
          </div>
        </div>

      </div>


      <div className={classes.sidebarBoxes}>
        <HeadingSideLine title="Select Frequency"/>

        <FormControl variant="outlined" className={classnames(classes.formControlOutlined, {'disabled': isCryptoSelected()})}>
          <InputLabel htmlFor="frequency" className={classes.labelOutlined} classes={{
            shrink: classes.labelOutlinedShrink
          }}>Frequency</InputLabel>
          <Select
            native
            value={form.frequency}
            onChange={handleChange}
            // className={classes.select}
            input={
              <OutlinedInput
                name="frequency"
                labelWidth={75}
                id="frequency"
                className={classes.selectOutlined}
                disabled={isCryptoSelected()}
              />
            }
          >
            <option value=""/>
            {form.lists.frequencies && form.lists.frequencies.map((frequency, i) => <option key={i} value={frequency.value}>{frequency.label}</option>)}
          </Select>
        </FormControl>
      </div>

      <div className={classes.sidebarBoxes}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          disabled={loading || JSON.stringify(currencies) === '{}'}
        >
          Run
        </Button>
      </div>

    </form>
  );
}

export default withStyles(styles)(Form);
