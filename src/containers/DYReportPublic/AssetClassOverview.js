import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';
import {Delete as DeleteIcon, ControlCamera as ControlCameraIcon} from '@material-ui/icons';
import TrendingFlat from 'assets/images/trendingflat.png';
import TrendingUp from 'assets/images/trendingup.png';
import TrendingDown from 'assets/images/trendingdown.png';
import classnames from 'classnames';
import EditInput from 'components/FlatField/EditInput';
import EditSelect from 'components/FlatField/EditSelect';


const OVERVIEW_VIEW_LIST = [
  {label: '', value: ''},
  {label: 'Neutral', value: 'Neutral'},
  {label: 'Overweight', value: 'Overweight'},
  {label: 'Underweight', value: 'Underweight'},
];

const styles = theme => ({
  tableRoot: {
    width: '100%',
    position: 'relative',
  },
  table: {
    width: '100%',
    border: '1px solid ' + theme.palette.primary.light,
  },
  tHead: {
    width: 'inherit',
    // backgroundColor: theme.palette.primary.light,
  },
  tBody: {
    width: 'inherit',
    cursor: 'pointer',

    '&.start-sort': {
      cursor: 'move',
    },

    '& > div:last-child': {
      border: 'medium none',
    },
  },
  tRow: {
    display: 'flex',
    alignItems: 'center',
    height: 38,
    borderBottom: '1px solid ' + theme.palette.primary.light,
    transition: 'backgroundColor 0.4s',

    // '&:hover': {
    //   backgroundColor: '#f6f8f6',
    // },

    '&.active': {
      backgroundColor: '#e2f7e2',
      border: '2px dotted gray !important',
    },

    // '&:hover > .swap-sort': {
    //   visibility: 'visible',
    //   opacity: 1,
    // },
  },

  tCell: {
    display: 'flex',
    height: 'inherit',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 14,
    border: 'medium none',
    borderRight: '1px solid ' + theme.palette.primary.light,
  },
  tCell1: {
    width: '75%',
  },
  tCell2: {
    width: '25%',
    borderRight: 'medium none',
  },

  overviewIcon: {
    height: 20,
    marginRight: 20,
    '& img': {
      width: 20,
      height: 'auto',
      verticalAlign: 'middle',
    },
  },
  overviewText: {
    width: '100%',
    height: 'inherit',
  },

  tCellLine: { // bottom line
    fontSize: 14,
    color: theme.palette.text.primary,
    fontWeight: 'bold',
    position: 'relative',
    paddingBottom: 5,

    '&:after': {
      content: '""',
      position: 'absolute',
      width: '40%',
      height: 1,
      bottom: 4,
      left: 0,
      backgroundColor: theme.palette.secondary.main,
    }
  },

  swap: {
    position: 'absolute',
    top: 7,
    left: 'calc(50% - 10px)',
    color: theme.palette.getContrastText(theme.palette.secondary.main),
    backgroundColor: theme.palette.secondary.main,
    border: '1px solid white',
    borderRadius: 20,
    cursor: 'pointer',

    visibility: 'hidden',
    opacity: 0,
    transition: 'all 0.4s',

    // '&.active': {
    //   visibility: 'visible',
    //   opacity: 1,
    // //   color: theme.palette.getContrastText('green'),
    // backgroundColor: 'green',
    // },
  },

  resultAssetClass: {
    width: '100%',
    height: 'inherit',
    display: 'flex',
    alignItems: 'center',
  },
  assetClassInput: {
    width: 515,
  },

  resultView: {
    width: '100%',
    height: 'inherit',
    display: 'flex',
    alignItems: 'center',
  },
});

function AssetClassOverview({classes, overviewlist}) {

  function compare(a, b) {
    return a.order - b.order;
  }

  return (
    <div className={classes.tableRoot}>

      <div className={classes.table}>
        <div className={classes.tHead}>
          <div className={classes.tRow}>

            <Typography component="div" className={classnames(classes.tCell, classes.tCell1)}>
              <span className={classes.tCellLine}>Asset Classes</span>
            </Typography>

            <Typography component="div" className={classnames(classes.tCell, classes.tCell2)}>
              <span className={classes.tCellLine}>View</span>
            </Typography>

          </div>
        </div>

        <div className={classes.tBody}>
          {overviewlist && overviewlist.sort(compare).map((overview, key) => {
            let ViewIcon = null;
            switch (overview.view) {
              case 'Neutral':
                ViewIcon = TrendingFlat;
                break;
              case 'Overweight':
                ViewIcon = TrendingUp;
                break;
              case 'Underweight':
                ViewIcon = TrendingDown;
                break;
              default:
                ViewIcon = TrendingFlat;
            }
            return (
              <div key={key} className={classnames(classes.tRow, 'action-parent')}>

                <Typography component="div" className={classnames(classes.tCell, classes.tCell1)}>
                  {overview.assetclass}
                </Typography>

                <Typography component="div" className={classnames(classes.tCell, classes.tCell2)}>
                  <div className={classes.overviewIcon}>
                    {overview.view ? <img src={ViewIcon} alt="overview-view"/> : ''}
                  </div>
                  <div className={classes.overviewText}>
                    <div className={classes.resultView}>{overview.view}</div>
                  </div>
                </Typography>

              </div>
            );
          })}

          {/*Create the rest rows (maximum 5)*/}
          {overviewlist.length < 5 && new Array(5 - overviewlist.length).fill(0).map((NOP, key) =>
            <div key={key + overviewlist.length} className={classes.tRow}>
              <div scope="row" className={classes.tCell}>&nbsp;</div>
              <div className={classes.tCell}>&nbsp;</div>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}

export default withStyles(styles)(AssetClassOverview);