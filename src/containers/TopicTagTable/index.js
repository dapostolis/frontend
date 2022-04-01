import React, {useEffect, useState} from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import {format as dateFormat} from 'date-fns';
import useFetcherList from 'containers/ListHook';
import TableActionsWrapper from 'components/TableRowActionsWrapper';
import {request} from 'constants/alias';
import {API, CRUD} from 'constants/config';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  IconButton,
  Link as MLink,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography
} from '@material-ui/core';
import {Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, FilterList as FilterIcon} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';
import FlexSpacer from 'components/FlexSpacer';
import HeadingsLine from 'components/HeadingSingleLine';
import ActionsWrapper from 'components/MainActionsWrapper';
import MainHeaderWrapper from 'components/MainHeaderWrapper';
import TablePaginationActions from 'components/TablePaginationActions';
import LoaderLine from 'components/LoaderLine';
import FormDialog from './Form';
import MainPaperWrapper from 'components/MainPaperWrapper';
import AlertDialog from 'components/AlertDialog';


const styles = theme => ({
  tableRoot: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    position: 'relative',
    border: '1px solid ' + theme.palette.primary.light,
    /*'&.loading::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        opacity: '.5',
    },*/
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  tHead: {
    backgroundColor: theme.palette.primary.dark,
  },
  tSortLbl: {
    fontSize: 16,
    color: theme.palette.primary.main,
    '&:hover, &:focus': {
      color: theme.palette.primary.light,
    }
  },
  tSortLblActive: {
    color: theme.palette.primary.light
  },

  empty: {
    fontSize: '18px',
    padding: '60px 15px',
  },
  ActionBtn: {
    padding: 0,
  },
});

function TopicTagList({classes, history, location}) {

  const RESOURCE = 'topictag';
  const initialState = {
    content: [],
    page: {
      size: 5,
      totalPages: 0,
      number: 0,
      totalElements: 0,
    },
    sort: {
      field: 'tag',
      direction: 'asc',
    },
  };
  const {
    loading,
    list: {
      content,
      page,
      sort,
    },
    fetchList,
    handleNavigate,
    handleChangeRows,
    handleSort,
    handleDelete,
  } = useFetcherList(RESOURCE, initialState);
  // const [lists, setLists] = useState({ // todo
  //   categories: [],
  // });
  const [form, setForm] = useState({
    loading: false,
    isOpened: false,
    fields: {},
  });

  useEffect(() => {
    // fetchLists();

    // Check if URL is /add or /:id
    let getEntityById = (id) => {
      request
        .get(`${API}topictag/${id}`)
        .then(({data: {returnobject: entity}}) => {

          delete entity.dateCreated;

          setTimeout(() => {
            setForm({
              loading: false,
              isOpened: true,
              fields: entity,
            })
          }, CRUD.delay);

        })
        .catch(error => console.log(error));
    };

    if (location) {
      let temp = location.pathname.split('/'),
        pathVariable;

      if (temp.length === 3) {
        pathVariable = temp[2];

        if (pathVariable === 'add') {
          setForm({
            loading: false,
            isOpened: true,
            fields: {},
          });
        } else {
          getEntityById(pathVariable);
        }
      }

    }
  }, [location.pathname]);

  const [delItem, setDelItem] = useState({});


  /**
   * Fetchers
   */

  function fetchLists() {

    // let pRequests = [];

    // Countries
    /*pRequests.push(new Promise((resolve, reject) => {
      request
        .post(`${API}enum/{enumClass}/{enumValue}/values`)
        .then(({data: {returnobject: {content:categories}}}) => {

          resolve(categories);

        })
        .catch((error) => {
          console.log(error);
        })
    }));


    Promise.all(pRequests)
      .then(l => {
        setLists({
          categories: l[0],
        });
      })
      .catch(error => console.log(error));*/

  }


  /**
   * Handlers
   */


  function handleClickOpenFormCreate() {
    setForm({
      loading: form.loading,
      isOpened: true,
      fields: {},
    })
  }

  function handleClickOpenFormEdit(entity) {
    setForm({
      ...form,
      isOpened: true,
      fields: {
        id: entity.id,
        tag: entity.tag,
        category: entity.category,
      }
    });

    history.push('/topic-tag/' + entity.id);
  }

  function handleCloseForm() {
    setForm({
      ...form,
      loading: false,
      isOpened: false,
    });
    setTimeout(() => {
      setForm({
        loading: false,
        isOpened: false,
        fields: {},
      });

      history.push('/topic-tag');
    }, 400);
  }

  function handleSubmit(payload) {

    setForm({
      ...form,
      loading: true,
    });

    let verb = 'put';
    if (!payload.id) {
      verb = 'post';
      delete payload.id;
    }

    request[verb](`${API}topictag`, payload)
      .then(() => {
        handleCloseForm();
        fetchList(0); // refetch
      })
      .catch((error) => {
        setForm({
          ...form,
          loading: false,
        });

        console.log(error);
      })

  }

  function handleDeleteDialog(id) {
    setDelItem({id});
  }

  function handleResetDelItem() {
    setDelItem({});
  }


  /**
   * Prepare for rendering
   */

  const emptyRows = page.size - content.length;

  return (
    <MainPaperWrapper className={classes.mainWrap}>
      <AlertDialog
        isOpened={delItem.id ? true : false}
        onHandleClose={handleResetDelItem}
        yes={() => handleDelete(delItem.id)}
      />

      <MainHeaderWrapper>
        <HeadingsLine title="Topic Tags' Management" subtitle="Manage platform Topic Tags"/>

        <FlexSpacer/>

        <ActionsWrapper>

          <Fab component={Link} to="/topic-tag/add" size="medium" color="secondary" arial-label="Add"
               onClick={handleClickOpenFormCreate}>
            <AddIcon/>
          </Fab>

          {/*Form*/}
          <Dialog fullWidth maxWidth="sm" open={form.isOpened} onClose={handleCloseForm}>
            <LoaderLine start={form.loading}/>

            <DialogTitle>{!form.fields.id
              ? 'Create a new Topic Tag'
              : 'Edit Topic Tag "' + form.fields.tag + '"'}
            </DialogTitle>

            <DialogContent>
              <DialogContentText>
                Please fill out the form below.
              </DialogContentText>

              <Switch>
                <Route path="/topic-tag/add" render={() => <FormDialog
                  loading={form.loading}
                  // lists={lists}
                  onHandleSubmit={handleSubmit}
                />}/>

                <Route path="/topic-tag/:id" render={() => <FormDialog
                  loading={form.loading}
                  // lists={lists}
                  fields={form.fields.id ? form.fields : undefined}
                  onHandleSubmit={handleSubmit}
                />}/>
              </Switch>

            </DialogContent>
          </Dialog>

        </ActionsWrapper>
      </MainHeaderWrapper>

      <Paper elevation={0} className={classes.tableRoot}>

        <LoaderLine start={loading}/>

        <div className={classes.tableWrapper}>
          {content.length === 0 && !loading
            ? <Typography align="center" className={classes.empty}>No available data. Create a new Topic Tag <MLink component={Link} color="secondary" to="/topic-tag/add" onClick={handleClickOpenFormCreate}>here</MLink>.</Typography>
            :
          <Table className={classes.table}>
            <TableHead className={classes.tHead}>
              <TableRow>

                <TableCell sortDirection={sort.direction}>
                  <Tooltip
                    title="Sort"
                    enterDelay={300}
                  >
                    <TableSortLabel
                      id="sort-tag"
                      active={sort.field === 'tag'}
                      direction={sort.direction}
                      className={classes.tSortLbl}
                      classes={{
                        active: classes.tSortLblActive
                      }}
                      onClick={handleSort}
                    >
                      Tag
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>

                <TableCell sortDirection={sort.direction}>
                  <Tooltip
                    title="Sort"
                    enterDelay={300}
                  >
                    <TableSortLabel
                      id="sort-category"
                      active={sort.field === 'category'}
                      direction={sort.direction}
                      className={classes.tSortLbl}
                      classes={{
                        active: classes.tSortLblActive
                      }}
                      onClick={handleSort}
                    >
                      Category
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>

                <TableCell sortDirection={sort.direction}>
                  <Tooltip
                    title="Sort"
                    enterDelay={300}
                  >
                    <TableSortLabel
                      id="sort-dateCreated"
                      active={sort.field === 'dateCreated'}
                      direction={sort.direction}
                      className={classes.tSortLbl}
                      classes={{
                        active: classes.tSortLblActive
                      }}
                      onClick={handleSort}
                    >
                      Date Created
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>


                <TableCell align="right">
                  <Tooltip title="Filter list" placement="top-start" aria-label="filter-list">
                    <IconButton color="primary">
                      <FilterIcon/>
                    </IconButton>
                  </Tooltip>
                </TableCell>

              </TableRow>
            </TableHead>

            <TableBody>
              {content.map(row =>
                <TableRow key={row.id} hover>
                  <TableCell component="th" scope="row">{row.tag}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{dateFormat(row.dateCreated, 'DD/MM/YYYY - HH:mm')}</TableCell>

                  <TableCell align="right">
                    <TableActionsWrapper>

                      <Tooltip title="Edit" aria-label="edit">
                        <IconButton classes={{root: classes.ActionBtn}} aria-haspopup="true"
                                    color="inherit"
                                    onClick={() => handleClickOpenFormEdit(row)}
                        >
                          <EditIcon/>
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete" aria-label="delete">
                        <IconButton classes={{root: classes.ActionBtn}} aria-haspopup="true"
                                    color="inherit"
                                    onClick={() => handleDeleteDialog(row.id)}
                        >
                          <DeleteIcon/>
                        </IconButton>
                      </Tooltip>

                    </TableActionsWrapper>
                  </TableCell>
                </TableRow>
              )}
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
          </Table>}
        </div>
      </Paper>

      {/*<Filters/>*/}
    </MainPaperWrapper>
  )

}

export default withStyles(styles)(TopicTagList);
