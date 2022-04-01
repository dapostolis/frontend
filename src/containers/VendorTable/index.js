import React, {useEffect, useState} from 'react';
import {Link, Route, Switch} from 'react-router-dom';
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
import AlertDialog from '../../components/AlertDialog'


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

function VendorList({classes, history, location}) {

  const RESOURCE = 'vendor';
  const initialState = {
    content: [],
    page: {
      size: 5,
      totalPages: 0,
      number: 0,
      totalElements: 0,
    },
    sort: {
      field: 'companyName',
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
  const [form, setForm] = useState({
    loading: false,
    isOpened: false,
    fields: {},
  });

  useEffect(() => {
    // Check if URL is /add or /:id
    let getEntityById = (id) => {
      request
        .get(`${API}vendor/${id}`)
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
   * Handlers
   */


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
        companyName: entity.companyName || '',
        contactName: entity.contactName || '',
        vendorType: entity.vendorType || '',
        description: entity.description || '',
        email: entity.email || '',
        address: entity.address || '',
        telephone: entity.telephone || '',
      }
    });

    history.push('/vendor/' + entity.id);
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

      history.push('/vendor');
    }, 400);
  };

  const handleSubmit = (payload) => {

    setForm({
      ...form,
      loading: true,
    });

    let verb = 'put';
    if (!payload.id) {
      verb = 'post';
      delete payload.id;
    }

    request[verb](`${API}vendor`, payload)
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
        <HeadingsLine title="Vendors' Management" subtitle="Manage platform vendors"/>

        <FlexSpacer/>

        <ActionsWrapper>

          <Fab component={Link} to="/vendor/add" size="medium" color="secondary" arial-label="Add"
               onClick={handleClickOpenFormCreate}>
            <AddIcon/>
          </Fab>

          {/*Form*/}
          <Dialog fullWidth maxWidth="sm" open={form.isOpened} onClose={handleCloseForm}>
            <LoaderLine start={form.loading}/>

            <DialogTitle>{!form.fields.id
              ? 'Create a new Vendor'
              : 'Edit Vendor "' + form.fields.companyName + '"'}
            </DialogTitle>

            <DialogContent>
              <DialogContentText>
                Please fill out the form below.
              </DialogContentText>

              <Switch>
                <Route path="/vendor/add" render={() => <FormDialog
                  loading={form.loading}
                  onHandleSubmit={handleSubmit}
                />}/>

                <Route path="/vendor/:id" render={() => <FormDialog
                  loading={form.loading}
                  fields={form.fields.id ? form.fields : undefined}
                  onHandleSubmit={handleSubmit}
                />}/>
              </Switch>

            </DialogContent>
          </Dialog>

        </ActionsWrapper>
      </MainHeaderWrapper>

      <Paper elevation={0} className={classes.rootTable}>

        <LoaderLine start={loading}/>

        <div className={classes.tableWrapper}>
          {content.length === 0 && !loading
            ? <Typography align="center" className={classes.empty}>No available data. Create a new Vendor <MLink component={Link} color="secondary" to="/vendor/add" onClick={handleClickOpenFormCreate}>here</MLink>.</Typography>
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
                      id="sort-companyName"
                      active={sort.field === 'companyName'}
                      direction={sort.direction}
                      className={classes.tSortLbl}
                      classes={{
                        active: classes.tSortLblActive
                      }}
                      onClick={handleSort}
                    >
                      Company Name
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>

                <TableCell sortDirection={sort.direction}>
                  <Tooltip
                    title="Sort"
                    enterDelay={300}
                  >
                    <TableSortLabel
                      id="sort-contactName"
                      active={sort.field === 'contactName'}
                      direction={sort.direction}
                      className={classes.tSortLbl}
                      classes={{
                        active: classes.tSortLblActive
                      }}
                      onClick={handleSort}
                    >
                      Contact Name
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>

                <TableCell sortDirection={sort.direction}>
                  <Tooltip
                    title="Sort"
                    enterDelay={300}
                  >
                    <TableSortLabel
                      id="sort-email"
                      active={sort.field === 'email'}
                      direction={sort.direction}
                      className={classes.tSortLbl}
                      classes={{
                        active: classes.tSortLblActive
                      }}
                      onClick={handleSort}
                    >
                      Email
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <Tooltip
                    title="Sort"
                    enterDelay={300}
                  >
                    <TableSortLabel
                      id="sort-address"
                      active={sort.field === 'address'}
                      direction={sort.direction}
                      className={classes.tSortLbl}
                      classes={{
                        active: classes.tSortLblActive
                      }}
                      onClick={handleSort}
                    >
                      Address
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <Tooltip
                    title="Sort"
                    enterDelay={300}
                  >
                    <TableSortLabel
                      id="sort-telephone"
                      active={sort.field === 'telephone'}
                      direction={sort.direction}
                      className={classes.tSortLbl}
                      classes={{
                        active: classes.tSortLblActive
                      }}
                      onClick={handleSort}
                    >
                      Telephone
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
                  <TableCell component="th" scope="row">{row.companyName}</TableCell>
                  <TableCell>{row.contactName}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.telephone}</TableCell>

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

export default withStyles(styles)(VendorList);
