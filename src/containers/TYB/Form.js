import React, {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Input,
  InputAdornment,
  Tooltip,
  Typography
} from '@material-ui/core';
import {Add as AddIcon, Remove as RemoveIcon, Clear as ClearIcon, Search as SearchIcon} from '@material-ui/icons';
import classnames from 'classnames';
import MenuItem from '@material-ui/core/MenuItem';
import {request} from 'constants/alias';
import {API} from 'constants/config';
import HeadingSideLine from '../../components/HeadingSideLine';
import Fab from '@material-ui/core/Fab';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import {useSnackbar} from 'notistack';
import InfoBox from 'components/InfoBox';
import {convertStringToMachineName} from '../../utils/generic';
import Loader from 'components/LoaderCircle';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const assetClassList = ['Equity', 'ETF', 'Fund'];

const styles = theme => ({
  form: {
    position: 'sticky',
    // height: 'calc(100vh - 185px)',
    height: 'calc(100vh - 90px)',
    top: 64,
    overflowY: 'auto',
    paddingTop: 10,
  },

  loader: {
    top: 40,
    left: 0,
  },

  popover: {
    pointerEvents: 'none',
  },

  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },

  flat: {
    boxShadow: 'none',
  },

  gapContainer: {
    position: 'relative',
    margin: `15px ${theme.spacing.unit * 2}px 0 ${theme.spacing.unit * 2}px`,
    '&.disabled': {
      cursor: 'no-drop',
      opacity: 0.5,
    },
  },

  portfolioContainer: {
    border: '1px dotted ' + theme.palette.primary.main,
    padding: 10,
    marginTop: 15,
  },

  kvContainer: {
    display: 'flex',
    marginTop: 12,

    '& > div': {
      marginRight: theme.spacing.unit,
    },
    '& > div:last-child': {
      marginRight: 0,
    }
  },

  noIsinInfoBox: {
    marginTop: 15,
  },

  alModeInfoBox: {
    fontSize: 13,
  },

  // autocomplete
  autoRoot: {
    flexGrow: 1,
    height: 250,
  },
  autoContainer: {
    flexGrow: 1,
    position: 'relative',
  },
  autoPaper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  autoInputRoot: {
    flexWrap: 'wrap',
  },
  autoInputInput: {
    width: 'auto',
    flexGrow: 1,
  },


  titleSideLine: {
    fontSize: 16,
    margin: '30px 0 10px 0',
  },

  formControl: {
    // marginRight: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    // marginLeft: theme.spacing.unit * 2,
  },

  searchContainer: {
    display: 'flex',
    marginBottom: 15,

    '& > *': {
      marginRight: theme.spacing.unit,
    },
    '& > *:last-child': {
      marginRight: 0,
    }
  },
  verticalIcon: {
    display: 'inline-block',
    alignItems: 'center',
    marginLeft: 106,

    '&.disabled': {
      cursor: 'no-drop',
    },
  },
  addFieldFab: {
    color: theme.palette.getContrastText(theme.palette.secondary.main),
    backgroundColor: theme.palette.secondary.main,
    opacity: 0.8,

    '&:hover': {
      color: theme.palette.getContrastText(theme.palette.secondary.main),
      backgroundColor: theme.palette.secondary.main,
      opacity: 1,
    },

    '&.animate .arrow-import': {
      animation: 'upDown 0.8s infinite',
    },
    '&.animate:hover .arrow-import': {
      animation: 'none',
    },
  },

  // Inline fields
  fabsContainer: {
    display: 'flex',
  },
  formControlIcon: {
    width: 30,
    // marginLeft: 10,
    marginTop: 8,

    '&:last-child': {
      width: 'auto',
    },
  },
  smallFieldFab: {
    width: 21,
    height: 21,
    minHeight: 'auto',
  },
  smallFieldIcon: {
    width: 15,
    height: 15,
  },
  removeFieldFab: {
    color: theme.palette.getContrastText(theme.palette.danger.light),
    backgroundColor: theme.palette.danger.light,

    '&:hover': {
      color: theme.palette.getContrastText(theme.palette.danger.main),
      backgroundColor: theme.palette.danger.main,
    },
  },

  formControlLeft: {
    width: '100%',
    // marginRight: theme.spacing.unit * 2,
  },
  formControlRight: {
    width: 70,
    // marginRight: 10,

    '& input': {
      textAlign: 'right',
    },
  },

  formControlWeight: {
    width: 100,
  },

  inputFullWidth: {
    width: 'calc(100% - 25px)',
  },

  withoutLabel: {
    marginTop: theme.spacing.unit * 2,
  },

  ButtonWrap: {
    // marginBottom: 30,
    marginTop: 20,
  },
  floatButtonWrap: {
    // position: 'fixed',
    position: 'sticky',
    // bottom: 15,
    bottom: 0,
    width: 350,
    padding: '20px 0',
    // borderTop: '1px solid ' + theme.palette.primary.light,
    backgroundColor: 'white',
  },
  Button: {
    marginLeft: theme.spacing.unit * 2,
  },
  ButtonSmall: {
    minWidth: 40,
    marginRight: 10,
  },


  alModeContainer: {
    textAlign: 'center',
    padding: theme.spacing.unit,
    borderTop: '1px solid ' + theme.palette.primary.main,
    borderBottom: '1px solid ' + theme.palette.primary.main,
  },

  points: {
    textAlign: 'center',
    borderLeft: '1px solid ' + theme.palette.primary.main,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: theme.spacing.unit,
    borderRadius: 2,
  },

  infoTooltip: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
    // maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
    '& b': {
      fontWeight: theme.typography.fontWeightMedium,
    },
  },

  // menu list categories
  listCategory: {
    paddingLeft: theme.spacing.unit,
    fontWeight: 'bold',
  },

  innerTitle: {
    fontSize: 17,
  },

  isinInput: {
    paddingLeft: 3,
    '&:hover': {
      backgroundColor: '#fafafa',
    },
  },

  inlineField: {
    display: 'flex',
    alignItems: 'center',

    '& > *': {
      marginRight: 10,
    },
    '& > *:last-child': {
      marginRight: 0,
    },
  },

  inlineButton: {
    height: 36,
    marginTop: 12,
  },
});

function Form({classes, loading, onHandleResetResults, onHandleSubmit}) {
  const {enqueueSnackbar} = useSnackbar();
  const [search, setSearch] = useState({
    loading: false,
    isin: '', // Help: US0378331005 | US02079K1079
    assetClass: '', // e.g. "Equity"
    isinData: null,
  });
  const [fields, setFields] = useState({
    isins: [
      // {variable: '', pointsInMonths: '', pointsInYears: '', weight: ''},
    ],
    factors: {
      equities: [],
      fixedincome: [],
      commodities: [],
      currencies: [],
      alternatives: [],
      sectors: [],
    },
  });
  const [alchemistMode, setAlchemistMode] = useState(false);
  const [anchorImport, setAnchorImport] = useState(null);
  const [lists, setLists] = useState({
    factors: {},
  });
  const [fetchLoading, setFetchLoading] = useState(true);
  useEffect(() => {
    fetchInit();
  }, []);

  function fetchInit() {

    function getFactors() {
      return request.get(`${API}alchemistfetcher/tyb/factors`);
    }

    request.all([getFactors()])
      .then(request.spread(function ({data: {returnobject: {factors}}}) {

        let parsedFactors = {
          equities: {
            name: 'Equities',
            list: [],
          },
          fixedincome: {
            name: 'Fixed Income',
            list: [],
          },
          commodities: {
            name: 'Commodities',
            list: [],
          },
          currencies: {
            name: 'Currencies',
            list: [],
          },
          alternatives: {
            name: 'Alternatives',
            list: [],
          },
          sectors: {
            name: 'Sectors',
            list: [],
          },
        };

        // parse factors
        factors.forEach(factor => {
          let cat = convertStringToMachineName(factor.category);
          parsedFactors[cat].list.push({
            parsedCat: cat,
            ...factor
          });
        });

        setLists({
          factors: parsedFactors,
        });

        setFetchLoading(false);
      }))
      .catch(e => {
        console.log(e);
        enqueueSnackbar('Something went wrong. Please contact your system administrator', {variant: 'error'});
        setFetchLoading(false);
      });
  }

  function handlePopoverOpen(event) {
    setAnchorImport(event.currentTarget);
  }

  function handlePopoverClose() {
    setAnchorImport(null);
  }

  function handleChangeAlchemistMode(event) {
    setAlchemistMode(event.target.checked);
    setFields({
      ...fields,
      factors: {
        equities: [],
        fixedincome: [],
        commodities: [],
        currencies: [],
        alternatives: [],
        sectors: [],
      },
    });
  }

  function handleChangeSearch(event) {
    let name = event.target.name;

    setSearch({
      ...search,
      [name]: event.target.value,
      isinData: null,
    });
  }

  function handleChangeMultiple(event, cat) {
    setFields({
      ...fields,
      factors: {
        ...fields.factors,
        [cat]: event.target.value,
      },
    });
  }

  function handleClickAddField() {
    if (!search.isinData) return;

    setFields({
      ...fields,
      isins: [
        {
          name: search.isinData.name,
          assetClass: search.isinData.assetClass,
          variable: search.isinData.ticker,
          pointsInMonths: search.isinData.pointsInMonths,
          pointsInYears: search.isinData.pointsInYears,
          weight: ''
        },
        ...fields.isins,
      ],
    });

    setSearch({
      loading: false,
      isin: '',
      assetClass: '',
      isinData: null,
    });
  }

  function handleClickRemoveField(key) {
    if (fields.isins.length === 2) {
      setFields({
        ...fields,
        isins: fields.isins.filter((isin, k) => k !== key).map(({weight, ...other}) => ({weight: '', ...other})),
      });
    } else {
      setFields({
        ...fields,
        isins: fields.isins.filter((isin, k) => k !== key),
      });
    }
  }

  function handleChangeWeight(event, key) {
    let value = '';

    if (Boolean(event.target.value)) {
      value = parseInt(event.target.value);

      if (isNaN(value) || value <= 0 || value > 200) {
        console.log('"' + fields.isins[key].variable + '" weight isNaN or 0 or greater than 200');
        return;
      }
    }

    setFields({
      ...fields,
      isins: fields.isins.map(({weight, ...other}, k) => {
        if (k === key) {
          return {
            ...other,
            weight: value,
          };
        }

        return {...other, weight};
      }),
    });
  }

  async function handleSearchIsin() {
    //VALIDATION
    if (!search.isin) {
      enqueueSnackbar('Search field is empty. Please type your ISIN and retry', {variant: 'error'});
      return;
    }
    if (!search.assetClass) {
      enqueueSnackbar('Asset class field is empty. Please select an option and retry', {variant: 'error'});
      return;
    }

    try {
      fields.isins.forEach(({variable, name}) => {
        if (variable === search.isin) {
          throw `ISIN "${name}" is already imported`;
        }
      });
    } catch (ex) {
      enqueueSnackbar(ex, {variant: 'warning'});
      return;
    }
    //EoVALIDATION

    setSearch({
      ...search,
      loading: true,
    });

    try {
      let dataTO = {
        isin: search.isin,
        assetClass: search.assetClass,
      };

      const {data: {returnobject: {variables}}} = await request.post(`${API}alchemistfetcher/tyb/variables`, dataTO);

      if (variables.length > 0) {

        setSearch({
          ...search,
          loading: false,
          isinData: variables[0],
        });

        enqueueSnackbar(`ISIN "${variables[0].name}" found. You may continue add this ISIN to your portfolio`, {variant: 'success'});

      } else {

        setSearch({
          ...search,
          loading: false,
          isinData: null,
        });

      }
    } catch (ex) {
      console.log(ex);

      if ('response' in ex) {
        let data = ex.response.data;
        if (ex.response.status === 404) {
          enqueueSnackbar('No ISIN found for "' + search.isin + '"', {variant: 'warning'});
        } else if (ex.response.status === 500) {
          if (data.code === '28') {
            enqueueSnackbar('No available data', {variant: 'warning'});
          }
        } else {
          enqueueSnackbar('Something went wrong. Please contact the system administrator', {variant: 'error'});
        }
      }

      setSearch({
        ...search,
        loading: false,
      });
    }
  }

  function handleClickResetFactor(cat) {
    setFields({
      ...fields,
      factors: {
        ...fields.factors,
        [cat]: [],
      },
    });
  }

  function handleSubmit() {
    //VALIDATION
    let factors = [];
    Object.keys(fields.factors).forEach(cat => {
      factors = factors.concat(fields.factors[cat]
        .map(factor => ({
          ticker: factor.ticker,
          points_in_months: factor.points_in_months,
        })));
    });

    if (fields.isins.length === 0) {
      enqueueSnackbar('You have to setup your portfolio before to continue', {variant: 'error'});
      return;
    }

    if (!alchemistMode && factors.length === 0) {
      enqueueSnackbar('You have to select at least one risk factor', {variant: 'error'});
      return;
    }

    let data = {
      alchemistMode: alchemistMode,
      isins: fields.isins.map(({variable, pointsInMonths, weight}) => ({variable, pointsInMonths, weight})),
      factors: factors.filter(factor => factor.points_in_months > 0), //todo - need further research
    };

    // let weightsAdd = 100;
    if (data.isins.length === 1 && !data.isins[0].weight) {
      data.isins[0].weight = 100;
    } else {

      try {

        data.isins.forEach((isin, key) => {
          if (!isin.weight) {
            throw `ISIN "${fields.isins[key].name}" weight is required`;
          }
        });

      } catch (ex) {
        console.log(ex);
        enqueueSnackbar(ex, {variant: 'error'});
        return;
      }

    }

    /*else {
      weightsAdd = data.isins.reduce((accumulator, {weight: currentValue}) => {
        return accumulator + currentValue;
      }, 0);
    }*/

    // if (weightsAdd !== 100) {
    //   enqueueSnackbar('Total sum of your ISINs weights must be 100%. Please change weights and retry', {variant: 'error'});
    //   return;
    // }
    //EoVALIDATION

    onHandleSubmit(data);

  }

  function handleReset() {
    setSearch({
      loading: false,
      isin: '',
      assetClass: '',
      isinData: null,
    });

    setFields({
      isins: [],
      factors: {
        equities: [],
        fixedincome: [],
        commodities: [],
        currencies: [],
        alternatives: [],
        sectors: [],
      },
    });

    onHandleResetResults();
  }

  function compareStrings(next, current) {

    let doSorting = current.parsedCat === 'commodities' || current.parsedCat === 'currencies' || current.parsedCat === 'sectors';
    if (!doSorting) {
      return 0;
    }

    let nameA = next.friendly_name.toUpperCase();
    let nameB = current.friendly_name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;

  }

  return (
    <>
      <form className={classes.form} autoComplete="off" onSubmit={event => event.preventDefault()}>

        {/*<div className={classes.formInnerWrap}>*/}

        <div className={classes.alModeContainer}>
          <InputLabel htmlFor="alchemist-mode">alchemist mode</InputLabel>
          <Checkbox
            id="alchemist-mode"
            checked={alchemistMode}
            onChange={handleChangeAlchemistMode}
          />
          <InfoBox type="neutral" show={alchemistMode} className={classes.alModeInfoBox}>Click Run and alchemist will examine your portfolio</InfoBox>
        </div>

        <div className={classes.gapContainer}>
          <HeadingSideLine title="Setup your Portfolio" className={classes.titleSideLine}/>

          <div className={classes.searchContainer}>

            <FormControl className={classes.formControlLeft}>
              <InputLabel>ISIN</InputLabel>
              <Input
                name="isin"
                value={search.isin}
                inputProps={{
                  'aria-label': 'search',
                  'tabIndex': '1',
                }}
                onChange={handleChangeSearch}
              />
            </FormControl>

            {/*assetClassList*/}
            <FormControl className={classes.formControlLeft}>
              <InputLabel>Asset Class</InputLabel>
              <Select
                native
                name="assetClass"
                value={search.assetClass}
                placeholder="Asset Class"
                inputProps={{
                  'aria-label': 'asset-class',
                  'tabIndex': '2',
                }}
                onChange={handleChangeSearch}
              >
                <option value=""></option>
                {assetClassList.map(assetClass => <option value={assetClass}>{assetClass}</option>)}
              </Select>
            </FormControl>

            <Button
              size="small"
              variant="contained"
              color="secondary"
              className={classnames(classes.ButtonSmall, classes.flat, classes.inlineButton)}
              disabled={search.loading}
              onClick={handleSearchIsin}
              tabIndex="3"
            >
              <SearchIcon/>
            </Button>

          </div>

          <Tooltip
            title={
              <>
                <Typography component="div">
                  <div><strong>Name</strong>: {search.isinData && search.isinData.name}</div>
                  <div><strong>Asset Class</strong>: {search.isinData && search.isinData.assetClass}</div>
                  <div><strong>ISIN</strong>: {search.isinData && search.isinData.ticker}</div>
                  <div><strong>Instrument in existence</strong>: {search.isinData && search.isinData.pointsInMonths} months
                  </div>
                </Typography>
              </>
            }
            classes={{tooltip: classes.infoTooltip}}
            disableHoverListener={!search.isinData}
            disableFocusListener={!search.isinData}
            // interactive={true}
            open={Boolean(anchorImport) && Boolean(search.isinData)}
            onOpen={handlePopoverOpen}
            onClose={handlePopoverClose}
          >
            <div className={classnames(classes.verticalIcon, {'disabled': !search.isinData})}>
              <Fab size="small"
                   variant="extended"
                   aria-label="Add"
                   className={classnames(classes.addFieldFab, classes.flat, {'animate': search.isinData})}
                   onClick={handleClickAddField}
                   onMouseEnter={handlePopoverOpen}
                   onMouseLeave={handlePopoverClose}
                   disabled={!search.isinData}
                   tabIndex="4"
              >
                <AddIcon/>
                Add ISIN
              </Fab>
            </div>
          </Tooltip>

          <div className={classes.portfolioContainer}>
            <Typography variant="h6" className={classes.innerTitle}>Portfolio</Typography>

            <InfoBox type="neutral" show={fields.isins.length === 0} className={classes.noIsinInfoBox}>No ISINs have been imported</InfoBox>

            {fields.isins.map(({name, assetClass, variable, pointsInMonths, weight}, key) =>
              <div key={key} className={classes.kvContainer}>

                <div className={classes.fabsContainer}>
                  <div className={classes.formControlIcon}>
                    <Fab size="small" aria-label="Remove"
                         className={classnames(classes.smallFieldFab, classes.removeFieldFab, classes.flat)}
                         onClick={() => handleClickRemoveField(key)}
                    >
                      <RemoveIcon className={classes.smallFieldIcon}/>
                    </Fab>
                  </div>

                  {/*<div className={classes.formControlIcon}>
                  <Tooltip
                    title={
                      <>
                        <Typography component="div">
                          <div><strong>Name</strong>: {name}</div>
                          <div><strong>Asset Class</strong>: {assetClass}</div>
                          <div><strong>ISIN</strong>: {variable}</div>
                          <div><strong>Instrument in existence</strong>: {pointsInMonths} months</div>
                        </Typography>
                      </>
                    }
                    classes={{tooltip: classes.infoTooltip}}
                    placement="bottom-start"
                    interactive={true}
                  >
                    <Fab size="small" aria-label="Info" className={classnames(classes.smallFieldFab, classes.flat)}>
                      <PriorityHighIcon className={classes.smallFieldIcon}/>
                    </Fab>
                  </Tooltip>
                </div>*/}
                </div>

                <FormControl className={classnames(classes.formControlLeft)}>
                  <Tooltip
                    title={
                      <>
                        <Typography component="div">
                          <div><strong>Name</strong>: {name}</div>
                          <div><strong>Asset Class</strong>: {assetClass}</div>
                          <div><strong>ISIN</strong>: {variable}</div>
                          <div><strong>Instrument in existence</strong>: {pointsInMonths} months</div>
                        </Typography>
                      </>
                    }
                    classes={{tooltip: classes.infoTooltip}}
                    placement="bottom-start"
                    // interactive={true}
                  >

                    <Input
                      classes={{input: classes.isinInput}}
                      value={fields.isins[key].name}
                      placeholder="ISIN"
                      inputProps={{
                        'aria-label': 'isin',
                      }}
                      disabled={true}
                    />

                  </Tooltip>
                </FormControl>

                {/*WEIGHT*/}
                <FormControl className={classnames(classes.formControlRight, classes.formControlWeight)}>
                  <Input
                    id="weight"
                    name="weight"
                    value={weight}
                    aria-describedby="weight-helper-text"
                    endAdornment={<InputAdornment position="end">%</InputAdornment>}
                    inputProps={{
                      'aria-label': 'Weight',
                      'tabIndex': '5',
                    }}
                    onChange={event => handleChangeWeight(event, key)}
                  />
                  <FormHelperText id={'weight-helper-text'}>{'Weight'}</FormHelperText>
                </FormControl>

                {/*<Typography component="div" className={classes.points}>{pointsInMonths} months</Typography>*/}
              </div>
            )}
          </div>
        </div>


        <div className={classnames(classes.gapContainer, {'disabled': alchemistMode})} style={{minHeight: 100}}>

          <HeadingSideLine title="Select Risk Factors" className={classes.titleSideLine}/>

          <Loader className={classes.loader} size="small" start={fetchLoading}/>

          {Object.keys(lists.factors).map(cat =>
            <div key={cat} className={classes.inlineField}>
              <FormControl className={classnames(classes.formControl, classes.inputFullWidth)}
                           disabled={alchemistMode}>
                <InputLabel htmlFor="regions">{lists.factors[cat].name}</InputLabel>
                <Select
                  multiple
                  name={cat}
                  value={fields.factors[cat]}
                  onChange={event => handleChangeMultiple(event, cat)}
                  renderValue={selected => (
                    <div className={classes.chips}>
                      {selected.map(value => (
                        <Chip key={value.ticker} label={value.friendly_name} className={classes.chip}/>
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {/*TODO - support subcategories */}
                  {/*{!window.Array.isArray(lists.factors[cat].list) && 'subCategory' in lists.factors[cat].list
                      ? <MenuItem key={-1} disabled={true} className={classes.listCategory}>{lists.factors[cat].list.subCategory}</MenuItem>
                      : ''
                    }*/}

                  {!window.Array.isArray(lists.factors[cat].list) && Object.keys(lists.factors[cat].list).map(subCategory => (
                    <>
                      <MenuItem key={-1} disabled={true}
                                className={classes.listCategory}>{lists.factors[cat].list[subCategory].name}</MenuItem>

                      {lists.factors[cat].list[subCategory].list.map((factor, key) => (
                        <MenuItem key={key} value={factor} disabled={alchemistMode}>{factor.friendly_name}</MenuItem>
                      ))}
                    </>
                  ))}
                  {/*EoTODO*/}

                  {/* Current version goes with -> */}
                  {window.Array.isArray(lists.factors[cat].list) && lists.factors[cat].list.sort(compareStrings).map((factor, key) => (
                    <MenuItem key={key} value={factor} disabled={alchemistMode}>{factor.friendly_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Fab size="small" aria-label="Reset" className={classnames(classes.smallFieldFab, classes.flat)}
                   disabled={fields.factors[cat].length === 0}
                   onClick={() => handleClickResetFactor(cat)}
              >
                <ClearIcon className={classes.smallFieldIcon}/>
              </Fab>
            </div>
          )}

        </div>

        {/*</div>*/}

        <div className={classnames(classes.ButtonWrap, classes.floatButtonWrap)}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.Button}
            disabled={loading || search.loading}
            onClick={handleSubmit}
          >RUN</Button>

          <Button
            variant="contained"
            color="primary"
            className={classes.Button}
            disabled={loading || search.loading}
            onClick={handleReset}
          >RESET</Button>
        </div>

      </form>



    </>
  );
}

export default withStyles(styles)(Form);
