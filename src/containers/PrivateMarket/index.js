import React, {useEffect, useState} from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import {format as dateFormat} from 'date-fns';
import useFetcherList from 'containers/ListHook';
import {request} from 'constants/alias';
import {API, CRUD} from 'constants/config';
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link as MLink,
  Paper,
  Typography,
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import FlexSpacer from 'components/FlexSpacer';
import HeadingsLine from 'components/HeadingSingleLine';
import ActionsWrapper from 'components/MainActionsWrapper';
import MainHeaderWrapper from 'components/MainHeaderWrapper';
import LoaderLine from 'components/LoaderLine';
import PrivateMarketTeasers from 'components/PrivateMarketTeasers';
import FormDialog from './Form';
import LoaderCircle from 'components/LoaderCircle';
import GridCenterLayoutWrapper from 'components/GridCenterLayoutWrapper';
import Pager from 'components/Pager';
import ChangeGridRows from 'components/ChangeGridRows';
import Filters from 'containers/PrivateMarket/Filters';
import PrivateMarketContactVendor from 'components/PrivateMarketContactVendor';
import SidebarWrapper from 'components/SidebarWrapper';
import MainBareWrapper from 'components/MainBareWrapper';
import {Authorized} from 'components/Auth';
import {AuthConsumer} from 'context/AuthContext';
import {useSnackbar} from 'notistack';
import {Base64} from 'js-base64';
import SidebarBackground from 'components/SidebarBackground';
import AlertDialog from 'components/AlertDialog';
import classnames from 'classnames';


const styles = () => ({

  // layout
  container: {
    display: 'flex',
  },

  actionBtn: {
    marginTop: 10,
  },

  rightSidebar: {
    zIndex: 1,
    position: 'relative',
    maxWidth: 280,
    minWidth: 280,
  },
  sidebarbg: {
    right: 0,
    maxWidth: 280,
    minWidth: 280,
  },

  emptyWrap: {
    marginTop: 50,
  },
  empty: {
    fontSize: '18px',
    padding: '60px 15px',
  },

  gridControlsWrap: {
    position: 'relative',
    marginTop: 50,
    marginBottom: 20,

    '&.last-child': {
      marginBottom: 0,
    },
  },
  // filterBtnWrap: {
  //   position: 'absolute',
  //   right: 0,
  //   top: 0,
  // },
  // filterBtn: {
  //   color: theme.palette.primary.dark,
  // }

});

function PrivateMarketList({classes, history, location}) {
  const RESOURCE = 'privatemarket';
  const initialState = {
    content: [],
    page: {
      size: 5,
      totalPages: 0,
      number: 0,
      totalElements: 0,
    },
    sort: {
      field: 'dateCreated',
      direction: 'desc',
    },
    filter: {
      module: '',
      region: '',
      sector: '',
      country: '',
      favourite: '',
    },
  };

  const {enqueueSnackbar} = useSnackbar();

  const {
    loading,
    list: {
      content,
      page,
      filter,
      isFilteringApplied
    },
    fetchList,
    handleNavigate,
    handleChangeRows,
    handleDelete,
    handleFilter,
    handleFilterReset
  } = useFetcherList(RESOURCE, initialState);

  const [lists, setLists] = useState({
    modules: [],
    countries: [],
    vendors: [],
  });
  useEffect(() => {
    fetchLists();
  }, []);

  const [form, setForm] = useState({
    loading: false,
    isOpened: false,
    fields: {},
  });
  // State for vendor contact form
  const [vendor, setVendor] = useState({
    loading: false, // loading form
    privateMarket: {}, // PrivateMarket object
    isFormOpened: false, // is modal opened
  });
  // const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  const [delItem, setDelItem] = useState({});


  useEffect(() => {
    // Check if URL is /add or /:id
    let getEntityById = (id) => {
      request
        .get(`${API}privatemarket/${id}`)
        .then(({data: {returnobject: entity}}) => {

          delete entity.favourite;
          delete entity.dateCreated;
          delete entity.lastModified;
          delete entity.status;

          //check optional fields for null values
          entity.deadline = entity.deadline ? dateFormat(new Date(entity.deadline), 'YYYY-MM-DD') : '';
          entity.minimumTicket = entity.minimumTicket ? entity.minimumTicket : '';
          entity.minimumTicketInfo = entity.minimumTicketInfo ? entity.minimumTicketInfo : '';
          entity.pmYield = entity.pmYield ? entity.pmYield : '';
          entity.price = entity.price ? entity.price : '';
          entity.priceInfo = entity.priceInfo ? entity.priceInfo : '';
          entity.region = entity.region ? entity.region : '';
          entity.round = entity.round ? entity.round : '';
          entity.sector = entity.sector ? entity.sector : '';
          entity.subType = entity.subType ? entity.subType : '';
          entity.surface = entity.surface ? entity.surface : '';
          if (!entity.country) {
            entity.country = {id: ''};
          }

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

    // if (match.params.type) {
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


  /**
   * Fetchers
   */

  function fetchLists() {

    let pRequests = [];

    pRequests.push(new Promise((resolve, reject) => {
      // Modules
      request
        .post(`${API}module/list?page=0&size=400&sort=name,asc`, {category: 'PRIVATE_MARKETS'})
        .then(({data: {returnobject: {content: modules}}}) => resolve(modules))
        .catch((error) => console.log(error));
    }));

    pRequests.push(new Promise((resolve, reject) => {
      // Countries
      request
        .post(`${API}country/list?page=0&size=400&sort=name,asc`)
        .then(({data: {returnobject: {content: countries}}}) => resolve(countries))
        .catch((error) => console.log(error));
    }));

    pRequests.push(new Promise((resolve, reject) => {
      // Vendors
      request
        .post(`${API}vendor/list?page=0&size=400&sort=companyName,asc`)
        .then(({data: {returnobject: {content: vendors}}}) => resolve(vendors))
        .catch((error) => console.log(error));
    }));


    Promise.all(pRequests)
      .then(l => {
        setLists({
          modules: l[0],
          countries: l[1],
          vendors: l[2],
        });
      })
      .catch(error => console.log(error));

  }


  /**
   * Handlers
   */


  function handleClickOpenFormEdit(entity) {
    setForm({
      ...form,
      isOpened: true,
      fields: {
        id: entity.id,
        title: entity.title || '',
        description: entity.description || '',
        module: {
          id: entity.module && entity.module.id ? entity.module.id : ''
        },
        subType: entity.subType || '',
        region: entity.region || '',
        country: {
          id: entity.country && entity.country.id ? entity.country.id : ''
        },
        sector: entity.sector || '',
        price: entity.price || '',
        priceInfo: entity.priceInfo || '',
        minimumTicket: entity.minimumTicket || '',
        minimumTicketInfo: entity.minimumTicketInfo || '',
        deadline: entity.deadline ? dateFormat(entity.deadline, 'YYYY-MM-DD') : '',
        round: entity.round || '',
        pmYield: entity.pmYield || '',
        vendor: {
          id: entity.vendor && entity.vendor.id ? entity.vendor.id : ''
        },
        endorsedBy: entity.endorsedBy || '',
        published: entity.published,
        // filename: entity.,
      }
    });

    history.push('/private-market/' + entity.id);
  }

  async function handleClickSetPublished(privateMarket) {
    try {
      await request.put(`${API}privatemarket/${privateMarket.id}/published/${!privateMarket.published}`);
      fetchList();
    } catch (e) {
      console.log(e);
      enqueueSnackbar('Something went wrong', {variant: 'error'});
    }
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

      history.push('/private-market');
    }, 400);
  }

  /*function toggleRightSidebar() {
    setIsSidebarOpened(!isSidebarOpened);
  }*/

  function handleChangeFavourite(id) {
    request
      .put(`${API}privatemarket/${id}/favourite`)
      .then(() => fetchList())
      .catch(error => console.log(error));
  }

  // VENDOR
  function toggleVendor() {
    setVendor({
      ...vendor,
      isFormOpened: !vendor.isFormOpened
    })
  }

  function handleClickContactVendor(privateMarket) {
    setVendor({
      loading: false,
      privateMarket: privateMarket,
      isFormOpened: true
    });
  }

  function handleDeleteDialog(id) {
    setDelItem({id});
  }

  function handleResetDelItem() {
    setDelItem({});
  }

  function handleSubmitContactVendor(message) {
    if (!vendor.privateMarket.id) return;

    setVendor({
      ...vendor,
      loading: true,
    });

    request
      .put(`${API}privatemarket/${vendor.privateMarket.id}/contact`, {message: message})
      .then(() => {
        fetchList(0);
        setVendor({
          loading: false,
          privateMarket: {},
          isFormOpened: false,
        })
      })
      .catch(error => {
        // todo
        console.log(error)
      });
  }

  function handleSubmit(payload, file) {

    // validation
    if (!payload.title) {
      enqueueSnackbar('Title field is required', {variant: 'error'});
      return;
    }

    if (!payload.description) {
      enqueueSnackbar('Description field is required', {variant: 'error'});
      return;
    }

    if (!payload.module || !payload.module.id) {
      enqueueSnackbar('Module field is required', {variant: 'error'});
      return;
    }

    if (!payload.vendor || !payload.vendor.id) {
      enqueueSnackbar('Vendor field is required', {variant: 'error'});
      return;
    }

    let urlPath = 'privatemarket';

    if (!payload.id) {
      delete payload.id;
    } else {
      urlPath += '/' + payload.id;
    }

    // parse nested objects
    payload.module = payload.module && payload.module.id ? payload.module.id : '';
    payload.country = payload.country && payload.country.id ? payload.country.id : '';
    payload.vendor = payload.vendor && payload.vendor.id ? payload.vendor.id : '';
    if (!payload.price) payload.price = null;
    if (!payload.minimumTicket) payload.minimumTicket = null;
    if (!payload.deadline) payload.deadline = null;

    let encodedData = Base64.encode(JSON.stringify(payload));

    let i;
    let formData = new FormData();
    formData.append('fieldsData', encodedData);
    for (i = 0; i < file.files.length; i++) {
      formData.append('files', file.files[i]);
    }

    setForm({
      ...form,
      loading: true,
    });

    request.post(`${API}${urlPath}`, formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
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

  }


  /**
   * Prepare for rendering
   */

  // reduce boilerplate code for reusing GridControls component
  const GridControls = ({lastChild = false}) => (
      <div className={classnames(classes.gridControlsWrap, {'last-child': lastChild})}>

        <Pager
          count={page.totalPages}
          rowsPerPage={page.size}
          page={page.number}
          onChangePage={handleNavigate}
        />

        <ChangeGridRows
          rowsPerPage={page.size}
          onHandleChangeRows={handleChangeRows}
        />

        {/*<div className={classes.filterBtnWrap}>
          <Tooltip title="Filter list" placement="top-start" aria-label="filter-list">
            <IconButton className={classes.filterBtn} onClick={toggleRightSidebar}>
              <FilterIcon/>
            </IconButton>
          </Tooltip>
        </div>*/}

      </div>
    );




  return (
    <AuthConsumer>
      {({user}) => {
        let EmptyMsg = () => <Paper className={classes.emptyWrap}><Typography align="center" className={classes.empty}>No available data. Create a new Private Market <MLink
          component={Link} color="secondary" to="/private-market/add">here</MLink>.</Typography></Paper>

        if (user.role !== 'SUPERADMIN') {
          EmptyMsg = () => <Paper className={classes.emptyWrap}><Typography align="center" className={classes.empty}>No available Private Markets.</Typography></Paper>
        }


        return (

          <div className={classes.container}>

            <AlertDialog
              isOpened={delItem.id ? true : false}
              onHandleClose={handleResetDelItem}
              yes={() => handleDelete(delItem.id)}
            />

            <MainBareWrapper>
              <MainHeaderWrapper>
                <HeadingsLine title="Private Markets" subtitle="Access private markets information"/>

                <FlexSpacer/>

                <ActionsWrapper>

                  <Authorized
                    resource="addMarketButton"
                    yes={() =>

                      <Button variant="contained" color="secondary" className={classes.actionBtn}
                              size="small" component={Link} to="/private-market/add"
                      >
                        Add Market
                      </Button>

                    }
                  />

                  {/*Form*/}
                  <Dialog fullWidth maxWidth="sm" open={form.isOpened} onClose={handleCloseForm}>
                    <LoaderLine start={form.loading}/>

                    <DialogTitle>{!form.fields.id
                      ? 'Create a new Private Market'
                      : 'Edit Private Market "' + form.fields.title + '"'}
                    </DialogTitle>

                    <DialogContent>
                      <DialogContentText>
                        Please fill out the form below.
                      </DialogContentText>

                      <Switch>
                        <Route path="/private-market/add" render={() => <FormDialog
                          loading={form.loading}
                          lists={lists}
                          onHandleSubmit={handleSubmit}
                        />}/>

                        <Route path="/private-market/:id" render={() => <FormDialog
                          loading={form.loading}
                          lists={lists}
                          fields={form.fields.id ? form.fields : undefined}
                          onHandleSubmit={handleSubmit}
                        />}/>
                      </Switch>

                    </DialogContent>
                  </Dialog>

                </ActionsWrapper>
              </MainHeaderWrapper>


              <PrivateMarketContactVendor
                vendor={vendor}
                onToggleVendor={toggleVendor}
                onHandleSubmitContactVendor={handleSubmitContactVendor}
              />


              <GridCenterLayoutWrapper>

                <LoaderCircle start={loading}/>

                {!loading ?
                  <>
                    <GridControls/>

                    <PrivateMarketTeasers
                      content={content}
                      onHandleChangeFavourite={handleChangeFavourite}
                      onHandleClickContactVendor={handleClickContactVendor}
                      handleClickOpenFormEdit={handleClickOpenFormEdit}
                      handleClickSetPublished={handleClickSetPublished}
                      onHandleDeleteDialog={handleDeleteDialog}
                    />
                  </>
                  : ''}

                {content.length === 0 && !loading ? <EmptyMsg/> : ''}

                {!loading && content.length > 0
                  ? <GridControls lastChild={true}/>
                  : ''}

              </GridCenterLayoutWrapper>
            </MainBareWrapper>

            <SidebarWrapper className={classes.rightSidebar}>

              {/*open={isSidebarOpened} onClose={toggleRightSidebar}*/}

              <Filters
                lists={lists}
                fields={filter}
                isFilteringApplied={isFilteringApplied}
                onHandleFilter={handleFilter}
                onHandleFilterReset={handleFilterReset}
              />

            </SidebarWrapper>

            <SidebarBackground className={classes.sidebarbg}/>


          </div>


        )
      }}
    </AuthConsumer>
  )

}

export default withStyles(styles)(PrivateMarketList);
