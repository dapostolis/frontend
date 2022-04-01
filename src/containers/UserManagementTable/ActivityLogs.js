import React, {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import useFetcherList from 'containers/ListHook';
import HeadingSideLine from 'components/HeadingSideLine';
import {
  Link as MLink,
  Table,
  TableBody,
  TableCell, TableFooter,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import {format as dateFormat} from 'date-fns';
import {Link} from 'react-router-dom';
import Loader from 'components/LoaderCircle';
import TablePaginationActions from 'components/TablePaginationActions';


const styles = theme => ({
  loader: {
    top: 30,
  },

  logsWrap: {
    marginTop: 10,
  },
  acDate: {
    fontSize: 14,
  },
  viewAllWrap: {
    display: 'inline-block',
    marginTop: 20,
  },
  btnLink: {
    fontWeight: 'bold',
    border: '1px solid ' + theme.palette.secondary.main,
    borderRadius: 5,
    padding: '8px 4px',
    transition: 'all 0.3s',
    '&:hover': {
      textDecoration: 'none',
      color: '#fff',
      backgroundColor: theme.palette.secondary.main,
    },
  },
});


function ActivityLogs({classes, filterValues}) {
  const [mounted, setMounted] = useState(false);

  const {
    loading,
    list: {
      content,
      page,
    },
    handleFilter,
    handleNavigate,
    handleChangeRows,
  } = useFetcherList('activity', {
    content: [],
    page: {
      size: 50,
      totalPages: 0,
      number: 0,
      totalElements: 0,
    },
    sort: {
      field: 'dateCreated',
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

  if (loading) {
    return <Loader className={classes.loader} start={true}/>
  }

  return (
    <>
      <HeadingSideLine title="Activity Logs"/>

      <div className={classes.logsWrap}>
            <div className={classes.tableWrapper}>
              <Table className={classes.table}>
                <TableBody>
                  {content.map((activity, key) =>
                    <TableRow key={key}>
                      <TableCell>
                        <Typography key={key} variant="body1">
                          - <span className={classes.acDate}>{dateFormat(activity.dateCreated, 'DD/MM/YYYY - HH:mm')} </span>
                          (
                            <span>
                              <MLink
                                  component={Link} to={'/user/' + activity.userID}
                                  color="secondary"
                              >
                                {activity.username}
                              </MLink>
                            </span>
                          )
                          <span> {activity.action.replace(/_/g, ' ').toLowerCase()} action in category {activity.category.replace(/_/g, ' ').toLowerCase()} {activity.host === '-' ? '' : 'from host ' + activity.host}{activity.httpCode ? ' (response ' + activity.httpCode + ' in ' + activity.duration + ')' : ''}</span>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[page.size]}
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
            </div>
      </div>
      {/*todo setup filters and pagination on this page*/}
      {/*<Typography component="div" className={classes.viewAllWrap}><MLink className={classes.btnLink} component={Link} to="/user/activity" color="secondary">View all activity</MLink></Typography>*/}
    </>
  )
}

export default withStyles(styles)(ActivityLogs);
