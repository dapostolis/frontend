import React, {useEffect, useState} from 'react';
import {Paper, Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core';
import HeadingSideLine from '../../components/HeadingSideLine';
import {withStyles} from '@material-ui/core/styles';
import {request} from '../../constants/alias';
import {API} from '../../constants/config';
import {useSnackbar} from 'notistack';
import classnames from 'classnames';
import {format as dateFormat} from 'date-fns';
import Authorized from '../../components/Auth/Authorized';
import Loader from '../../components/LoaderCircle';


const styles = theme => ({
  Paper: {
    position: 'relative',
    minHeight: 120,
    padding: theme.spacing.unit * 2,
  },

  loading: {
    top: 35,
  },

  tableRoot: {
    width: '100%',
    maxHeight: 320,
    marginTop: theme.spacing.unit * 3,
    marginRight: 10,
    position: 'relative',
    // border: '1px solid ' + theme.palette.primary.light,
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
    border: '1px solid ' + theme.palette.primary.light,
  },
  table: {},
  tHead: {
    backgroundColor: theme.palette.primary.light,
  },
  tRow: {
    height: 46,
  },
  tBodyRow: {
    '&.pending': {
      backgroundColor: theme.palette.danger.light,
    },
  },

  // CELL
  tCellGeneric: {
    padding: 10,
    cursor: 'default',

    '&:last-child': {
      paddingRight: 0,
    },

    '.pending &': {
      color: theme.palette.getContrastText(theme.palette.danger.light),
    },
  },
  tCellHead: {
    fontSize: 14,
    color: theme.palette.secondary.main,

    '&:hover, &:focus': {
      opacity: '0.7',
    },
  },
});

function PaymentHistoryPaper({classes, user}) {
  const {enqueueSnackbar} = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState([]);

  useEffect(() => {
    fetch();
  }, []);

  function fetch() {
    setLoading(true);

    request.post(`${API}paymentrequest/list?page=0&size=1000`, {})
      .then(({data: {returnobject: {content: payments}}}) => {
        setState(payments);
        setLoading(false);
      })
      .catch(ex => {
        console.log(ex);
        enqueueSnackbar('Something went wrong. Please contact your system administrator');
        setLoading(false);
      });
  }

  return (
    <Paper className={classes.Paper}>
      <HeadingSideLine title="Payment history"/>

      <Loader className={classes.loading} size="small" start={loading}/>

      {!loading ?
        <div className={classes.tableRoot}>

          <Table className={classes.table}>
            <TableHead className={classes.tHead}>
              <TableRow className={classes.tRow}>
                <Authorized
                  resource="profile:user:paymenthistory"
                  yes={() => <TableCell
                    className={classnames(classes.tCellGeneric, classes.tCellHead)}>User</TableCell>}
                />
                <TableCell className={classnames(classes.tCellGeneric, classes.tCellHead)}>Amount</TableCell>
                <TableCell className={classnames(classes.tCellGeneric, classes.tCellHead)}>Status</TableCell>
                <TableCell className={classnames(classes.tCellGeneric, classes.tCellHead)}>Requested Date</TableCell>
                <TableCell className={classnames(classes.tCellGeneric, classes.tCellHead)}>Confirmation Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {state.length > 0 && state.map((row, key) => (
                <TableRow key={key} className={classnames(classes.tBodyRow, row.status.toLowerCase())}>
                  <Authorized
                    resource="profile:user:paymenthistory"
                    yes={() => <TableCell className={classes.tCellGeneric}>{row.user.email}</TableCell>}
                  />
                  <TableCell
                    className={classes.tCellGeneric}>{Number(row.amount).toFixed(2) + ' ' + user.currency}</TableCell>
                  <TableCell className={classes.tCellGeneric}>{row.status}</TableCell>
                  <TableCell className={classes.tCellGeneric}>{dateFormat(row.requestDate, 'DD/MM/YYYY')}</TableCell>
                  <TableCell
                    className={classes.tCellGeneric}>{row.confirmationDate ? dateFormat(row.confirmationDate, 'DD/MM/YYYY') : '-'}</TableCell>
                </TableRow>
              ))}

            </TableBody>

          </Table>

        </div>
        : ''}
    </Paper>
  );
}

export default withStyles(styles)(PaymentHistoryPaper);