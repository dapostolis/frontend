import React from 'react';
import {AppBar, Button, Link, Toolbar, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';


const styles = theme => ({
  root: {
    zIndex: '10',
    position: 'sticky',
    top: 64,
    marginBottom: 90,
  },
  appBar: {
    backgroundColor: '#607D8B',
  },
  toolbar: {
    display: 'block',
    height: 105,
    alignItems: 'baseline',
    padding: theme.spacing.unit,
    paddingTop: 10,
  },
  loading: {
    fontSize: 14,
    opacity: 0.6,
  },
  titleWrap: {
    marginBottom: 15,
  },
  title: {
    fontWeight: 'bold',
    // fontSize: 20,
    flexGrow: 1,
    color: 'white',
    borderBottom: '1px solid white',
  },

  controls: {
    display: 'flex',

    '& .toolbar-btn': {
      color: 'black',
      display: 'inline-block',
      height: 30,
      marginRight: 10,
      backgroundColor: 'white',
    },
    '& .toolbar-btn:last-child': {
      marginRight: 0,
    },
    '& .toolbar-btn.disabled': {
      opacity: 0.6,
    },
    '& .toolbar-btn.disabled > span': {
      cursor: 'no-drop !important',
    },
  },
  controlLeft: {
    flexGrow: 1,
  },
  controlRight: {
    flexGrow: 1,
    textAlign: 'right',
  },

  exportpdfwrapper: {
    '&.disabled': {
      display: 'inline',
      cursor: 'no-drop',
      opacity: 0.7,
    },
  },
});

function DYToolbar({classes, dyLoading, saved, autoSaveLoading, dyTitle, onHandleCreateNewDYReport, onToggleDYReportDialog, onToggleTopicDialog, onToggleCustomTopicInstanceDialog, onToggleColorPickerDialog, convertHTML2PDF}) {
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar} elevation={0}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.titleWrap}>
            <Typography variant="h6" className={classes.title}>
              Report <span className={classnames({'progress': dyLoading})}>- {dyTitle} {saved ? <span className={classes.loading}>({autoSaveLoading ? 'Saving...' : 'Saved'})</span> : ''}</span>
            </Typography>
          </div>

          <div className={classes.controls}>
            <div className={classes.controlLeft}>
              <Button
                variant="contained"
                size="small"
                className="toolbar-btn"
                onClick={onHandleCreateNewDYReport}
              >New Report</Button>

              <Button
                variant="contained"
                size="small"
                className="toolbar-btn"
                onClick={onToggleDYReportDialog}
              >Load Report</Button>

              <Button
                variant="contained"
                size="small"
                className="toolbar-btn"
                onClick={onToggleTopicDialog}
              >Load Topics</Button>

              <Button
                variant="contained"
                size="small"
                className="toolbar-btn"
                onClick={onToggleCustomTopicInstanceDialog}
              >Create Custom Topic</Button>

              <Button
                variant="contained"
                size="small"
                className="toolbar-btn"
                onClick={onToggleColorPickerDialog}
              >Change Background Color</Button>
            </div>


            <div className={classes.controlRight}>
              <div className={classnames(classes.exportpdfwrapper, {'disabled': !saved})}>
                <Button
                  component={Link}
                  href={convertHTML2PDF()}
                  className="toolbar-btn"
                  variant="contained"
                  size="small"
                  disabled={!saved}
                >Export to PDF</Button>
              </div>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withStyles(styles)(DYToolbar);