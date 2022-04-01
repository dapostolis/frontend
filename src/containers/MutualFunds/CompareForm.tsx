import React, {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {
  Button,
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  Theme,
  createStyles,
  Chip, LinearProgress,
  InputAdornment,
  FormHelperText
} from '@material-ui/core';
import classnames from 'classnames';
import HeadingSideLine from 'components/HeadingSideLine';
import {useSnackbar} from 'notistack';
import {Add as AddIcon, Info as InfoIcon, Remove as RemoveIcon, Search as SearchIcon} from '@material-ui/icons';
import {request} from "constants/alias";
import {API} from "constants/config";
import Fab from "@material-ui/core/Fab";
import InfoBox from "components/InfoBox";

import {
  IKeyValue,
  IFundsSpecificStateFields,
  ISearchISIN,
  ItybVariableWeightField, IGlobalStateFields, IAvailableFunds
} from './Interface/IFundInput';
import {ILists} from './Interface/IFundFetcher';


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

const assetClassList = ['ETF', 'Fund'];

const styles = (theme: Theme) => createStyles({
  form: {
    position: 'sticky',
    // height: 'calc(100vh - 185px)',
    height: 'calc(100vh - 118px)',
    top: 64,
    overflowY: 'auto',
    marginTop: 30,
    paddingTop: 10,

    '& .disabled': {
      cursor: 'no-drop',
      opacity: 0.5,
    },
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

  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
  },

  gapContainer: {
    position: 'relative',
    margin: `15px ${theme.spacing.unit * 2}px 0 ${theme.spacing.unit * 2}px`,
    '&.disabled': {
      cursor: 'no-drop',
      opacity: 0.4,
    },
  },

  legend: {
    color: '#7a7a7a',
  },
  fieldgroup: {
    border: '1px solid #c5c5c5',
    marginBottom: theme.spacing.unit * 2,
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
    fontSize: 14,
    margin: '30px 0 10px 0',
  },

  formControl: {
    // marginRight: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    // marginLeft: theme.spacing.unit * 2,
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
    //@ts-ignore
    color: theme.palette.getContrastText(theme.palette.danger.light),
    //@ts-ignore
    backgroundColor: theme.palette.danger.light,

    '&:hover': {
      //@ts-ignore
      color: theme.palette.getContrastText(theme.palette.danger.main),
      //@ts-ignore
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
    width: '100%',
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

  flexFieldWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  infoIcon: {
    color: theme.palette.secondary.main,
    cursor: 'pointer',
    marginRight: 7,
    opacity: 0.6,

    '&.small-floated': {
      position: 'absolute',
      top: 0,
      right: 0,
      fontSize: 16,
    },
  },

  tooltipTypo: {
    color: 'white',
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
  innerFlexField: {
    height: 36,
    display: 'flex',
    alignItems: 'center',
  },

  progressBar: {
    height: 2,
  },
  linearColorPrimary: {
    backgroundColor: theme.palette.primary.light,
  },
  linearBarColorPrimary: {
    backgroundColor: theme.palette.secondary.main,
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

  inlineButton: {
    height: 36,
    marginTop: 12,
  },

});

interface IProps {
  classes: any;
  loading: boolean;
  availableFunds: IAvailableFunds;
  lists: ILists;
  globalFields: IGlobalStateFields;
  onHandleChange(event: React.ChangeEvent<HTMLInputElement>): void;
  onHandleChangeMultiple({target: {value, name}}: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void;
  onHandleChangeFundsNumber({target: {value}}: React.ChangeEvent<HTMLInputElement>): void;
  onHandleChangeAssetClass(event: React.ChangeEvent<HTMLSelectElement>): void;
  onHandleChangeSingleSelect(event: React.ChangeEvent<HTMLSelectElement>): void;
  onHandleChangeTrackRecordRange(value: string): void;
  onHandleResetInput(): void;
  onHandleResetResults(): void;
  onHandleSubmit(fields: IFundsSpecificStateFields): void;
}

function CompareForm({
                       classes,
                       loading,
                       availableFunds,
                       lists,
                       globalFields,
                       onHandleChange,
                       onHandleChangeMultiple,
                       onHandleChangeSingleSelect,
                       // onHandleChangeFundsNumber,
                       onHandleChangeAssetClass,
                       onHandleChangeTrackRecordRange,
                       onHandleResetInput,
                       onHandleResetResults,
                       onHandleSubmit
}:IProps) {
  const {enqueueSnackbar} = useSnackbar();
  const [anchorImport, setAnchorImport] = useState(null);
  const [search, setSearch] = useState<ISearchISIN>({
    loading: false,
    isin: '', // Help: US0378331005 | US02079K1079
    assetClass: '', // e.g. "Equity"
    isinData: null,
  });
  const [minimumTrackRecordChange, setMinimumTrackRecordChange] = useState<number>(0);
  const [fields, setFields] = useState<IFundsSpecificStateFields>({
    tybVariableWeightTOs: [],

    method: {
      momentum: true,
      meanReversion: true,
      minimumVolatility: true,
      sharpe: true,
      alchemist: true,
    }
  });

  useEffect(() => {
    let pointsInYearsArray = fields.tybVariableWeightTOs.map((tybVariableWeight: ItybVariableWeightField) => tybVariableWeight.pointsInYears);
    let pointsInYearsMin = Math.min(...pointsInYearsArray);

    if (pointsInYearsMin >= 4 && pointsInYearsMin < 6) {

      setMinimumTrackRecordChange(3);

    } else if (pointsInYearsMin >= 6 && pointsInYearsMin < 11) {

      setMinimumTrackRecordChange(5);

    } else if (pointsInYearsMin >= 11) {

      setMinimumTrackRecordChange(10);

    } else {

      setMinimumTrackRecordChange(0);

    }

    onHandleChangeTrackRecordRange('3');

  }, [fields.tybVariableWeightTOs]);

  function handleChangeMethod(event: React.ChangeEvent<HTMLInputElement>): void {
    let target = event.target;
    const {id, type, value, checked} = target;

    let fieldValue = type === 'checkbox' ? checked : value;

    setFields({
      ...fields,
      method: {
        ...fields.method,
        [id]: fieldValue,
      },
    });
  }

  /**
   * Setup portfolio
   */
  function handlePopoverOpen(event: any) {
    setAnchorImport(event.currentTarget);
  }

  function handlePopoverClose() {
    setAnchorImport(null);
  }

  function handleChangeSearch(event: any) {
    let name = event.target.name;

    setSearch({
      ...search,
      [name]: event.target.value,
      isinData: null,
    });
  }

  function handleClickRemoveField(key: number) {
    if (fields.tybVariableWeightTOs.length === 2) {
      setFields({
        ...fields,
        tybVariableWeightTOs: fields.tybVariableWeightTOs.filter((isin, k) => k !== key).map(({weight, ...other}) => ({weight: '', ...other})),
      });
    } else {
      setFields({
        ...fields,
        tybVariableWeightTOs: fields.tybVariableWeightTOs.filter((isin, k) => k !== key),
      });
    }
  }

  function handleChangeWeight(event: any, key: number) {
    let value: string | number = '';

    if (window.Boolean(event.target.value)) {
      value = parseInt(event.target.value);

      if (isNaN(value) || value <= 0 || value > 200) {
        console.log('"' + fields.tybVariableWeightTOs[key].variable + '" weight isNaN or 0 or greater than 200');
        return;
      }
    }

    setFields({
      ...fields,
      tybVariableWeightTOs: fields.tybVariableWeightTOs.map(({weight, ...other}, k) => {
        if (k === key) {
          return {
            ...other,
            weight: value + '',
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
      fields.tybVariableWeightTOs.forEach(({variable, name}) => {
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

      const {data: {returnobject: {variables}}} = await request.post(`${API}alchemistfetcher/funds/variables`, dataTO);

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
          } else {// todo add a code for this case
            enqueueSnackbar('ISIN "' + search.isin + '" has not been found', {variant: 'error'});
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

  function handleClickAddField() {
    if (!search.isinData) return;

    setFields({
      ...fields,
      tybVariableWeightTOs: [
        {
          name: search.isinData.name,
          assetClass: search.isinData.assetClass,
          variable: search.isinData.ticker,
          pointsInMonths: search.isinData.pointsInMonths,
          pointsInYears: search.isinData.pointsInYears,
          weight: ''
        },
        ...fields.tybVariableWeightTOs,
      ],
    });

    setSearch({
      loading: false,
      isin: '',
      assetClass: '',
      isinData: null,
    });
  }
  //EoSetup_portfolio

  function handleSubmit(): void {
    onHandleSubmit(fields);
  }

  function handleReset() {
    onHandleResetInput();

    setFields({
      tybVariableWeightTOs: [],

      method: {
        momentum: false,
        meanReversion: false,
        minimumVolatility: false,
        sharpe: false,
        alchemist: false,
      }
    });

    onHandleResetResults();
  }


  //RENDER
  let focus = lists.assetClass && globalFields.assetClass && lists.assetClass[globalFields.assetClass] && lists.assetClass[globalFields.assetClass].focus || [];
  let isFocusEnabled = window.Boolean(focus.length);
  let style = lists.assetClass && globalFields.assetClass && lists.assetClass[globalFields.assetClass] && lists.assetClass[globalFields.assetClass].style || [];
  let isStyleEnabled = window.Boolean(style.length);
  globalFields.number = availableFunds.number;


  return (
    <form className={classes.form} autoComplete="off" onSubmit={event => event.preventDefault()}>

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
                'tabIndex': 1,
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
                'tabIndex': 2,
              }}
              onChange={handleChangeSearch}
            >
              <option value=""></option>
              {assetClassList.map((assetClass, key) => <option key={key} value={assetClass}>{assetClass}</option>)}
            </Select>
          </FormControl>

          <Button
            size="small"
            variant="contained"
            color="secondary"
            className={classnames(classes.ButtonSmall, classes.flat, classes.inlineButton)}
            disabled={search.loading}
            onClick={handleSearchIsin}
            tabIndex={3}
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
                 tabIndex={4}
            >
              <AddIcon/>
              Add ISIN
            </Fab>
          </div>
        </Tooltip>

        <div className={classes.portfolioContainer}>
          <Typography variant="h6" className={classes.innerTitle}>Portfolio</Typography>

          <InfoBox type="neutral" show={fields.tybVariableWeightTOs.length === 0} className={classes.noIsinInfoBox}>No ISINs have been imported</InfoBox>

          {fields.tybVariableWeightTOs.map(({name, assetClass, variable, pointsInMonths, weight}, key) =>
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
                    value={fields.tybVariableWeightTOs[key].name}
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
                    'tabIndex': 5,
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


      <div className={classes.gapContainer}>
        <HeadingSideLine title="Filtering Criteria" className={classes.titleSideLine}/>

        <div className={classes.inlineField}>
          <FormControl className={classnames(classes.formControl)}>
            <InputLabel htmlFor="number">Number of Funds</InputLabel>
            <Input
              type="number"
              id="number"
              name="number"
              value={globalFields.number}
              // onChange={onHandleChangeFundsNumber}
              disabled={true}
            />
          </FormControl>

          <span style={{fontSize: 25}}>/</span>

          <FormControl className={classnames(classes.formControl)} disabled>
            <InputLabel htmlFor="number">Available Funds</InputLabel>
            <Input type="text" value={availableFunds.number || '-'} disabled/>
            {availableFunds.loading ?
              <LinearProgress
                classes={{
                  root: classes.progressBar,
                  colorPrimary: classes.linearColorPrimary,
                  barColorPrimary: classes.linearBarColorPrimary,
                }}
              />
              : ''}
            <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The universe consists of the highest AUM share class of funds per currency with minimum 3 yr track record and AUM above 100mio.</Typography>}>
              <InfoIcon className={classnames(classes.infoIcon, 'small-floated')}/>
            </Tooltip>
          </FormControl>
        </div>

        <FormControl className={classnames(classes.formControl, classes.inputFullWidth)}>
          <InputLabel htmlFor="country">Country of Sale</InputLabel>
          <Select
            native
            name="country"
            value={globalFields.country}
            onChange={onHandleChangeSingleSelect}
          >
            <option value=""></option>
            {lists.country.map((country: IKeyValue, key: number) => <option key={key} value={country.id}>{country.label}</option>)}
          </Select>
        </FormControl>

        <FormControl className={classnames(classes.formControl, classes.inputFullWidth)}>
          <InputLabel htmlFor="trackRecordRange">Track Record Range</InputLabel>
          <Select
            native
            name="trackRecordRange"
            value={globalFields.trackRecordRange}
            onChange={onHandleChangeSingleSelect}
          >
            {minimumTrackRecordChange === 0 || (minimumTrackRecordChange >= 3 && minimumTrackRecordChange <= 10) ? <option value="3">3 Years</option> : ''}
            {minimumTrackRecordChange === 0 || minimumTrackRecordChange >= 5 && minimumTrackRecordChange <= 10 ? <option value="5">5 Years</option> : ''}
            {minimumTrackRecordChange === 0 || minimumTrackRecordChange >= 10 ? <option value="10">10 Years</option> : ''}
          </Select>
        </FormControl>

        <FormControl className={classnames(classes.formControl, classes.inputFullWidth)}>
          <InputLabel htmlFor="currency">Currency</InputLabel>
          <Select
            multiple
            name="currency"
            value={globalFields.currency}
            onChange={onHandleChangeMultiple}
            //@ts-ignore
            renderValue={(selected: Array<IKeyValue>): React.ReactNode => (
              <div className={classes.chips}>
                {selected && Array.isArray(selected) && selected.map((currency: IKeyValue) => (
                  <Chip key={currency.id} label={currency.label} className={classes.chip}/>
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {lists.currency.map((currency: IKeyValue, key: number) => (
              // @ts-ignore
              <MenuItem key={key} value={currency}>
                <Checkbox checked={globalFields.currency.map((fieldsCurrency: IKeyValue) => fieldsCurrency.id).indexOf(currency.id) > -1}/>
                {currency.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={classnames(classes.formControl, classes.inputFullWidth)}>
          <InputLabel htmlFor="distributionStatus">Distribution Status</InputLabel>
          <Select
            multiple
            name="distributionStatus"
            value={globalFields.distributionStatus}
            onChange={onHandleChangeMultiple}
            //@ts-ignore
            renderValue={(selected: Array<IKeyValue>): React.ReactNode => (
              <div className={classes.chips}>
                {selected && Array.isArray(selected) && selected.map((distr: IKeyValue) => (
                  <Chip key={distr.id} label={distr.label} className={classes.chip}/>
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {lists.distributionStatus.map((distr: IKeyValue, key: number) => (
              // @ts-ignore
              <MenuItem key={key} value={distr}>
                <Checkbox checked={globalFields.distributionStatus.map((fieldsDistr: IKeyValue) => fieldsDistr.id).indexOf(distr.id) > -1}/>
                {distr.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className={classes.checkboxContainer}>
          <InputLabel htmlFor="excludeETF">Exclude ETFs</InputLabel>
          <Checkbox
            id="excludeETF"
            checked={globalFields.excludeETF}
            onChange={onHandleChange}
          />
        </div>



        <fieldset className={classes.fieldgroup}>
          <legend><Typography className={classes.legend}>Advanced Filtering</Typography></legend>

          <FormControl className={classnames(classes.formControl, classes.inputFullWidth)}>
            <InputLabel htmlFor="assetClass">Asset Class</InputLabel>
            <Select
              native
              name="assetClass"
              value={globalFields.assetClass}
              onChange={onHandleChangeAssetClass}
            >
              <option value=""></option>
              {Object.keys(lists.assetClass).map((acKey: string, key: number) => <option key={key} value={acKey}>{lists.assetClass[acKey].label}</option>)}
            </Select>
          </FormControl>

          <FormControl className={classnames(classes.formControl, classes.inputFullWidth, {'disabled': !isFocusEnabled})} disabled={!isFocusEnabled}>
            <InputLabel htmlFor="focus">Focus</InputLabel>
            <Select
              multiple
              name="focus"
              value={globalFields.focus}
              onChange={onHandleChangeMultiple}
              //@ts-ignore
              renderValue={(selected: Array<IKeyValue>): React.ReactNode => (
                <div className={classes.chips}>
                  {selected && Array.isArray(selected) && selected.map((focus: IKeyValue) => (
                    <Chip key={focus.id} label={focus.label} className={classes.chip}/>
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {focus.map((focus: IKeyValue, key: number) => (
                // @ts-ignore
                <MenuItem key={key} value={focus}>
                  <Checkbox checked={globalFields.focus.map((fieldsFocus: IKeyValue) => fieldsFocus.id).indexOf(focus.id) > -1}/>
                  {focus.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className={classnames(classes.formControl, classes.inputFullWidth, {'disabled': isStyleEnabled})} disabled={!isStyleEnabled}>
            <InputLabel htmlFor="style">Style</InputLabel>
            <Select
              multiple
              name="style"
              value={globalFields.style}
              onChange={onHandleChangeMultiple}
              //@ts-ignore
              renderValue={(selected: Array<IKeyValue>): React.ReactNode => (
                <div className={classes.chips}>
                  {selected && Array.isArray(selected) && selected.map((style: IKeyValue) => (
                    <Chip key={style.id} label={style.label} className={classes.chip}/>
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {style.map((style: IKeyValue, key: number) => (
                // @ts-ignore
                <MenuItem key={key} value={style}>
                  <Checkbox checked={globalFields.style.map((fieldsStyle: IKeyValue) => fieldsStyle.id).indexOf(style.id) > -1}/>
                  {style.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </fieldset>

      </div>


      <div className={classnames(classes.gapContainer)} style={{minHeight: 100}}>

        <HeadingSideLine title="Select Methodology" className={classes.titleSideLine}/>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The methodology uses a combination of look-back windows to validate the existence of price momentum</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classnames(classes.innerFlexField, 'disabled')}>
            <InputLabel htmlFor="momentum" className={classes.label}>Momentum</InputLabel>
            <Checkbox
              id="momentum"
              checked={fields.method.momentum}
              onChange={handleChangeMethod}
              disabled={true}
            />
          </div>
        </div>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The methodology selects funds with mean reversion and/or anti-trend properties</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classnames(classes.innerFlexField, 'disabled')}>
            <InputLabel htmlFor="meanReversion" className={classes.label}>Mean Reversion</InputLabel>
            <Checkbox
              id="meanReversion"
              checked={fields.method.meanReversion}
              onChange={handleChangeMethod}
              disabled={true}
            />
          </div>
        </div>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The methodology identifies and selects funds with minimum volatility</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classnames(classes.innerFlexField, 'disabled')}>
            <InputLabel htmlFor="minimumVolatility" className={classes.label}>Min Volatility</InputLabel>
            <Checkbox
              id="minimumVolatility"
              checked={fields.method.minimumVolatility}
              onChange={handleChangeMethod}
              disabled={true}
            />
          </div>
        </div>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The methodology identifies and selects funds with high rolling Sharpe ratio (risk adjusted performance)</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classnames(classes.innerFlexField, 'disabled')}>
            <InputLabel htmlFor="sharpe" className={classes.label}>Sharpe</InputLabel>
            <Checkbox
              id="sharpe"
              checked={fields.method.sharpe}
              onChange={handleChangeMethod}
              disabled={true}
            />
          </div>
        </div>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The methodology utilizes the stochastic frontier analysis (SFA) to identify funds with "efficient" characteristics</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classnames(classes.innerFlexField, 'disabled')}>
            <InputLabel htmlFor="alchemist" className={classes.label}>Efficient Frontier</InputLabel>
            <Checkbox
              id="alchemist"
              checked={fields.method.alchemist}
              onChange={handleChangeMethod}
              disabled={true}
            />
          </div>
        </div>

      </div>


      <div className={classnames(classes.ButtonWrap, classes.floatButtonWrap)}>
        <Button
          variant="contained"
          color="secondary"
          className={classes.Button}
          disabled={loading || availableFunds.loading}
          onClick={handleSubmit}
        >RUN</Button>

        <Button
          variant="contained"
          color="primary"
          className={classes.Button}
          disabled={loading || availableFunds.loading}
          onClick={handleReset}
        >RESET</Button>
      </div>

    </form>
  );
}

export default withStyles(styles)(CompareForm);
