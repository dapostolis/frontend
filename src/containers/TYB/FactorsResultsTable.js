import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@material-ui/core';
import {Close as CloseIcon, Check as CheckIcon} from '@material-ui/icons';
import HeadingSideLine from 'components/HeadingSideLine';
import Loader from 'components/LoaderCircle';
import classnames from 'classnames';
import {TableCellSticky} from 'components/Table';
import InfoBox from '../../components/InfoBox';


const styles = theme => ({
  noresults: {
    marginTop: 10,
  },
  noresultsBorder: {
    padding: 10,
  },

  innerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.palette.primary.dark,
    paddingTop: 8,
    paddingBottom: 10,
    paddingLeft: 7,
  },

  tableContainer: {
    display: 'flex',
  },
  tableRootContainer: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 2,

    '&:last-child': {
      marginRight: 0,
    },
  },
  tableRoot: {
    maxHeight: 610,
    position: 'relative',
    overflowY: 'auto',
    border: '1px solid ' + theme.palette.primary.light,
  },
  // table: {
    // minWidth: 500,
  // },
  tRow: {
    height: 36,
  },
  tBodyRow: {
    borderBottom: '1px solid ' + theme.palette.primary.light,
    '&:last-child': {
      borderBottom: 'medium none',
    },

    '& th, & td': {
      borderBottom: 'medium none',
    },

    '&.info': {
      height: 30,
      opacity: 0.4,
    },
  },
  tCell: {
    padding: '4px 15px',
  },
  tCellHeader: {
    fontSize: 14,
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.light,
  },
  significant: {
    '& > div': {
      display: 'flex',
      alignItems: 'center',
    },
    '& > div > div': {
      marginLeft: 5,
    },
  },
  tag: {
    display: 'inline-block',
    padding: 4,
    backgroundColor: theme.palette.primary.dark,
    color: '#fff',
    borderRadius: 3,

    '&.danger': {
      backgroundColor: theme.palette.danger.dark
    },
    '&.safe': {
      backgroundColor: theme.palette.safe.main,
    },
  },
  beta: {
    fontWeight: 'bold',
  },
  flexIcon: {
    marginTop: 2,
  },

  checkIcon: {
    color: theme.palette.safe.main,
  },
  closeIcon: {
    color: theme.palette.danger.main,
  },

  infoCell: {
    marginTop: 5,
    padding: '4px 56px 4px 24px',
    backgroundColor: '#d4dced',

    border: '1px solid ' + theme.palette.primary.light,
    // borderBottom: '1px solid ' + theme.palette.primary.light,
    // borderLeft: '1px solid ' + theme.palette.primary.light,
  },
  tagLight: {
    backgroundColor: '#e0eaff',
    padding: '2px 4px',
    marginLeft: 4,
    '&:first-child': {
      marginLeft: 0,
    },
  },

  info: {
    marginTop: 20,
  },
});


function FactorsResultsTable({classes, loading, isAlchemistModeEnabled, droppedFactors, rsq, correlation, tableData}) {
  // const isAlchemistModeEnabled = tableData.multi.length > 0;

  return (
    <>
      <HeadingSideLine title="Decomposition Μetrics"/>

      <Loader className={loading.className} size="small" start={loading.state}/>

      {/*{!loading.state && tableData.uni.length > 0
        ? <Typography className={classes.tblegend}><strong>Total Risk Explained:</strong> {rsq.toFixed(2)}%</Typography>
        : ''}*/}

      <InfoBox type="neutral" show={!isAlchemistModeEnabled && !loading.state && tableData.uni.length > 0} className={classes.info}>The factors in v (green) are significant in explaining the performance of the portfolio. The factors with x (red) are not important and do not pose significant threat to your portfolio. The sensitivities (betas) can be found under portfolio impact. The replication of the portfolio using the significant factors can be seen below.</InfoBox>
      <InfoBox type="neutral" show={isAlchemistModeEnabled && !loading.state && tableData.uni.length > 0} className={classes.info}>The single factor table shows the factors that are significant on a standalone basis and their sensitivities (betas) can be found in the portfolio impact column. The multi factor table combines the significant factors and gives a more realistic decomposition of the portfolio because it takes into account the interplay among factors. The replication of the portfolio using the most significant factors can be seen below.</InfoBox>

      {!loading.state && tableData.uni.length > 0 ?
        <div className={classes.tableContainer}>

          <div className={classes.tableRootContainer}>
            {!loading.state && isAlchemistModeEnabled ? <Typography variant="h4" className={classes.innerTitle}>Single factor analysis</Typography> : ''}

            <div className={classes.tableRoot}>

              <Table>
                <TableHead className={classes.tHead}>
                  <TableRow className={classes.tRow}>

                    <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>Factor Name</TableCellSticky>
                    <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>Portfolio Impact</TableCellSticky>
                    <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>Significance</TableCellSticky>

                  </TableRow>
                </TableHead>

                <TableBody>
                  {tableData.uni.map((row, key) =>
                    <TableRow key={key} className={classnames(classes.tBodyRow, {'info': row.name === 'Constant'})}>{/*for constant check handleSubmit method on index.js*/}
                      <TableCell component="th" scope="row" className={classnames(classes.tCell)}>{row.name}</TableCell>
                      <TableCell className={classnames(classes.tCell)}>{window.Number(row.beta) > 0 ? 'Positive' : 'Negative'} ({row.beta})</TableCell>
                      <TableCell className={classnames(classes.tCell, classes.significant)}>
                        <div>
                          <div className={classes.flexIcon}>{isAlchemistModeEnabled || Math.abs(row.tStat) > 1.65 ? <CheckIcon className={classes.checkIcon}/> : <CloseIcon className={classes.closeIcon}/>}</div>
                          <div>({row.tStat})</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>

              </Table>

            </div>

            {!isAlchemistModeEnabled ?
              <>
                {window.Array.isArray(droppedFactors) && droppedFactors.length > 0 ?
                  <div className={classes.infoCell}>
                    <Typography>Factor {droppedFactors.map(factor => <span className={classes.tagLight}>{factor}</span>)} dropped due to multi-collinearity</Typography>
                  </div> : ''}

                {rsq !== null ?
                  <div className={classes.infoCell}>
                    <Typography><strong>Total Risk Explained:</strong> {rsq}%</Typography>
                  </div> : ''}

                <div className={classes.infoCell}>
                  <Typography><strong>Correlation to the portfolio:</strong> {correlation}%</Typography>
                </div>
              </>
              : ''}

          </div>

          {isAlchemistModeEnabled && window.Array.isArray(tableData.multi) ?
            <div className={classes.tableRootContainer}>
              <Typography variant="h4" className={classes.innerTitle}>Multi factor analysis</Typography>

              {tableData.multi.length > 0 ?
                <>
                  <div className={classes.tableRoot}>

                    <Table>
                      <TableHead className={classes.tHead}>
                        <TableRow className={classes.tRow}>

                          <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>Factor Name</TableCellSticky>
                          <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>Portfolio Impact</TableCellSticky>
                          <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>Significance</TableCellSticky>

                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {tableData.multi.map((row, key) =>
                          <TableRow key={key} className={classnames(classes.tBodyRow, {'info': row.name === 'Constant'})}>{/*for constant check handleSubmit method on index.js*/}
                            <TableCell className={classnames(classes.tCell)} component="th" scope="row">{row.name}</TableCell>
                            <TableCell className={classnames(classes.tCell)}>{window.Number(row.beta) > 0 ? 'Positive' : 'Negative'} ({row.beta})</TableCell>
                            <TableCell className={classnames(classes.tCell, classes.significant)}>
                              <div>
                                <div className={classes.flexIcon}><CheckIcon className={classes.checkIcon}/></div>
                                <div>({row.tStat})</div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>

                    </Table>

                  </div>

                  {rsq !== null ?
                    <div className={classes.infoCell}>
                      <Typography><strong>Total Risk Explained:</strong> {rsq}%</Typography>
                    </div> : ''}

                  {correlation !== null ?
                    <div className={classes.infoCell}>
                      <Typography><strong>Correlation to the portfolio:</strong> {correlation}%</Typography>
                    </div> : ''}
                </>
                :
                <div className={classes.tableRoot}><Typography className={classes.noresultsBorder}>No significant factors have been found.</Typography></div>
              }
            </div>
            : ''}
        </div>
        : ''
      }

      {!loading.state && tableData.uni.length === 0 ? <Typography className={classes.noresults}>No results.</Typography> : ''}
    </>
  )
}

export default withStyles(styles)(FactorsResultsTable)