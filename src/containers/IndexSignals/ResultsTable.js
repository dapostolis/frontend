import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@material-ui/core';
import HeadingSideLine from 'components/HeadingSideLine';
import Loader from 'components/LoaderCircle';
import classnames from 'classnames';
import LegendPopover from 'components/LegendPopover';
import ColoredButton from './ColoredButton';
import InfoBox from 'components/InfoBox';
import {TableCellSticky} from 'components/Table';


const styles = theme => ({

  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing.unit,
  },

  noresults: {
    marginTop: 10,
  },

  tableRoot: {
    width: '100%',
    maxHeight: 320,
    marginTop: theme.spacing.unit * 3,
    marginRight: 10,
    position: 'relative',
    border: '1px solid ' + theme.palette.primary.light,
    overflowY: 'scroll',

    '&:last-child': {
      marginRight: 0,
    },

    '&.left': {
      width: '90%',
    },
    '&.right': {
      width: '10%',
    },
  },
  table: {},
  tRow: {
    height: 46,
  },
  tBodyRow: {
    height: 47,
    borderBottom: '1px solid ' + theme.palette.primary.light,
    '&:last-child': {
      borderBottom: 'medium none',
    },
  },

  // CELL
  tCellGeneric: {
    // border: '1px solid ' + theme.palette.primary.light,
    cursor: 'default',
    border: 'medium none',

    '&:last-child': {
      paddingRight: 0,
    },
  },
  tCellHead: {
    fontSize: 14,
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.light,
  },
  tCellButton: {
    width: 100,
    padding: 0,
    paddingRight: 1,
  },
  tCellLastCol: {
    textAlign: 'center',
    whiteSpace: 'nowrap',
    paddingRight: 15,
    paddingLeft: 15,
  },

  tblegend: {
    marginTop: 20,
  },
  significant: {
    // '& > div': {
    //   display: 'flex',
    // }
  },

  icon: {
    width: 20,
    height: 'auto',
  },

  infoBox: {
    marginTop: 12,
  },

  trimText: {
    maxWidth: 350,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
});


function FactorsResultsTable({classes, loading, tableData, resultTableSelectedValue:selectedValue, onHandleGetChart}) {

  const [anchorFundamental, setAnchorFundamental] = useState(null);
  const [anchorRelative, setAnchorRelative] = useState(null);
  const [anchorMeanReversion, setAnchorMeanReversion] = useState(null);
  const [anchorMomentum, setAnchorMomentum] = useState(null);
  const [anchorCombo, setAnchorCombo] = useState(null);


  function handlePopoverFundamentalOpen(event) {
    setAnchorFundamental(event.currentTarget);
  }
  function handlePopoverFundamentalClose() {
    setAnchorFundamental(null);
  }

  function handlePopoverRelativeOpen(event) {
    setAnchorRelative(event.currentTarget);
  }

  function handlePopoverRelativeClose() {
    setAnchorRelative(null);
  }

  function handlePopoverMeanReversionOpen(event) {
    setAnchorMeanReversion(event.currentTarget);
  }

  function handlePopoverMeanReversionClose() {
    setAnchorMeanReversion(null);
  }

  function handlePopoverMomentumOpen(event) {
    setAnchorMomentum(event.currentTarget);
  }

  function handlePopoverMomentumClose() {
    setAnchorMomentum(null);
  }

  function handlePopoverComboOpen(event) {
    setAnchorCombo(event.currentTarget);
  }

  function handlePopoverComboClose() {
    setAnchorCombo(null);
  }


  return (
    <>
      <HeadingSideLine title="Strategies & Signals"/>

      <Loader className={loading.className} size="small" start={loading.state}/>

      {!loading.state && tableData.length > 0 ?
        <>
          <div className={classes.tableRoot}>

            <Table className={classes.table}>
              <TableHead className={classes.tHead}>
                <TableRow className={classes.tRow}>

                  <TableCellSticky className={classnames(classes.tCellGeneric, classes.tCellHead)}>Asset Class</TableCellSticky>


                  <LegendPopover anchorEl={anchorFundamental} onClose={handlePopoverFundamentalClose}>
                    P/E, CAPE, P/B, <br/>P/Cash Flow, Dividend Yield, <br/>Real & Nominal Yield vs Historical Average
                  </LegendPopover>
                  <TableCellSticky
                    className={classnames(classes.tCellGeneric, classes.tCellHead, classes.tCellButton)} align="center"
                    onMouseEnter={handlePopoverFundamentalOpen}
                    onMouseLeave={handlePopoverFundamentalClose}
                  >Fundamental Value</TableCellSticky>


                  <LegendPopover anchorEl={anchorRelative} onClose={handlePopoverRelativeClose}>
                    P/E, CAPE, P/B, <br/>P/Cash Flow, Dividend Yield, <br/>Real & Nominal Yield vs DM & Global Bonds
                  </LegendPopover>
                  <TableCellSticky
                    className={classnames(classes.tCellGeneric, classes.tCellHead, classes.tCellButton)} align="center"
                    onMouseEnter={handlePopoverRelativeOpen}
                    onMouseLeave={handlePopoverRelativeClose}
                  >Relative Value</TableCellSticky>

                  <LegendPopover anchorEl={anchorMeanReversion} onClose={handlePopoverRelativeClose}>
                    6m, 1y, 3y, 5y, 10y vs Global Bonds and World Equities
                  </LegendPopover>
                  <TableCellSticky
                    className={classnames(classes.tCellGeneric, classes.tCellHead, classes.tCellButton)} align="center"
                    onMouseEnter={handlePopoverMeanReversionOpen}
                    onMouseLeave={handlePopoverMeanReversionClose}
                  >Mean Reversion</TableCellSticky>

                  <LegendPopover anchorEl={anchorMomentum} onClose={handlePopoverMomentumClose}>
                    1m, 3m, 6m for fixed income & 6m, 12m, 18m for equities/sectors
                  </LegendPopover>
                  <TableCellSticky
                    className={classnames(classes.tCellGeneric, classes.tCellHead, classes.tCellButton)} align="center"
                    onMouseEnter={handlePopoverMomentumOpen}
                    onMouseLeave={handlePopoverMomentumClose}
                  >Momentum</TableCellSticky>

                  <LegendPopover anchorEl={anchorCombo} onClose={handlePopoverComboClose}>
                    Equally weighted combination <br/>of the four strategies
                  </LegendPopover>
                  <TableCellSticky
                    style={{textAlign: 'center'}}
                    className={classnames(classes.tCellGeneric, classes.tCellHead, classes.tCellButton)}
                    onMouseEnter={handlePopoverComboOpen}
                    onMouseLeave={handlePopoverComboClose}
                  >Combo
                    {/*<div style={{display: 'flex', alignItems: 'center'}}>
                      <InfoIcon className={classes.infoIcon}/>
                      <span style={{marginLeft: 3}}>Combo</span>
                    </div>*/}
                  </TableCellSticky>

                  {/*<TableCell className={classnames(classes.tCellGeneric, classes.tCellHead, classes.tCellLastCol)}>Forecast</TableCell>*/}

                </TableRow>
              </TableHead>

              <TableBody>
                {tableData && tableData.map((row, key) => {

                  /*let TrendingIcon = TrendingFlat,
                    trendingText = 'Neutral';

                  if (row.totalScore < 0) {
                    TrendingIcon = TrendingDown;
                    trendingText = 'Negative';
                  } else if (row.totalScore > 0) {
                    TrendingIcon = TrendingUp;
                    trendingText = 'Positive';
                  }*/

                  return (
                    <TableRow key={key} className={classes.tBodyRow}>

                      <TableCell className={classes.tCellGeneric}><div className={classes.trimText}>{row.assetClass}</div></TableCell>

                      <TableCell
                        className={classnames(classes.tCellGeneric, classes.tCellButton)}
                        onClick={() => onHandleGetChart(row.fundamentalValue.signalID, row.assetClass, key, 'Fundamental Value', row.fundamentalValue.latestSignalValue)}
                      >
                        <ColoredButton
                          rowKey={key}
                          value={row.fundamentalValue.latestSignalValue}
                          selectedValue={selectedValue}
                          label="Fundamental Value"
                          isHighlighted={row.highlightStrategy === 'FUNDAMENTAL'}
                        />
                      </TableCell>

                      <TableCell
                        className={classnames(classes.tCellGeneric, classes.tCellButton)}
                        onClick={() => onHandleGetChart(row.relativeValue.signalID, row.assetClass, key, 'Relative Value', row.relativeValue.latestSignalValue)}
                      >
                        <ColoredButton
                          rowKey={key}
                          value={row.relativeValue.latestSignalValue}
                          selectedValue={selectedValue}
                          label="Relative Value"
                          isHighlighted={row.highlightStrategy === 'RELATIVE'}
                        />
                      </TableCell>

                      <TableCell
                        className={classnames(classes.tCellGeneric, classes.tCellButton)}
                        onClick={() => onHandleGetChart(row.meanReversion.signalID, row.assetClass, key, 'Mean Reversion', row.meanReversion.latestSignalValue)}
                      >
                        <ColoredButton
                          rowKey={key}
                          value={row.meanReversion.latestSignalValue}
                          selectedValue={selectedValue}
                          label="Mean Reversion"
                          isHighlighted={row.highlightStrategy === 'MEAN_REVERSION'}
                        />
                      </TableCell>

                      <TableCell
                        className={classnames(classes.tCellGeneric, classes.tCellButton)}
                        onClick={() => onHandleGetChart(row.momentum.signalID, row.assetClass, key, 'Momentum', row.momentum.latestSignalValue)}
                      >
                        <ColoredButton
                          rowKey={key}
                          value={row.momentum.latestSignalValue}
                          selectedValue={selectedValue}
                          label="Momentum"
                          isHighlighted={row.highlightStrategy === 'MOMENTUM'}
                        />
                      </TableCell>

                      <TableCell
                        className={classnames(classes.tCellGeneric, classes.tCellButton)}
                        onClick={() => onHandleGetChart(row.combo.signalID, row.assetClass, key, 'Combo', row.combo.latestSignalValue)}
                      >
                        <ColoredButton
                          rowKey={key}
                          value={row.combo.latestSignalValue}
                          selectedValue={selectedValue}
                          label="Combo"
                          isHighlighted={row.highlightStrategy === 'COMBO'}
                        />
                      </TableCell>

                      {/*<TableCell style={{whiteSpace: 'nowrap'}} className={classnames(classes.tCellGeneric, classes.tCellLastCol)}>
                        {trendingText} <img className={classes.icon} src={TrendingIcon} alt="forecast trending icon"/>
                      </TableCell>*/}

                    </TableRow>
                  );
                })}

              </TableBody>

            </Table>


          </div>

          <InfoBox show={true} type="neutral" className={classes.infoBox}>
            <strong>Signals:</strong> Vary from -1 to 1 corresponding to an outlook from strong negative to strong positive
          </InfoBox>
        </>
        : ''
      }

      {!loading.state && tableData.length === 0 ?
        <Typography className={classes.noresults}>No results.</Typography> : ''}
    </>
  );
}

export default withStyles(styles)(FactorsResultsTable);
