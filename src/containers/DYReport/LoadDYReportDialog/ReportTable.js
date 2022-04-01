import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Button, Typography} from '@material-ui/core';
import classnames from 'classnames';
import {format as dateFormat} from 'date-fns';
import ButtonDanger from '../../../components/ButtonDanger';


const styles = theme => ({
  noresults: {
    marginTop: 25,
    padding: 10,
    border: '1px solid ' + theme.palette.primary.light,
  },

  tableRoot: {
    width: '100%',
    position: 'relative',
    marginTop: 25,
    marginBottom: 70,
  },
  table: {
    width: '100%',
    border: '1px solid ' + theme.palette.primary.light,
  },
  tHead: {
    width: 'inherit',
  },
  tBody: {
    width: 'inherit',
    // cursor: 'pointer',

    '& > div:last-child': {
      border: 'medium none',
    },
  },
  tRow: {
    display: 'flex',
    position: 'relative',
    borderBottom: '1px solid ' + theme.palette.primary.light,
    transition: 'backgroundColor 0.4s',

    '&:hover': {
      backgroundColor: '#f8f8ff',
      cursor: 'pointer',
    },
    '&.active': {
      backgroundColor: '#e4e4f9',
    },
  },
  tRowHead: {
    height: 38,
  },
  tRowBody: {},

  tCell: {
    display: 'flex',
    height: 'inherit',
    alignItems: 'baseline',
    width: '100%',
    padding: 10,
    border: 'medium none',
    borderRight: '1px solid ' + theme.palette.primary.light,
  },
  tCell1: {
    width: '60%',
    '& img': {
      maxWidth: '100%',
    }
  },
  tCell2: {
    width: '20%',
  },
  tCell3: {
    width: '20%',
    borderRight: 'medium none',
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

  buttonWrap: {
    position: 'absolute',
    bottom: 0,
    width: 'calc(100% - 45px)',
    backgroundColor: 'white',
    paddingBottom: 20,
  },
  button: {
    marginTop: 20,
    marginRight: 15,
  },


});

function ReportTable({classes, loading, dYReports, selectedDYReport, onHandleClickSelectReport, onHandleClickUseDYReport, onHandleClickCloneReport, onHandleDeleteDYReport}) {

  function isDYReportSelected(dyReport) {
    let isReportFound = false;

    if (dyReport !== null && selectedDYReport !== null && dyReport.id === selectedDYReport.id) {
      isReportFound = true;
    }

    return isReportFound;
  }

  function handleClickSelectDYReport(dYReport) {
    onHandleClickSelectReport(dYReport);
  }

  // RENDER
  if (!dYReports || dYReports.length === 0) {
    return (
      <Typography component="div" className={classes.noresults}>
        No Reports have been created.
      </Typography>
    );
  }

  return (
    <>
      <div className={classes.tableRoot}>

        <div className={classes.table}>
          <div className={classes.tHead}>
            <div className={classnames(classes.tRow, classes.tRowHead)}>

              <Typography component="div" className={classnames(classes.tCell, classes.tCell1)}>
                <span className={classes.tCellLine}>Title</span>
              </Typography>

              <Typography component="div" className={classnames(classes.tCell, classes.tCell2)}>
                <span className={classes.tCellLine}>Date Created</span>
              </Typography>

              <Typography component="div" className={classnames(classes.tCell, classes.tCell3)}>
                <span className={classes.tCellLine}>Last Modified</span>
              </Typography>

            </div>
          </div>

          <div className={classnames(classes.tBody)}>
            {dYReports.map((dYReport, key) =>
              <div
                key={key}
                className={classnames(classes.tRow, classes.tRowBody, {'active': (isDYReportSelected(dYReport))})}
                onClick={() => handleClickSelectDYReport(dYReport)}
                onDoubleClick={() => onHandleClickUseDYReport(dYReport)}
              >
                <Typography component="div" className={classnames(classes.tCell, classes.tCell1)}>
                  {dYReport.title}
                </Typography>

                <Typography component="div" className={classnames(classes.tCell, classes.tCell2)}>
                  {dateFormat(dYReport.datecreated, 'DD/MM/YYYY - HH:mm')}
                </Typography>

                <Typography component="div" className={classnames(classes.tCell, classes.tCell3)}>
                  {dateFormat(dYReport.lastmodified, 'DD/MM/YYYY - HH:mm')}
                </Typography>
              </div>
            )}
          </div>

        </div>

      </div>

      <div className={classes.buttonWrap}>
        <Button variant="contained" color="secondary" className={classes.button}
                onClick={() => onHandleClickUseDYReport(null)} disabled={!selectedDYReport}>
          Import
        </Button>


        <Button variant="contained" color="secondary" className={classes.button}
                onClick={onHandleClickCloneReport} disabled={!selectedDYReport}>
          Clone
        </Button>

        <ButtonDanger variant="contained" className={classes.button} onClick={onHandleDeleteDYReport} disabled={!selectedDYReport || loading}>
          Delete
        </ButtonDanger>
      </div>
    </>
  );
}

export default withStyles(styles)(ReportTable);