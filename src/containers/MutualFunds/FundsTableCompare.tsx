import React from 'react';
import {
  createStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Tooltip,
  Typography
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {MoreVert as MoreVertIcon} from "@material-ui/icons";
import {IFund} from "./Interface/IFundOutput";
import classnames from "classnames";
import {convertNumberToCommas, convertNumberToPercentage} from "utils/generic";
import {TableCellSticky} from "components/Table";
import Loader from "components/LoaderCircle";
import HeadingSideLine from "components/HeadingSideLine";
import InfoBox from "components/InfoBox";


const styles = (theme: Theme) => createStyles({
  title: {
    marginBottom: 10,
  },

  tableRoot: {
    width: '100%',
    maxHeight: 374,
    position: 'relative',
    overflowY: 'auto',
    border: '1px solid ' + theme.palette.primary.light,
  },
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

    '&.highlight': {
      backgroundColor: '#e6f5ff',
    },
    '&.highlight > *': {
      fontWeight: 'bold',
    },
  },
  tCell: {
    padding: '4px 7px',

    '&:last-child': {
      textAlign: 'center',
      width: 30,
      paddingRight: 7,
      paddingLeft: 9,
    },
  },
  tCellHeader: {
    fontSize: 14,
    // width: '12.5%',
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.light,
  },
  tCellName: {
    width: '30%',
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

  more: {
    '&.disabled': {
      cursor: 'no-drop',
    },
  },

  infoBox: {
    marginTop: 15,
  }
});


interface IProps {
  classes: any;
  loading: { [key: string]: any };
  compare: Array<IFund> | null;
}

function FundsTableCompare({classes, loading, compare}: IProps) {
  return (
    <>
      <Loader className={loading.className} size="small" start={loading.state}/>

      <HeadingSideLine title="Results" className={classes.title}/>

      <div className={classes.tableRoot}>

        <Table>
          <TableHead>
            <TableRow className={classes.tRow}>

              <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader, classes.tCellName)}>Name</TableCellSticky>
              <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>ISIN</TableCellSticky>
              <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>Ann. Return</TableCellSticky>
              <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>Ann. Volatility</TableCellSticky>
              <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>YTD</TableCellSticky>
              <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>Focus</TableCellSticky>
              <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>Style</TableCellSticky>

              <TableCellSticky className={classnames(classes.tCell, classes.tCellHeader)}>More</TableCellSticky>

            </TableRow>
          </TableHead>

          <TableBody>
            {compare && compare.map((row: IFund, key: number) =>
              <TableRow key={key} className={classnames(classes.tBodyRow, {'highlight': row.name === 'Portfolio'})}>

                <TableCell component="th" scope="row" className={classes.tCell}>{row.name}</TableCell>
                <TableCell className={classes.tCell}>{row.isin}</TableCell>
                <TableCell className={classes.tCell}>{convertNumberToPercentage(row.annualisedReturn)}%</TableCell>
                <TableCell className={classes.tCell}>{convertNumberToPercentage(row.annualisedVolatility)}%</TableCell>
                <TableCell className={classes.tCell}>{convertNumberToPercentage(row.ytd)}%</TableCell>
                <TableCell className={classes.tCell}>{row.focus || '-'}</TableCell>
                <TableCell className={classes.tCell}>{row.style || '-'}</TableCell>

                <TableCell className={classes.tCell}>
                  <Tooltip
                    interactive
                    disableHoverListener={row.name === 'Portfolio'}
                    title={
                      <>
                        <Typography component="div">
                          <div><strong>AUM</strong>: {row.aum ? convertNumberToCommas(row.aum) : '-'}</div>
                          <div><strong>CCY</strong>: {row.ccy ? row.ccy.toUpperCase() : '-'}</div>
                          <div><strong>Distribution</strong>: {row.distr || '-'}</div>
                          <div><strong>Instrument Type</strong>: {row.instrumentType || '-'}</div>
                          <div><strong>Legal Structure</strong>: {row.legalStructure || '-'}</div>
                          <div><strong>Yield</strong>: {row.yield ? row.yield + '%' : '-'}</div>
                          <div><strong>TER</strong>: {row.ter ? row.ter + '%' : '-'}</div>
                          <div><strong>Methodology</strong>: {row.methodology || '-'}</div>
                        </Typography>
                      </>
                    }
                    classes={{tooltip: classes.infoTooltip}}
                  >
                    <MoreVertIcon className={classnames(classes.more, {'disabled': row.name === 'Portfolio'})}/>
                  </Tooltip>
                </TableCell>

              </TableRow>
            )}
          </TableBody>

        </Table>

      </div>

      <InfoBox className={classes.infoBox} type="neutral" show={compare.length === 1}><strong>Comment: </strong>Using the alchemist methodologies, no funds with superior performance have been found.</InfoBox>
      <InfoBox className={classes.infoBox} type="neutral" show={compare.length > 1}><strong>Comment: </strong>The suggested funds above have superior annualized return and/or YTD than the portfolio in question and have been selected under the alchemist methodologies. The historical performance of the best funds and your portfolio can be seen below.</InfoBox>

    </>
  )
}

export default withStyles(styles)(FundsTableCompare);
