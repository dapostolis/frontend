import React from 'react';
import {withStyles, Theme, createStyles} from "@material-ui/core/styles";
import {AppBar, Tab, Tabs, Tooltip, Typography} from "@material-ui/core";
import MethodsForm from "./MethodsForm";
import MacroForm from "./MacroForm";
import {ILists} from "./Interface/IHedgeFundFetcher";
import {IAvailableFunds, IFundsSpecificStateFields, IGlobalStateFields} from "./Interface/IHedgeFundInput";


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
    backgroundColor: theme.palette.secondary.main,
  },
  tabRoot: {
    textTransform: 'initial',
    width: '50%',
    minWidth: 72,
    fontSize: 14,
    fontWeight: theme.typography.fontWeightRegular,
    // marginRight: theme.spacing.unit * 4,
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
  handleChangeTabs(event: any, value: number): void;
  onHandleChangeFundsNumber({target: {value}}: React.ChangeEvent<HTMLInputElement>): void;
  onHandleChangeMultiple({target: {value, name}}: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void;
  onHandleChangeSingleSelect(event: React.ChangeEvent<HTMLSelectElement>): void;
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
                     handleChangeTabs,
                     onHandleChangeMultiple,
                     onHandleChangeSingleSelect,
                     onHandleChangeFundsNumber,
                     onHandleResetInput,
                     onHandleResetResults,
                     handleSubmit
}: IProps) {
  return (
    <>
      <AppBar position="static" className={classes.appbar} elevation={0}>
        <Tabs classes={{root: classes.tabsRoot, indicator: classes.tabsIndicator}} value={tab} onChange={handleChangeTabs}>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>You can get a a number of fund suggestions in a user-defined universe based on alchemist-suggested methodologies.</Typography>}>
            <Tab label="Alchemist Views" classes={{root: classes.tabRoot, selected: classes.tabSelected}} disabled={loading}/>
          </Tooltip>
          <Tooltip placement="bottom-start" title={<Typography component="div" variant="body2" className={classes.tooltipTypo}>You can get a number of fund suggestions in a user-defined universe based on your asset class vies. Convert your tactical views into actions.</Typography>}>
            <Tab label="Tactical Views" classes={{root: classes.tabRoot, selected: classes.tabSelected}} disabled={loading}/>
          </Tooltip>
        </Tabs>
      </AppBar>

      {tab === 0 && <MethodsForm
        loading={loading}
        lists={lists} availableFunds={availableFunds} globalFields={globalFields}
        onHandleChangeFundsNumber={onHandleChangeFundsNumber} onHandleChangeMultiple={onHandleChangeMultiple} onHandleChangeSingleSelect={onHandleChangeSingleSelect}
        onHandleResetInput={onHandleResetInput} onHandleResetResults={onHandleResetResults} onHandleSubmit={handleSubmit}
      />}
      {tab === 1 && <MacroForm
        loading={loading}
        lists={lists} availableFunds={availableFunds} globalFields={globalFields}
        onHandleChangeFundsNumber={onHandleChangeFundsNumber} onHandleChangeMultiple={onHandleChangeMultiple} onHandleChangeSingleSelect={onHandleChangeSingleSelect}
        onHandleResetInput={onHandleResetInput} onHandleResetResults={onHandleResetResults} onHandleSubmit={handleSubmit}
      />}
    </>
  )
}

export default withStyles(styles)(FundsTabs);