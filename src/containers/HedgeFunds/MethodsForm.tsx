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
} from '@material-ui/core';
import classnames from 'classnames';
import HeadingSideLine from 'components/HeadingSideLine';
import {Info as InfoIcon} from '@material-ui/icons';

import {IKeyValue, IFundsSpecificStateFields, IAvailableFunds} from './Interface/IHedgeFundInput';
import {ILists} from './Interface/IHedgeFundFetcher';
import {IGlobalStateFields} from "./Interface/IHedgeFundInput";


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

const styles = (theme: Theme) => createStyles({
  form: {
    position: 'sticky',
    // height: 'calc(100vh - 185px)',
    height: 'calc(100vh - 118px)',
    top: 64,
    overflowY: 'auto',
    marginTop: 30,
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
});

interface IProps {
  classes: any;
  loading: boolean;
  lists: ILists;
  availableFunds: IAvailableFunds;
  globalFields: IGlobalStateFields;
  onHandleChangeFundsNumber({target: {value}}: React.ChangeEvent<HTMLInputElement>): void;
  onHandleChangeMultiple({target: {value, name}}: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void;
  onHandleChangeSingleSelect(event: React.ChangeEvent<HTMLSelectElement>): void;
  onHandleResetInput(): void;
  onHandleResetResults(): void;
  onHandleSubmit(fields: IFundsSpecificStateFields): void;
}

function MethodsForm({
                       classes,
                       loading,
                       lists,
                       availableFunds,
                       globalFields,
                       onHandleChangeFundsNumber,
                       onHandleChangeMultiple,
                       onHandleChangeSingleSelect,
                       onHandleResetInput,
                       onHandleResetResults,
                       onHandleSubmit
}:IProps) {
  const [fields, setFields] = useState<IFundsSpecificStateFields>({
    method: {
      momentum: false,
      meanReversion: false,
      minimumVolatility: false,
      sharpe: false,
      alchemist: false,
    }
  });

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

  function handleSubmit(): void {
    onHandleSubmit(fields);
  }

  function handleReset() {
    onHandleResetInput();

    setFields({
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
  return (
    <form className={classes.form} autoComplete="off" onSubmit={event => event.preventDefault()}>

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
              onChange={onHandleChangeFundsNumber}
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
            <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The universe consists of funds with minimum 3 yr track record and AUM above 30mio.</Typography>}>
              <InfoIcon className={classnames(classes.infoIcon, 'small-floated')}/>
            </Tooltip>
          </FormControl>
        </div>

        <FormControl className={classnames(classes.formControl, classes.inputFullWidth)}>
          <InputLabel htmlFor="type">Type</InputLabel>
          <Select
            multiple
            name="type"
            value={globalFields.type}
            onChange={onHandleChangeMultiple}
            //@ts-ignore
            renderValue={(selected: Array<string>): React.ReactNode => (
              <div className={classes.chips}>
                {selected && Array.isArray(selected) && selected.map((type: string, key: number) => (
                  <Chip key={key} label={type} className={classes.chip}/>
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {lists.types.map((type: string, key: number) => (
              // @ts-ignore
              <MenuItem key={key} value={type}>
                <Checkbox checked={globalFields.type.map((fieldsType: string) => fieldsType).indexOf(type) > -1}/>
                {type}
              </MenuItem>
            ))}
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
            <option value="3">3 Years</option>
            <option value="5">5 Years</option>
            <option value="10">10 Years</option>
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
          <InputLabel htmlFor="strategyType">Strategy Type</InputLabel>
          <Select
            multiple
            name="strategyType"
            value={globalFields.strategyType}
            onChange={onHandleChangeMultiple}
            //@ts-ignore
            renderValue={(selected: Array<IKeyValue>): React.ReactNode => (
              <div className={classes.chips}>
                {/*todo change key to strgType.id*/}
                {selected && Array.isArray(selected) && selected.map((strgType: IKeyValue, key: number) => (
                  <Chip key={key} label={strgType.label} className={classes.chip}/>
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {lists.strategyType.map((strgType: IKeyValue, key: number) => (
              // @ts-ignore
              <MenuItem key={key} value={strgType}>
                <Checkbox checked={globalFields.strategyType.map((fieldsStrgType: IKeyValue) => fieldsStrgType.label).indexOf(strgType.label) > -1}/>
                {strgType.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

      </div>


      <div className={classnames(classes.gapContainer)} style={{minHeight: 100}}>

        <HeadingSideLine title="Select Methodology" className={classes.titleSideLine}/>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The methodology uses a combination of look-back windows to validate the existence of price momentum</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classes.innerFlexField}>
            <InputLabel htmlFor="momentum" className={classes.label}>Momentum</InputLabel>
            <Checkbox
              id="momentum"
              checked={fields.method.momentum}
              onChange={handleChangeMethod}
            />
          </div>
        </div>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The methodology selects funds with mean reversion and/or anti-trend properties</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classes.innerFlexField}>
            <InputLabel htmlFor="meanReversion" className={classes.label}>Mean Reversion</InputLabel>
            <Checkbox
              id="meanReversion"
              checked={fields.method.meanReversion}
              onChange={handleChangeMethod}
            />
          </div>
        </div>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The methodology identifies and selects funds with minimum volatility</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classes.innerFlexField}>
            <InputLabel htmlFor="minimumVolatility" className={classes.label}>Min Volatility</InputLabel>
            <Checkbox
              id="minimumVolatility"
              checked={fields.method.minimumVolatility}
              onChange={handleChangeMethod}
            />
          </div>
        </div>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The methodology identifies and selects funds with high rolling Sharpe ratio (risk adjusted performance)</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classes.innerFlexField}>
            <InputLabel htmlFor="sharpe" className={classes.label}>Sharpe</InputLabel>
            <Checkbox
              id="sharpe"
              checked={fields.method.sharpe}
              onChange={handleChangeMethod}
            />
          </div>
        </div>

        <div className={classes.flexFieldWrapper}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>The methodology utilizes the stochastic frontier analysis (SFA) to identify funds with "efficient" characteristics</Typography>}>
            <InfoIcon className={classes.infoIcon}/>
          </Tooltip>
          <div className={classes.innerFlexField}>
            <InputLabel htmlFor="alchemist" className={classes.label}>Efficient Frontier</InputLabel>
            <Checkbox
              id="alchemist"
              checked={fields.method.alchemist}
              onChange={handleChangeMethod}
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

export default withStyles(styles)(MethodsForm);
