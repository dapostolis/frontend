import React, {useEffect, useState} from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import {format as dateFormat} from 'date-fns';
import useFetcherList from 'containers/ListHook';
import TableActionsWrapper from 'components/TableRowActionsWrapper';
import {request} from 'constants/alias';
import {API, CRUD} from 'constants/config';
import {
  Chip,
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
  Typography,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  VpnKey as VpnKeyIcon,
  FilterList as FilterIcon,
  LockOpen as LockOpenIcon,
  Block as BlockIcon
} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';
import FlexSpacer from 'components/FlexSpacer';
import HeadingsLine from 'components/HeadingSingleLine';
import ActionsWrapper from 'components/MainActionsWrapper';
import MainHeaderWrapper from 'components/MainHeaderWrapper';
import TablePaginationActions from 'components/TablePaginationActions';
import LoaderLine from 'components/LoaderLine';
import FormDialog from './FormDialog';
import {modulesParser} from 'utils/generic';
import ModulesDialog from './ModulesDialog';
import MainBareWrapper from 'components/MainBareWrapper'
import classnames from 'classnames';
import Filters from './Filters';
import ActivityLogs from './ActivityLogs';
import AlertDialog from 'components/AlertDialog';
import PaymentHistory from './PaymentHistory';
import {convertStringToMachineName} from '../../utils/generic';
import {useSnackbar} from 'notistack';
import copy from 'copy-to-clipboard';


const styles = theme => ({
  // Generic
  disabled: {
    opacity: 0.3,
  },

  container: {
    display: 'flex',
  },

  Paper: {
    position: 'relative',
    minHeight: 200,
    marginBottom: theme.spacing.unit * 2,
    padding: 3,
  },

  // Table
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
  tableRow: {
    '&.disabled': {
      opacity: 0.4,
    },
  },
  tHead: {
    backgroundColor: theme.palette.primary.dark,
  },
  tSortLbl: {
    fontSize: 16,
    color: theme.palette.primary.main,
    '&:hover, &:focus': {
      color: theme.palette.primary.light,
    },
  },
  tSortLblActive: {
    color: theme.palette.primary.light,
  },

  tCellModule: {
    maxWidth: 400,
  },

  empty: {
    fontSize: '18px',
    padding: '60px 15px',
  },
  ActionBtn: {
    padding: 0,
  },

  chip: {
    cursor: 'pointer',
    margin: 2,
  },
  tCellLongHeight: {
    cursor: 'pointer',
    maxHeight: 45,
    overflow: 'hidden',
    '&:hover': {
      maxHeight: 'none',
      overflow: 'auto',
    },
  },

  logsWidget: {
    padding: theme.spacing.unit * 2,
  },

  // Sidebar
  rightSidebar: {
    width: '30%',
    minWidth: 250,

    '&.closed': {
      width: 0,
      minWidth: 'auto',
    },
  },


});


function UserModules({classes, user}) {
  let modules = modulesParser(user.categories).filter(module => module.enabled);

  if (user.role === 'WEALTH_MANAGER') {
    if (modules.length > 0) {
      return modules.map((module, key) => <Chip key={key} label={module.name} className={classes.chip}/>);
    } else {
      return 'No modules enabled';
    }
  } else {
    return '--';
  }
}

function UserManagementList({classes, history, location}) {
  const RESOURCE = 'user';
  const initialState = {
    content: [],
    page: {
      size: 5,
      totalPages: 0,
      number: 0,
      totalElements: 0,
    },
    sort: {
      field: 'username',
      direction: 'asc',
    },
    filter: {
      username: '',
    },
  };
  const {
    loading,
    list: {
      content,
      page,
      sort,
      filter,
      isFilteringApplied,
    },
    fetchList,
    handleNavigate,
    handleChangeRows,
    handleSort,
    handleFilter,
    handleFilterReset,
  } = useFetcherList(RESOURCE, initialState);

  const {enqueueSnackbar} = useSnackbar();

  const [lists, setLists] = useState({
    countries: [],
    organizations: [],
    modules: [],
  });
  useEffect(() => {
    fetchLists();
  }, []);

  const [form, setForm] = useState({
    loading: false,
    isOpened: false,
    fields: {},
  });
  useEffect(() => {
    console.log('location.pathname changed');
    // Check if URL is /add or /:id
    let getEntityById = (id) => {
      request
        .get(`${API}user/${id}`)
        .then(({data: {returnobject: entity}}) => {

          // let modules = modulesParser(entity.categories);

          delete entity.dateCreated;
          delete entity.lastActivity;
          delete entity.categories;

          setTimeout(() => {
            setForm({
              loading: false,
              isOpened: true,
              fields: {
                ...entity,
                country: entity.country && entity.country.id ? entity.country.id : '',
                organization: entity.organization && entity.organization.id ? entity.organization.id : '',
                // modules: modules.filter(module => module.enabled).map(module => module.name),
              },
            })
          }, CRUD.delay);

        })
        .catch(error => console.log(error))

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

  const [modules, setModules] = useState({
    loading: false,
    isOpened: false,
    list: [], // List<Module> + price {id, name, price}
    user: {},
  });

  const [isFilterOpened, setIsFilterOpened] = useState(false);

  const [delItem, setDelItem] = useState({});


  function fetchLists() {

    let pRequests = [];

    // Countries
    pRequests.push(new Promise((resolve, reject) => {
      request
        .post(`${API}country/list?page=0&size=400&sort=name,asc`)
        .then(({data: {returnobject: {content: countries}}}) => resolve(countries))
        .catch((error) => console.log(error));
    }));

    // Organizations
    pRequests.push(new Promise((resolve, reject) => {
      request
        .post(`${API}organization/list?page=0&size=400&sort=name,asc`)
        .then(({data: {returnobject: {content: organizations}}}) => resolve(organizations))
        .catch((error) => console.log(error));
    }));

    // Modules
    pRequests.push(new Promise((resolve, reject) => {
      request
        .get(`${API}module/category`)
        .then(({data: {returnobject: categories}}) => {
          let modulesArr = modulesParser(categories),
            dictionary = {};

          modulesArr.forEach(module => {
            let key = convertStringToMachineName(module.name);//.toLowerCase().replace(' ', '');
            dictionary[key] = {
              id: module.id,
              name: module.name, //optional
              enabled: module.enabled, //optional
              price: module.price,
              subscriptionStarted: module.subscriptionStarted,
              subscriptionType: module.subscriptionType,
            }
          });

          resolve({
            array: modulesArr,
            dictionary: dictionary,
          });
        })
        .catch((error) => console.log(error));
    }));


    Promise.all(pRequests)
      .then(l => {
        setLists({
          countries: l[0],
          organizations: l[1],
          modules: l[2],
        });
      })
      .catch(error => console.log(error));

  }

  // Modal User handlers
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
        email: entity.email,
        firstName: entity.firstName,
        lastName: entity.lastName,
        phone: entity.phone,
        currency: entity.currency,
        country: entity.country.id,
        role: entity.role,
        organization: entity.organization.id,
        twoFactor: entity.twoFactor ? true : false,
        // modules: entity.modules && entity.modules.length > 0 ? entity.modules : [],
        skipTwoFactor: entity.skipTwoFactor ? true : false,
      },
    });

    history.push('/user/' + entity.id);
  };

  const handleCloseFormUser = () => {
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

      history.push('/user');
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

    request[verb](`${API}user`, payload)
      .then(() => {
        handleCloseFormUser();
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

  // Modal module handlers
  function handleClickOpenFormModules(user) {
    if (user.role === 'SUPERADMIN') return;

    let modulesList = modulesParser(user.categories).map(module => ({
      ...module,
      price: module.price >= 0 ? module.price : '',
      subscriptionStarted: module.subscriptionStarted || '',
      subscriptionType: module.subscriptionType || '',
    }));

    setModules({
      loading: false,
      isOpened: true,
      list: modulesList,
      user: user,
    });
  }

  function handleCloseFormModules() {
    setModules({
      loading: false,
      isOpened: false,
      list: [],
      user: {},
    })
  }

  function handleSubmitModulesForm(userId, values) {
    request
      .put(`${API}user/${userId}/modules`, values)
      .then(() => {
        fetchList(0);
        setModules({
          loading: false,
          isOpened: false,
          list: [],
          user: {},
        })
      })
      .catch(error => console.log(error));
  }

  // Filters
  function handleToggleFilters() {
    setIsFilterOpened(!isFilterOpened);
  }

  async function handleDeactivateUser(userId, isEnabled) {
    try {

      await request.put(`${API}user/${userId}/status`);

      fetchList(0);

      if (isEnabled) {
        enqueueSnackbar('User successfully deactivated', {variant: 'success'});
      } else {
        enqueueSnackbar('User successfully activated', {variant: 'success'});
      }

    } catch (ex) {
      console.log(ex);

      const response = ex.response;

      if (response.data) {
        const data = response.data;
        if (data.code === '2') {
          enqueueSnackbar('Deactivate action on user role SUPERADMIN is not allowed', {variant: 'error'});
        } else if (data.code === '3') {
          enqueueSnackbar('User reactivation is not allowed. Please contact the system administrator', {variant: 'warning'});
        } else {
          enqueueSnackbar('Something went wrong', {variant: 'error'});
        }
      }
    }
  }

  function copyLink(user) {

    let origin = window.location.origin;
    let page = user.enabled ? 'resetpassword' : 'validate';

    copy(origin + '/' + page + '/' + user.id + '/' + user.validationID);
    enqueueSnackbar('Link copied to clipboard', {variant: 'success'});

  }

  function handleDeleteDialog(user) {
    setDelItem({
      id: user.id,
      enabled: user.enabled,
    });
  }

  function handleResetDelItem() {
    setDelItem({});
  }


  //RENDER
  const emptyRows = page.size - content.length;

  return (
    <div className={classes.container}>
      <MainBareWrapper>

        <AlertDialog
          isOpened={delItem.id ? true : false}
          description={'Are you absolutely sure to ' + (delItem.enabled ? 'deactivate' : 'reactivate') + ' this user'}
          onHandleClose={handleResetDelItem}
          yes={() => handleDeactivateUser(delItem.id, delItem.enabled)}
        />

        {/*<Modal User Form/>*/}
        <Dialog fullWidth maxWidth="sm" open={form.isOpened} onClose={handleCloseFormUser}>
          <LoaderLine start={form.loading}/>

          <DialogTitle>{!form.fields.id
            ? 'Create a new User'
            : 'Edit User "' + form.fields.email + '"'}
          </DialogTitle>

          <DialogContent>
            <DialogContentText>
              Please fill out the form below.
            </DialogContentText>

            <Switch>
              <Route path="/user/add" render={() => <FormDialog
                loading={form.loading}
                lists={lists}
                onHandleSubmit={handleSubmit}
              />}/>

              <Route path="/user/:id" render={() => <FormDialog
                loading={form.loading}
                lists={lists}
                isSuperAdmin={form.fields.role === 'SUPERADMIN'}
                fields={form.fields.id ? form.fields : undefined}
                onHandleSubmit={handleSubmit}
              />}/>
            </Switch>

          </DialogContent>
        </Dialog>

        <ModulesDialog
          // user={}
          modules={modules}
          onHandleCloseFormModules={handleCloseFormModules}
          onHandleSubmitModulesForm={handleSubmitModulesForm}
        />

        <MainHeaderWrapper>
          <HeadingsLine title="Users' Management" subtitle="Manage platform users"/>

          <FlexSpacer/>

          <ActionsWrapper>

            <Fab component={Link} to="/user/add" size="medium" color="secondary" arial-label="Add"
                 onClick={handleClickOpenFormCreate}>
              <AddIcon/>
            </Fab>

          </ActionsWrapper>
        </MainHeaderWrapper>



        <Paper className={classnames(classes.Paper, classes.tableRoot)}>

          <LoaderLine start={loading}/>

          <Filters
            fields={filter}
            isFilteringApplied={isFilteringApplied}
            onHandleFilter={handleFilter}
            onHandleFilterReset={handleFilterReset}
          />

          <div className={classes.tableWrapper}>
            {content.length === 0 && !loading
              ? <Typography align="center" className={classes.empty}>No available data. Create a new User <MLink
                component={Link} color="secondary" to="/user/add">here</MLink>.</Typography>
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
                          id="sort-lastName"
                          active={sort.field === 'lastName'}
                          direction={sort.direction}
                          className={classes.tSortLbl}
                          classes={{
                            active: classes.tSortLblActive,
                          }}
                          onClick={handleSort}
                        >
                          Full Name
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>

                    <TableCell className={classes.tSortLbl}>Modules</TableCell>

                    <TableCell className={classes.tSortLbl}>2FA</TableCell>

                    <TableCell>
                      <Tooltip
                        title="Sort"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          id="sort-enabled"
                          active={sort.field === 'enabled'}
                          direction={sort.direction}
                          className={classes.tSortLbl}
                          classes={{
                            active: classes.tSortLblActive,
                          }}
                          onClick={handleSort}
                        >
                          Activated
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
                            active: classes.tSortLblActive,
                          }}
                          onClick={handleSort}
                        >
                          Date Created
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>

                    <TableCell align="right">
                      {/*<Tooltip title="Filter list" placement="top-start" aria-label="filter-list">
                        <IconButton color="primary" onClick={handleToggleFilters}>
                          <FilterIcon/>
                        </IconButton>
                      </Tooltip>*/}
                    </TableCell>

                  </TableRow>
                </TableHead>

                <TableBody>
                  {content.map(row => (
                    <TableRow key={row.id} className={classnames(classes.tableRow, {'disabled': !row.enabled})} hover>

                      <TableCell>
                        <MLink component={Link} to={'user/' + row.id} color="secondary">{row.username}</MLink>
                      </TableCell>

                      <TableCell>{row.lastName + ' ' + row.firstName}</TableCell>

                      <TableCell className={classes.tCellModule}>
                        <div className={classes.tCellLongHeight} onClick={() => handleClickOpenFormModules(row)}>
                          <UserModules classes={classes} user={row}/>
                        </div>
                      </TableCell>

                      <TableCell>
                        {row.twoFactor ? <CheckIcon/> : (!row.skipTwoFactor ? <ClearIcon/> : '')}
                        {row.skipTwoFactor ? <LockOpenIcon/> : ''}
                      </TableCell>

                      <TableCell>{row.enabled ? <CheckIcon/> : <ClearIcon/>}</TableCell>

                      <TableCell>{dateFormat(row.dateCreated, 'DD/MM/YYYY - HH:mm')}</TableCell>

                      <TableCell align="right">
                        <TableActionsWrapper>

                          {/*<Tooltip title="Modules" aria-label="module">
                            <IconButton classes={{root: classes.ActionBtn}} aria-haspopup="true"
                                        color="inherit"
                                        onClick={() => handleClickOpenModules(row)}
                            >
                              <DashboardIcon/>
                            </IconButton>
                          </Tooltip>*/}

                          <Tooltip title={!row.enabled ? 'Copy Activation Link' : 'Copy Reset Password link'} aria-label="Copy Link">
                            <IconButton classes={{root: classes.ActionBtn, disabled: classes.disabled}} aria-haspopup="true"
                                        color="inherit"
                                        disabled={row.validationID === null}
                                        onClick={() => copyLink(row)}
                            >
                              <VpnKeyIcon/>
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Edit" aria-label="edit">
                            <IconButton classes={{root: classes.ActionBtn}} aria-haspopup="true"
                                        color="inherit"
                                        // onClick={() => handleClickOpenFormEdit(row)}
                                        component={Link}
                                        to={'/user/' + row.id}
                            >
                              <EditIcon/>
                            </IconButton>
                          </Tooltip>

                          <Tooltip title={row.enabled ? 'Deactivate' : 'Reactivate'} aria-label={row.enabled ? 'Deactivate' : 'Reactivate'}>
                            <IconButton classes={{root: classes.ActionBtn}} aria-haspopup="true"
                                        color="inherit"
                                        onClick={() => handleDeleteDialog(row)}
                            >
                              <BlockIcon/>
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
              </Table>}
          </div>
        </Paper>



        <Paper className={classnames(classes.Paper, classes.logsWidget)}>
          <PaymentHistory filterValues={filter}/>
        </Paper>



        <Paper className={classnames(classes.Paper, classes.logsWidget)}>
          <ActivityLogs filterValues={filter}/>
        </Paper>

      </MainBareWrapper>

      {/*<SidebarWrapper className={classnames(classes.rightSidebar, {closed: !isFilterOpened})}>

        <Filters
          fields={filter}
          isFilteringApplied={isFilteringApplied}
          onHandleFilter={handleFilter}
          onHandleFilterReset={handleFilterReset}
        />

      </SidebarWrapper>*/}
    </div>
  )

}

export default withStyles(styles)(UserManagementList);
