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
import {AuthConsumer} from 'context/AuthContext';
import {useSnackbar} from 'notistack/build';
import AlertDialog from '../../components/AlertDialog';


const styles = theme => ({
  rootTable: {
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

function FaqList({classes, history, location}) {

  const RESOURCE = 'faq';
  const initialState = {
    content: [],
    page: {
      size: 5,
      totalPages: 0,
      number: 0,
      totalElements: 0,
    },
    sort: {
      field: 'title',
      direction: 'asc',
    },
    // filter: {
    //   name: '',
    // },
  };

  const {enqueueSnackbar} = useSnackbar();

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
  const [lists, setLists] = useState({
    categories: [],
  });
  const [form, setForm] = useState({
    loading: false,
    isOpened: false,
    fields: {},
  });

  useEffect(() => {
    function fetchLists() {

        let pRequests = [];

        // Categories
        pRequests.push(new Promise((resolve, reject) => {
          request
            .get(`${API}enum/Faq/Category/values`)
            .then(({data:categories}) => {
              resolve(categories);
            })
            .catch((error) => {
              console.log(error);
            })
        }));


        Promise.all(pRequests)
          .then(([categories]) => {
            setLists({
              categories: categories,
            });
          })
          .catch(error => console.log(error));

      }

    fetchLists();
  }, []);

  useEffect(() => {
    // Check if URL is /add or /:id
    let getEntityById = (id) => {
      request
        .get(`${API}faq/${id}`)
        .then(({data: {returnobject: entity}}) => {

          delete entity.dateCreated;

          setTimeout(() => {
            setForm({
              loading: false,
              isOpened: true,
              fields: {
                ...entity,
              },
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


  const handleClickOpenFormCreate = () => {
    setForm({
      loading: form.loading,
      isOpened: true,
      fields: {},
    })
  };

  const handleClickOpenFormEdit = (entity) => {
    setForm({
      ...form,
      isOpened: true,
      fields: {
        id: entity.id,
        title: entity.title,
        description: entity.description,
        category: entity.category
      }
    });

    history.push('/faq/' + entity.id);
  };

  const handleCloseForm = () => {
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

      history.push('/faq');
    }, 400);
  };

  const handleSubmit = (payload) => {

    let urlPath = 'faq',
        method = 'post';

    if (!payload.id) {
      delete payload.id;
    } else {
      method = 'put';
      urlPath += '/' + payload.id;
    }

    setForm({
      ...form,
      loading: true,
    });


    request[method](`${API}${urlPath}`, payload)
      .then(() => {
        handleCloseForm();
        fetchList(0); // refetch
      })
      .catch((error) => {
        setForm({
          ...form,
          loading: false,
        });

        const {response: {data}} = error;

        if (data) {
          enqueueSnackbar(data.message, {variant: 'error'});
        }

        console.log(error);
      })

  };

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
    <MainPaperWrapper>

      <AlertDialog
        isOpened={delItem.id ? true : false}
        onHandleClose={handleResetDelItem}
        yes={() => handleDelete(delItem.id)}
      />

      <MainHeaderWrapper>
        <HeadingsLine title="FAQs' Management" subtitle="Manage platform FAQs"/>

        <FlexSpacer/>

        <ActionsWrapper>

          <Fab component={Link} to="/faq/add" size="medium" color="secondary" arial-label="Add"
               onClick={handleClickOpenFormCreate}>
            <AddIcon/>
          </Fab>

          {/*Form*/}
          <AuthConsumer>
            {({user}) => (
              <Dialog fullWidth maxWidth="sm" open={form.isOpened} onClose={handleCloseForm}>
                <LoaderLine start={form.loading}/>

                <DialogTitle>{!form.fields.id
                  ? 'Create a new FAQ'
                  : 'Edit FAQ "' + form.fields.title + '"'}
                </DialogTitle>

                <DialogContent>
                  <DialogContentText>
                    Please fill out the form below.
                  </DialogContentText>

                  <Switch>
                    <Route path="/faq/add" render={() => <FormDialog
                      loading={form.loading}
                      lists={lists}
                      user={user}
                      onHandleSubmit={handleSubmit}
                    />}/>

                    <Route path="/faq/:id" render={() => <FormDialog
                      loading={form.loading}
                      lists={lists}
                      user={user}
                      fields={form.fields}
                      onHandleSubmit={handleSubmit}
                    />}/>
                  </Switch>

                </DialogContent>
              </Dialog>
            )}

          </AuthConsumer>

        </ActionsWrapper>
      </MainHeaderWrapper>

      <Paper elevation={0} className={classes.rootTable}>

        <LoaderLine start={loading}/>

        <div className={classes.tableWrapper}>
          {content.length === 0 && !loading
            ? <Typography align="center" className={classes.empty}>No available data. Create a new FAQ <MLink component={Link} color="secondary" to="/faq/add" onClick={handleClickOpenFormCreate}>here</MLink>.</Typography>
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
                      id="sort-title"
                      active={sort.field === 'title'}
                      direction={sort.direction}
                      className={classes.tSortLbl}
                      classes={{
                        active: classes.tSortLblActive
                      }}
                      onClick={handleSort}
                    >
                      Title
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>

                <TableCell sortDirection={sort.direction}>
                  <Tooltip
                    title="Sort"
                    enterDelay={300}
                  >
                    <TableSortLabel
                      id="sort-description"
                      active={sort.field === 'description'}
                      direction={sort.direction}
                      className={classes.tSortLbl}
                      classes={{
                        active: classes.tSortLblActive
                      }}
                      onClick={handleSort}
                    >
                      Description
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>

                <TableCell>
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

                <TableCell>
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

                <TableCell align="right"></TableCell>

              </TableRow>
            </TableHead>

            <TableBody>
              {content.map(row =>
                <TableRow key={row.id} hover>
                  <TableCell component="th" scope="row">{row.title}</TableCell>
                  <TableCell>{row.description}</TableCell>
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

    </MainPaperWrapper>
  )

}

export default withStyles(styles)(FaqList);
