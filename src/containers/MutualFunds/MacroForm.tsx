/**
 * Tactical View
 */

import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {
  Button,
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Theme,
  createStyles,
  Chip, LinearProgress, Typography, Table, TableHead, TableCell, TableBody, TableRow, Tooltip,
} from '@material-ui/core';
import {Close as CloseIcon, Info as InfoIcon} from "@material-ui/icons";
import classnames from 'classnames';
import HeadingSideLine from 'components/HeadingSideLine';
import {convertStringToMachineName} from "utils/generic";
import {Map} from 'immutable';
import InfoBox from "components/InfoBox";

import {
  IKeyValue,
  IAvailableFunds,
  IFundsSpecificStateFields, IFactor, IFactorSelected, TSelectedFactors, IGlobalStateFields,
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

  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
  },

  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
    color: theme.palette.getContrastText(theme.palette.primary.light),
    backgroundColor: theme.palette.primary.light,

    '&.under': {
      color: theme.palette.getContrastText(theme.palette.primary.dark),
      backgroundColor: theme.palette.primary.dark,
    },
    '&.over': {
      color: theme.palette.getContrastText(theme.palette.secondary.light),
      backgroundColor: theme.palette.secondary.light,
    },
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

    '&.small': {
      fontSize: 12,
    }
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


  tableRoot: {
    maxHeight: 290,
    overflowY: 'scroll',
  },
  tCell: {
    fontSize: 12,
    padding: 0,
    paddingRight: 5,
    paddingLeft: 5,

    '&:last-child': {
      paddingRight: 0,
    },
  },
  tCellHead: {
    color: '#585858',
    fontWeight: 'bold',
  },
  selectRoot: {
    fontSize: 13,
  },
  removeIcon: {
    fontSize: 20,
    //@ts-ignore
    color: theme.palette.danger.dark,
    cursor: 'pointer',
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
                       onHandleChange,
                       onHandleChangeMultiple,
                       onHandleChangeSingleSelect,
                       onHandleChangeFundsNumber,
                       onHandleChangeAssetClass,
                       onHandleResetInput,
                       onHandleResetResults,
                       onHandleSubmit
}:IProps) {
  const [fields, setFields] = useState<IFundsSpecificStateFields>({
    factors: {
      equities: [],
      fixedincome: [],
      macro: [],
    },
    selectedFactors: {},
  });


  function handleChangeMultipleAndCreateFactorSelection({target: {value, name}}: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
    let factors: Array<IFactor>,
      selectedFactors: {[id: string]: IFactorSelected} = {};

    let deepCopySelectedFactors: TSelectedFactors = Map(fields.selectedFactors).toObject();

    //@ts-ignore
    factors = value;
    factors.forEach(factor => {

      let isSelectedFactorSaved = window.Boolean(deepCopySelectedFactors[factor.id]);

      if (isSelectedFactorSaved) {
        selectedFactors[factor.id] = {
          id: factor.id,
          category: convertStringToMachineName(factor.category),
          friendly_name: factor.friendly_name,
          sign: deepCopySelectedFactors[factor.id].sign,
        };
      } else {
        selectedFactors[factor.id] = deepCopySelectedFactors[factor.id] = {
          id: factor.id,
          category: convertStringToMachineName(factor.category),
          friendly_name: factor.friendly_name,
          sign: '',
        };
      }

    });

    Object.keys(deepCopySelectedFactors).filter((id: string) => deepCopySelectedFactors[id].category === name).forEach((id: string) => {

      let isSavedFactorSelected = window.Boolean(selectedFactors[id]);
      if (!isSavedFactorSelected) {
        delete deepCopySelectedFactors[id];
      }

    });


    setFields({
      ...fields,
      factors: {
        ...fields.factors,
        [name]: factors,
      },
      selectedFactors: deepCopySelectedFactors,
    });
  }

  function handleChangeSelectedFactorSign(event: React.ChangeEvent<HTMLSelectElement>, id: string): void {

    setFields({
      ...fields,
      selectedFactors: {
        ...fields.selectedFactors,
        [id]: {
          ...fields.selectedFactors[id],
          sign: event.target.value,
        },
      },
    });

  }

  function handleRemoveSelectedFactor(factor: IFactorSelected): void {
    let deepCopySelectedFactors = Map(fields.selectedFactors).toObject();

    delete deepCopySelectedFactors[factor.id];

    setFields({
      ...fields,
      factors: {
        ...fields.factors,
        [factor.category]: fields.factors[factor.category].filter((prevFactor: IFactor) => prevFactor.id !== factor.id),
      },
      selectedFactors: deepCopySelectedFactors,
    });
  }


  function handleSubmit(): void {
    onHandleSubmit(fields);
  }

  function handleReset() {
    onHandleResetInput();

    setFields({
      factors: {
        equities: [],
        fixedincome: [],
        macro: [],
      },
      selectedFactors: {},
    });

    onHandleResetResults();
  }


  //RENDER
  let focus = lists.assetClass && globalFields.assetClass && lists.assetClass[globalFields.assetClass] && lists.assetClass[globalFields.assetClass].focus || [];
  let isFocusEnabled = window.Boolean(focus.length);
  let style = lists.assetClass && globalFields.assetClass && lists.assetClass[globalFields.assetClass] && lists.assetClass[globalFields.assetClass].style || [];
  let isStyleEnabled = window.Boolean(style.length);

  let selectedFactorIDs: Array<string> = Object.keys(fields.selectedFactors);

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

        <HeadingSideLine title="Asset Class Views" className={classes.titleSideLine}/>

        <FormControl className={classnames(classes.formControl, classes.inputFullWidth)}>
          <InputLabel htmlFor="equities">Equities</InputLabel>
          <Select
            multiple
            name="equities"
            value={fields.factors.equities}
            onChange={handleChangeMultipleAndCreateFactorSelection}
            //@ts-ignore
            renderValue={(selected: Array<IFactor>): React.ReactNode => (
              <div className={classes.chips}>
                {selected && Array.isArray(selected) && selected.map((factor: IFactor) => (
                  <Chip key={factor.id} label={factor.friendly_name}
                        className={
                          classnames(
                            classes.chip,
                            {'under': (fields.selectedFactors[factor.id] && fields.selectedFactors[factor.id].sign === 'under')},
                            {'over': (fields.selectedFactors[factor.id] && fields.selectedFactors[factor.id].sign === 'over')}
                          )
                        }/>
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {lists.equities && lists.equities.map((factor: IFactor, key: number) => (
              // @ts-ignore
              <MenuItem key={key} value={factor}>
                <Checkbox checked={fields.factors.equities.map((fieldsFactor: IFactor) => fieldsFactor.id).indexOf(factor.id) > -1}/>
                {factor.friendly_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={classnames(classes.formControl, classes.inputFullWidth)}>
          <InputLabel htmlFor="fixedincome">Fixed Income</InputLabel>
          <Select
            multiple
            name="fixedincome"
            value={fields.factors.fixedincome}
            onChange={handleChangeMultipleAndCreateFactorSelection}
            //@ts-ignore
            renderValue={(selected: Array<IFactor>): React.ReactNode => (
              <div className={classes.chips}>
                {selected && Array.isArray(selected) && selected.map((factor: IFactor) => (
                  <Chip key={factor.id} label={factor.friendly_name}
                        className={
                          classnames(
                            classes.chip,
                            {'under': (fields.selectedFactors[factor.id] && fields.selectedFactors[factor.id].sign === 'under')},
                            {'over': (fields.selectedFactors[factor.id] && fields.selectedFactors[factor.id].sign === 'over')}
                          )
                        }/>
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {lists.fixedincome && lists.fixedincome.map((factor: IFactor, key: number) => (
              // @ts-ignore
              <MenuItem key={key} value={factor}>
                <Checkbox checked={fields.factors.fixedincome.map((fieldsFactor: IFactor) => fieldsFactor.id).indexOf(factor.id) > -1}/>
                {factor.friendly_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={classnames(classes.formControl, classes.inputFullWidth)}>
          <InputLabel htmlFor="macro">Macro</InputLabel>
          <Select
            multiple
            name="macro"
            value={fields.factors.macro}
            onChange={handleChangeMultipleAndCreateFactorSelection}
            //@ts-ignore
            renderValue={(selected: Array<IFactor>): React.ReactNode => (
              <div className={classes.chips}>
                {selected && Array.isArray(selected) && selected.map((factor: IFactor) => (
                  <Chip key={factor.id} label={factor.friendly_name}
                        className={
                          classnames(
                            classes.chip,
                            {'under': (fields.selectedFactors[factor.id] && fields.selectedFactors[factor.id].sign === 'under')},
                            {'over': (fields.selectedFactors[factor.id] && fields.selectedFactors[factor.id].sign === 'over')}
                          )
                        }/>
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {lists.macro && lists.macro.map((factor: IFactor, key: number) => (
              // @ts-ignore
              <MenuItem key={key} value={factor}>
                <Checkbox checked={fields.factors.macro.map((fieldsFactor: IFactor) => fieldsFactor.id).indexOf(factor.id) > -1}/>
                {factor.friendly_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <fieldset className={classes.fieldgroup}>
          <legend><Typography className={classes.legend}>Tactical Selection</Typography></legend>

          {selectedFactorIDs.length > 0 ?
            <div className={classes.tableRoot}>
              <Table>
                <TableHead>
                  <TableRow className={classes.tRow}>
                    <TableCell className={classnames(classes.tCell, classes.tCellHead)}>Factor Name</TableCell>
                    <TableCell className={classnames(classes.tCell, classes.tCellHead)}>Tactical View</TableCell>
                    <TableCell className={classnames(classes.tCell, classes.tCellHead)}></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {selectedFactorIDs.map((id: string) => (
                    <TableRow key={id}>
                      <TableCell className={classes.tCell}>
                        {fields.selectedFactors[id].friendly_name}
                      </TableCell>

                      <TableCell className={classes.tCell}>
                        <Select
                          native
                          classes={{root: classes.selectRoot}}
                          value={fields.selectedFactors[id].sign}
                          onChange={event => handleChangeSelectedFactorSign(event, id)}
                        >
                          <option value=""></option>
                          <option value="over">Overweight</option>
                          <option value="under">Underweight</option>
                        </Select>
                      </TableCell>

                      <TableCell className={classes.tCell}>
                        <CloseIcon className={classes.removeIcon} onClick={() => handleRemoveSelectedFactor(fields.selectedFactors[id])}/>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </div>
            : ''}

          <InfoBox show={selectedFactorIDs.length === 0} type="neutral">Select an asset class from the above fields</InfoBox>

        </fieldset>
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
