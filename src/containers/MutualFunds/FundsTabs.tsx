import React from 'react';
import {withStyles, Theme, createStyles} from "@material-ui/core/styles";
import {AppBar, Tab, Tabs, Tooltip, Typography} from "@material-ui/core";
import MethodsForm from "./MethodsForm";
import MacroForm from "./MacroForm";
import CompareForm from "./CompareForm";
import {IGlobalStateFields, IFundsSpecificStateFields, IAvailableFunds} from "./Interface/IFundInput";
import {ILists} from "./Interface/IFundFetcher";
import classnames from "classnames";
import {Info as InfoIcon} from "@material-ui/icons";


const styles = (theme: Theme) => createStyles({
  // tabs
  appbar: {
    position: 'absolute',
    top: 0,
    backgroundColor: theme.palette.background.paper,
  },
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabsIndicator: {
    width: '33% !important',
    backgroundColor: theme.palette.secondary.main,
  },
  tabRoot: {
    textTransform: 'initial',
    width: '33.3%',
    minWidth: 72,
    fontSize: 14,
    fontWeight: theme.typography.fontWeightRegular,
    // marginRight: theme.spacing.unit * 4,
    borderRight: '1px solid ' + theme.palette.primary.light,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    // '&:hover': {
    //   color: '#40a9ff',
    //   opacity: 1,
    // },
    '&$tabSelected': {
      color: theme.palette.primary.dark,
      fontWeight: 'bold',
    },
    // '&:focus': {
    //   color: '#40a9ff',
    // },
    '&:last-child': {
      borderRight: 'medium none',
    },
  },
  tabSelected: {},

  tooltipTypo: {
    color: 'white',
  },
});


interface IProps {
  classes: any;
  loading: boolean;
  tab: number;
  lists: ILists;
  availableFunds: IAvailableFunds;
  globalFields: IGlobalStateFields;
  onHandleChange(event: React.ChangeEvent<HTMLInputElement>): void;
  onHandleChangeMultiple({target: {value, name}}: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void;
  onHandleChangeFundsNumber({target: {value}}: React.ChangeEvent<HTMLInputElement>): void;
  onHandleChangeAssetClass(event: React.ChangeEvent<HTMLSelectElement>): void;
  onHandleChangeSingleSelect(event: React.ChangeEvent<HTMLSelectElement>): void;
  onHandleChangeTrackRecordRange(value: string): void;
  handleChangeTabs(event: any, value: number): void;
  onHandleResetInput(): void;
  onHandleResetResults(): void;
  handleSubmit(fields: IFundsSpecificStateFields): void;
}

function FundsTabs({
                     classes,
                     loading,
                     tab,
                     lists,
                     availableFunds,
                     globalFields,
                     onHandleChange,
                     onHandleChangeMultiple,
                     onHandleChangeFundsNumber,
                     onHandleChangeAssetClass,
                     onHandleChangeSingleSelect,
                     onHandleChangeTrackRecordRange,
                     handleChangeTabs,
                     onHandleResetInput,
                     onHandleResetResults,
                     handleSubmit
}: IProps) {
  return (
    <>
      <AppBar position="static" className={classes.appbar} elevation={0}>
        <Tabs classes={{root: classes.tabsRoot, indicator: classes.tabsIndicator}} value={tab} onChange={handleChangeTabs}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>You can get a a number of fund suggestions in a user-defined universe based on alchemist-suggested methodologies.</Typography>}>
            <Tab label="Alchemist" classes={{root: classes.tabRoot, selected: classes.tabSelected}} disabled={loading}/>
          </Tooltip>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>You can get a number of fund suggestions in a user-defined universe based on your asset class vies. Convert your tactical views into actions.</Typography>}>
            <Tab label="Tactical" classes={{root: classes.tabRoot, selected: classes.tabSelected}} disabled={loading}/>
          </Tooltip>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>Insert your ISIN(s), define your comparable universe and let alchemist find you better alternatives.</Typography>}>
            <Tab label="Compare" classes={{root: classes.tabRoot, selected: classes.tabSelected}} disabled={loading}/>
          </Tooltip>
        </Tabs>
      </AppBar>

      {tab === 0 && <MethodsForm
        loading={loading} lists={lists} availableFunds={availableFunds} globalFields={globalFields}
        onHandleChange={onHandleChange} onHandleChangeMultiple={onHandleChangeMultiple} onHandleChangeFundsNumber={onHandleChangeFundsNumber}
        onHandleChangeAssetClass={onHandleChangeAssetClass} onHandleChangeSingleSelect={onHandleChangeSingleSelect}
        onHandleResetInput={onHandleResetInput} onHandleResetResults={onHandleResetResults} onHandleSubmit={handleSubmit}
      />}
      {tab === 1 && <MacroForm
        loading={loading} lists={lists} availableFunds={availableFunds} globalFields={globalFields}
        onHandleChange={onHandleChange} onHandleChangeMultiple={onHandleChangeMultiple} onHandleChangeFundsNumber={onHandleChangeFundsNumber}
        onHandleChangeAssetClass={onHandleChangeAssetClass} onHandleChangeSingleSelect={onHandleChangeSingleSelect}
        onHandleResetInput={onHandleResetInput} onHandleResetResults={onHandleResetResults} onHandleSubmit={handleSubmit}
      />}
      {tab === 2 && <CompareForm
        loading={loading} lists={lists} availableFunds={availableFunds} globalFields={globalFields}
        onHandleChange={onHandleChange} onHandleChangeMultiple={onHandleChangeMultiple} onHandleChangeFundsNumber={onHandleChangeFundsNumber}
        onHandleChangeAssetClass={onHandleChangeAssetClass} onHandleChangeSingleSelect={onHandleChangeSingleSelect}
        onHandleChangeTrackRecordRange={onHandleChangeTrackRecordRange}
        onHandleResetInput={onHandleResetInput} onHandleResetResults={onHandleResetResults} onHandleSubmit={handleSubmit}
      />}
    </>
  )
}

export default withStyles(styles)(FundsTabs);