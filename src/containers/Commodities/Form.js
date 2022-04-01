import React, {useEffect, useState, useRef} from 'react';
import HeadingSideLine from 'components/HeadingSideLine';
import {Button, Checkbox, FormControl, InputLabel, OutlinedInput, Select, Tooltip, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';
import {request} from 'constants/alias';
import {API} from 'constants/config';
import {convertStringToMachineName} from 'utils/generic';
import {Info as InfoIcon} from '@material-ui/icons';
// import {useSnackbar} from 'notistack';

const styles = theme => ({
  sidebarBoxes: {
    padding: theme.spacing.unit * 2,
  },
  formControl: {
    height: 36,
    display: "flex",
    alignItems: 'center',
  },
  formControlOutlined: {
    width: '100%',
  },
  // disabled: {
  //   cursor: 'no-drop',
  //   opacity: '0.5',
  // },
  headingSideLine: {
    marginBottom: 5,
  },


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
  selectOutlined: {
    height: 40,
    marginTop: 15,
  },
  checkbox: {
    '.disabled &': {
      cursor: 'no-drop',
    },
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
  const commodityDict = useRef({});
  const [commoCategory, setCommoCategory] = useState('');
  const [form, setForm] = useState({
    lists: {
      commodities: [],

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
    if (!((form.ar && form.momentum) || (form.ar && form.trend) || (form.momentum && form.trend) || (form.ar && form.hurst) || (form.momentum && form.hurst) || (form.trend && form.hurst))) {
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
          .get(`${API}alchemistfetcher/markets/commodities`)
          .then(({data: {returnobject: {commodities:lists}}}) => resolve(lists))
          .catch(error => console.log(error));
      })
    );

    Promise.all(listsRequests)
      .then(lists => {
        let commoList = lists[0],
          commodities = {};

        // first create the dictionary object with the category keys
        commoList.forEach(({category, ...other}) => {
          let categoryParsed = convertStringToMachineName(category);
          if (!commodities[categoryParsed]) {
            commodities[categoryParsed] = {
              category: category,
              list: [{...other}],
            };
          } else {
            commodities[categoryParsed].list.push({...other});
          }

          // create commo dict to save the relation between ticker & category
          let {ticker, description} = {...other};
          commodityDict.current[convertStringToMachineName(ticker)] = description;
        });

        setForm({
          ...form,
          lists: {
            ...form.lists,
            commodities: commodities,
          },
        });
      })
      .catch(error => console.log(error));

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

  function handleChangeCategory(event) {
    const value = event.target.value;

    setForm({
      ...form,
      instrument: '',
    });

    setCommoCategory(value);
  }

  function handleSubmit() {
    onHandleSubmit(form, commodityDict.current);
  }

  //RENDER
  let isComboEnabled = (form.ar && form.momentum) || (form.ar && form.trend) || (form.momentum && form.trend) || (form.ar && form.hurst) || (form.momentum && form.hurst) || (form.trend && form.hurst);

  return (
    <form autoComplete="off">
      <div className={classes.sidebarBoxes}>
        <HeadingSideLine title="Select Commodity"/>

        <FormControl variant="outlined" className={classes.formControlOutlined}>
          <InputLabel htmlFor="commo-cat" className={classes.labelOutlined} classes={{
            shrink: classes.labelOutlinedShrink
          }}>Category</InputLabel>
          <Select
            native
            value={commoCategory}
            onChange={handleChangeCategory}
            input={
              <OutlinedInput
                id="commo-cat"
                name="commo-cat"
                labelWidth={64}
                className={classes.selectOutlined}
              />
            }
          >
            <option value=""/>
            {Object.keys(form.lists.commodities)
              .sort()
              .map((catKey, key) => <option key={key}
                                            value={catKey}>{form.lists.commodities[catKey].category}</option>)}
          </Select>
        </FormControl>

        <FormControl variant="outlined" className={classes.formControlOutlined} disabled={commoCategory === ''}>
          <InputLabel htmlFor="instrument" className={classes.labelOutlined} classes={{
            shrink: classes.labelOutlinedShrink
          }}>Commodity</InputLabel>
          <Select
            native
            value={form.instrument}
            onChange={handleChange}
            variant="outlined"
            disabled={commoCategory === ''}
            input={
              <OutlinedInput
                name="instrument"
                labelWidth={65}
                id="instrument"
                className={classes.selectOutlined}
              />
            }
          >
            <option value=""/>
            {commoCategory && form.lists.commodities[commoCategory] && form.lists.commodities[commoCategory].list.map((commodity, key) =>
              <option key={key} value={commodity.ticker}>{commodity.description}</option>)}
          </Select>
        </FormControl>

      </div>

      <div className={classes.sidebarBoxes}>
        <HeadingSideLine title="Methodologies" className={classes.headingSideLine}/>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The methodology uses a combination of statistically significant own past lags as predictors</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classes.formControl}>
            <InputLabel htmlFor="ar" className={classes.label}>Econometric (AR)</InputLabel>
            <Checkbox
              id="ar"
              checked={form.ar}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The methodology examines the existence of long term memory to identify trend or mean reversion dynamics</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classes.formControl}>
            <InputLabel htmlFor="hurst" className={classes.label}>Hurst</InputLabel>
            <Checkbox
                id="hurst"
                checked={form.hurst}
                onChange={handleChange}
            />
          </div>
        </div>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The methodology uses a combination of various lookback and forward looking windows that validate the tendency for strong rising or falling prices. Cases of mean reversion are also included</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classes.formControl}>
            <InputLabel htmlFor="momentum" className={classes.label}>Momentum</InputLabel>
            <Checkbox
              id="momentum"
              checked={form.momentum}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The methodology uses a combination of various past value levels against current price to validate an up- or downtrend. Cases of mean reversion are also included</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classes.formControl}>
            <InputLabel htmlFor="trend" className={classes.label}>Trend</InputLabel>
            <Checkbox
              id="trend"
              checked={form.trend}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The combination of the selected methodologies on an equally-weighted basis</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classnames(classes.formControl, {'disabled': !isComboEnabled})}>
            <InputLabel htmlFor="combo" className={classes.label}>Combined</InputLabel>
            <Checkbox
              id="combo"
              checked={form.combo}
              onChange={handleChange}
              className={classes.checkbox}
              disabled={!isComboEnabled}
            />
          </div>
        </div>

      </div>


      <div className={classes.sidebarBoxes}>
        <HeadingSideLine title="Select Frequency"/>

        <FormControl variant="outlined" className={classes.formControlOutlined}>
          <InputLabel htmlFor="frequency" className={classes.labelOutlined} classes={{
            shrink: classes.labelOutlinedShrink
          }}>Frequency</InputLabel>
          <Select
            native
            value={form.frequency}
            onChange={handleChange}
            input={
              <OutlinedInput
                name="frequency"
                labelWidth={75}
                id="frequency"
                className={classes.selectOutlined}
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
          disabled={loading}
        >
          Run
        </Button>
      </div>
    </form>
  );
}

export default withStyles(styles)(Form);
