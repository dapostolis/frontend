import React, {useEffect, useState} from 'react'
import {withStyles} from '@material-ui/core/styles'
import useFetcherList from 'containers/ListHook'
import HeadingSideLine from 'components/HeadingSideLine'
import {
  IconButton,
  Link as MLink, Table, TableBody,
  TableCell, TableFooter,
  TableHead, TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@material-ui/core';
import {format as dateFormat} from 'date-fns'
import {Link} from 'react-router-dom'
import Loader from 'components/LoaderCircle'
import {
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckBox as CheckBoxIcon
} from '@material-ui/icons';
import TableActionsWrapper from '../../components/TableRowActionsWrapper';
import TablePaginationActions from '../../components/TablePaginationActions';
import {request} from '../../constants/alias';
import {API} from '../../constants/config';
import {useSnackbar} from 'notistack';


const styles = () => ({
  loader: {
    top: 30,
  },
});


const PaymentHistory = React.memo(function ({classes, filterValues}) {
  const {enqueueSnackbar} = useSnackbar();
  const [mounted, setMounted] = useState(false);

  const {
    loading,
    list: {
      sort,
      page,
      content,
    },
    fetchList,
    handleSort,
    handleFilter,
    handleNavigate,
    handleChangeRows,
  } = useFetcherList('paymentrequest', {
    content: [],
    page: {
      size: 5,
      totalPages: 0,
      number: 0,
      totalElements: 0,
    },
    sort: {
      field: 'status',
      direction: 'desc',
    },
    filter: {
      username: '',
    },
  });

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      handleFilter(filterValues);
    }
  }, [filterValues.username]);

  async function handleClickConfirmPayment(id) {
    try {
      await request.put(`${API}paymentrequest/${id}/confirm`);
      fetchList();
    } catch (ex) {
      console.log(ex);
      enqueueSnackbar('Something went wrong. Please contact the system administrator', {variant: 'error'});
    }
  }

  function isPaymentConfirmed(status) {
    return status.toLowerCase() === 'confirmed';
  }

  if (loading) {
    return <Loader className={classes.loader} start={true}/>
  }

  const emptyRows = page.size - content.length;

  return (
    <>
      <HeadingSideLine title="Payment History"/>

      <Table className={classes.table}>
        <TableHead className={classes.tHead}>
          <TableRow>

            <TableCell sortDirection={sort.direction}>
              <Tooltip
                title="Sort"
                enterDelay={300}
              >
                <TableSortLabel
                  id="sort-username"
                  active={sort.field === 'username'}
                  direction={sort.direction}
                  className={classes.tSortLbl}
                  classes={{
                    active: classes.tSortLblActive,
                  }}
                  onClick={handleSort}
                >
                  Email
                </TableSortLabel>
              </Tooltip>
            </TableCell>

            <TableCell sortDirection={sort.direction}>
              <Tooltip
                title="Sort"
                enterDelay={300}
              >
                <TableSortLabel
                  id="sort-amount"
                  active={sort.field === 'amount'}
                  direction={sort.direction}
                  className={classes.tSortLbl}
                  classes={{
                    active: classes.tSortLblActive,
                  }}
                  onClick={handleSort}
                >
                  Amount
                </TableSortLabel>
              </Tooltip>
            </TableCell>

            <TableCell sortDirection={sort.direction}>
              <Tooltip
                title="Sort"
                enterDelay={300}
              >
                <TableSortLabel
                  id="sort-status"
                  active={sort.field === 'status'}
                  direction={sort.direction}
                  className={classes.tSortLbl}
                  classes={{
                    active: classes.tSortLblActive,
                  }}
                  onClick={handleSort}
                >
                  Status
                </TableSortLabel>
              </Tooltip>
            </TableCell>

            <TableCell sortDirection={sort.direction}>
              <Tooltip
                title="Sort"
                enterDelay={300}
              >
                <TableSortLabel
                  id="sort-requestDate"
                  active={sort.field === 'requestDate'}
                  direction={sort.direction}
                  className={classes.tSortLbl}
                  classes={{
                    active: classes.tSortLblActive,
                  }}
                  onClick={handleSort}
                >
                  Requested Date
                </TableSortLabel>
              </Tooltip>
            </TableCell>

            <TableCell>
              <Tooltip
                title="Sort"
                enterDelay={300}
              >
                <TableSortLabel
                  id="sort-confirmationDate"
                  active={sort.field === 'confirmationDate'}
                  direction={sort.direction}
                  className={classes.tSortLbl}
                  classes={{
                    active: classes.tSortLblActive,
                  }}
                  onClick={handleSort}
                >
                  Confirmation date
                </TableSortLabel>
              </Tooltip>
            </TableCell>

            <TableCell align="right">&nbsp;</TableCell>

          </TableRow>
        </TableHead>

        <TableBody>
          {content.map(row => (
            <TableRow key={row.id} hover>

              <TableCell>
                <MLink component={Link} to={'user/' + row.id} color="secondary">{row.user.username}</MLink>
              </TableCell>

              <TableCell>{row.amount}</TableCell>

              <TableCell className={classes.tCellModule}>{row.status}</TableCell>

              <TableCell>{dateFormat(row.requestDate, 'DD/MM/YYYY - HH:mm')}</TableCell>

              <TableCell>{row.confirmationDate ? dateFormat(row.confirmationDate, 'DD/MM/YYYY - HH:mm') : '-'}</TableCell>

              <TableCell align="right">
                <TableActionsWrapper>

                  <Tooltip title="Confirm Payment" aria-label="confirm">
                    <IconButton classes={{root: classes.ActionBtn}} aria-haspopup="true"
                                color="inherit"
                                onClick={() => handleClickConfirmPayment(row.id)}
                    >
                      {isPaymentConfirmed(row.status) ? <CheckBoxIcon/> : <CheckBoxOutlineBlankIcon/>}
                    </IconButton>
                  </Tooltip>

                </TableActionsWrapper>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{height: 48 * emptyRows}}>
              <TableCell colSpan={4}/>
            </TableRow>
          )}
        </TableBody>

        {/*Pagination*/}
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              count={page.totalElements}
              rowsPerPage={page.size}
              page={page.number}
              SelectProps={{
                native: true,
              }}
              onChangePage={handleNavigate}
              onChangeRowsPerPage={handleChangeRows}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </>
  )
});

export default withStyles(styles)(PaymentHistory);
