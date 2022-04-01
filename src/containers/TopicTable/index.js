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
import {Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, FilterList as FilterIcon, Visibility as VisibilityIcon} from '@material-ui/icons';
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
import {Base64} from 'js-base64';


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
  tLbl: {
    fontSize: 16,
    color: theme.palette.primary.main,
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

function TopicList({classes, history, location}) {

  const RESOURCE = 'topic';
  const initialState = {
    content: [],
    page: {
      size: 5,
      totalPages: 0,
      number: 0,
      totalElements: 0,
    },
    sort: {
      field: 'lastmodified',
      direction: 'desc',
    },
    // filter: {
    //   text: '',
    // },
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

  const [delItem, setDelItem] = useState({});

  const [lists, setLists] = useState({
    topicTags: {}
  });
  useEffect(() => {
    fetchLists();
  }, [])

  const [form, setForm] = useState({
    loading: false,
    isOpened: false,
    fields: {},
  });
  useEffect(() => {
    // Check if URL is /add or /:id
    let getEntityById = (id) => {
      request
        .get(`${API}topic/${id}`)
        .then(({data: {returnobject: entity}}) => {

          delete entity.dateCreated;

          setTimeout(() => {
            setForm({
              loading: false,
              isOpened: true,
              fields: {
                ...entity,
                assetClass: entity.assetClass || [],
                sector: entity.sector || [],
                thematic: entity.thematic || [],
                globalMacroAndPolitics: entity.globalMacroAndPolitics || [],
              },
            })
          }, CRUD.delay);

        })
        .catch(error => console.log(error));
    };

    if (location) {
      let temp = location.pathname.split('/'),
        pathVariable;

      if (temp.length === 3 && temp[2]) {
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
  }, [location.pathname])

  /**
   * Fetchers
   */

  function fetchLists() {

    let pRequests = [];

    // Topic Tags
    pRequests.push(new Promise((resolve, reject) => {
      request
        .get(`${API}topictag/extendedlist`, {})
        .then(({data: {returnobject: topictags}}) => {

          resolve(topictags);

        })
        .catch((error) => {
          console.log(error);
        })
    }));


    Promise.all(pRequests)
      .then(l => {
        setLists({
          topicTags: l[0],
        });
      })
      .catch(error => console.log(error));

  }


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
        title: entity.title || '',
        text: entity.text || '',
        assetClass: entity.assetClass || [],
        sector: entity.sector || [],
        thematic: entity.thematic || [],
        globalMacroAndPolitics: entity.globalMacroAndPolitics || [],
        contentURL: entity.contentURL || '',
        status: entity.status || 'ACTIVE',
      }
    });

    history.push('/topic/' + entity.id);
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

      history.push('/topic');
    }, 400);
  };

  const handleSubmit = (revision, payload, file) => {

    // if (hasExceededFileSize($file[0]) || !hasRightFileTypes($file[0])) return; //todo

    let urlPath = 'topic';

    if (!payload.id) {
      delete payload.id;
    } else {
      if (revision) {
        urlPath += '/' + payload.id + '/revision';
      } else {
        urlPath += '/' + payload.id;
      }
    }

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


    // todo - pass file to axios
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

        console.log(error);
      })

  };

  function handleDeleteDialog(id) {
    setDelItem({id});
  }

  function handleResetDelItem() {
    setDelItem({});
  }

  async function handleClickChangeStatus(id) {
    try {
      await request.put(`${API}topic/${id}/status`);
      handleCloseForm();
      fetchList(0);
    } catch (exception) {
      console.log(exception);
      handleCloseForm();
      alert('Something went wrong. Please contact the system administrator');
    }
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
        <HeadingsLine title="Topics' Management" subtitle="Manage platform Topic"/>

        <FlexSpacer/>

        <ActionsWrapper>

          <Fab component={Link} to="/topic/add" size="medium" color="secondary" arial-label="Add"
               onClick={handleClickOpenFormCreate}>
            <AddIcon/>
          </Fab>

          {/*Form*/}
          <Dialog fullWidth maxWidth="sm" open={form.isOpened} onClose={handleCloseForm}>
            <LoaderLine start={form.loading}/>

            <DialogTitle>{!form.fields.id
              ? 'Create a new Topic'
              : 'Edit Topic'}
            </DialogTitle>

            <DialogContent>
              <DialogContentText>
                Please fill out the form below.
              </DialogContentText>

              <Switch>
                <Route path="/topic/add" render={() => <FormDialog
                  loading={form.loading}
                  lists={lists}
                  onHandleSubmit={handleSubmit}
                />}/>

                <Route path="/topic/:id" render={() => <FormDialog
                  loading={form.loading}
                  lists={lists}
                  fields={form.fields.id ? form.fields : undefined}
                  onHandleSubmit={handleSubmit}
                  onHandleClickChangeStatus={handleClickChangeStatus}
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
            ? <Typography align="center" className={classes.empty}>No available data. Create a new Topic <MLink
              component={Link} color="secondary" to="/topic/add"
              onClick={handleClickOpenFormCreate}>here</MLink>.</Typography>
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
                        id="sort-text"
                        active={sort.field === 'text'}
                        direction={sort.direction}
                        className={classes.tSortLbl}
                        classes={{
                          active: classes.tSortLblActive
                        }}
                        onClick={handleSort}
                      >
                        Text
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>

                  <TableCell className={classes.tLbl}>
                    Number of Tags
                  </TableCell>

                  <TableCell className={classes.tLbl}>
                    Status
                  </TableCell>

                  <TableCell sortDirection={sort.direction}>
                    <Tooltip
                      title="Sort"
                      enterDelay={300}
                    >
                      <TableSortLabel
                        id="sort-lastmodified"
                        active={sort.field === 'lastmodified'}
                        direction={sort.direction}
                        className={classes.tSortLbl}
                        classes={{
                          active: classes.tSortLblActive
                        }}
                        onClick={handleSort}
                      >
                        Date Modified
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
                    <TableCell component="th" scope="row">{row.title}</TableCell>
                    <TableCell>{row.text.truncate(35)}</TableCell>
                    <TableCell>
                      {row.assetClassCounter ? <div><strong>Asset classes:</strong> {row.assetClassCounter}</div> : ''}
                      {row.sectorCounter ? <div><strong>Sector:</strong> {row.sectorCounter}</div> : ''}
                      {row.thematicCounter ? <div><strong>Thematic:</strong> {row.thematicCounter}</div> : ''}
                      {row.globalMacroAndPoliticsCounter ? <div><strong>Global Macro and Politics:</strong> {row.globalMacroAndPoliticsCounter}</div> : ''}
                    </TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{dateFormat(row.lastmodified, 'DD/MM/YYYY - HH:mm')}</TableCell>

                    <TableCell align="right">
                      <TableActionsWrapper>

                        <Tooltip title="Change status" aria-label="change-state">
                          <IconButton classes={{root: classes.ActionBtn}} aria-haspopup="true"
                                      color="inherit"
                                      onClick={() => handleClickChangeStatus(row.id)}
                          >
                            <VisibilityIcon/>
                          </IconButton>
                        </Tooltip>

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
                                      // onClick={() => handleDelete(row.id)}
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

export default withStyles(styles)(TopicList);
