import React, {useEffect, useReducer, useRef, useState} from 'react';
import {RootRef} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import MainBareWrapper from 'components/MainBareWrapper';
import {API, CRUD} from 'constants/config';
import {request} from 'constants/alias';
import {AuthConsumer} from 'context/AuthContext';
import html2pdf from 'html2pdf.js';
import HeadingTwoLines from '../../components/HeadingTwoLines';
import {useSnackbar} from 'notistack';
import DYTitle from './DYTitle';
import DYHeaderRight from './DYHeaderRight';
import classnames from 'classnames';
import Disclaimer from './Disclaimer';
import ContactDetails from './ContactDetails';
import {Base64} from 'js-base64';
import AssetClassOverview from './AssetClassOverview';
import DYToolbar from './DYToolbar';
import {CreateCustomTopicDialog, LoadTopicsDialog, TopicInstance, topicInstanceTO} from './TopicInstance';
import LoadDYReportDialog from './LoadDYReportDialog';
import SyncDialog from './TopicInstance/SyncDialog';
import config from './config';
import DYHeaderBannerUploader from './DYHeaderBannerUploader';
import ColorPickerDialog from './ColorPickerDialog';

const defaultBgColor = '#f1f1f1';

const styles = theme => ({
  // main (DY Stage)
  main: {
    width: 840,
    margin: '0 auto',
    padding: 0,

    // actions
    '& .action-parent': {
      position: 'relative',
    },
    '& .action-parent .action': {
      fontSize: 15,
      position: 'absolute',
      top: 4,
      // left: -5,
      left: -57,
      height: 30,

      transition: 'opacity 0.4s',
      visibility: 'hidden',
      opacity: 0,
    },
    '& .action-parent:hover .action': {
      visibility: 'visible',
      opacity: 1,
    },
    '& .action-parent .action > div': {
      cursor: 'pointer',
      height: 15,
      textAlign: 'right',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    '& .action-parent .action > div:hover': {
      transform: 'scale(1.3)',
    },

    '& .action-parent .action.one': {
      fontSize: 31,
    },
    '& .action-parent .action.one > div': {
      height: 30,
      transition: 'all 0s',
    },
    '& .action-parent .action.one > div:hover': {
      transform: 'none',
    },

    // '.active .action': {
    //   fontSize: 31,
    // },
    // // '.start-sort & .action > div:nth-child(0)': {
    // //   display: 'none',
    // // },
    // '&.active .action > div:nth-child(1)': {
    // display: 'none',
    // },
  },
  dyContainer: {
    // minHeight: 800,
    // backgroundColor: '#f1f1f1',// todo dynamic
    // paddingBottom: 1,

    '&.pdfing .action': {
      display: 'none !important',
    },
  },

  page: {
    height: '296mm', // todo
    borderBottom: '2px dotted black',
    breakAfter: 'page',

    '#dy-container.pdfing &': {
      border: 'medium none !important',
    },
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.secondary.main,
    borderBottom: '1px solid ' + theme.palette.text.primary,
    position: 'relative',
    height: 67,
    // paddingBottom: 10,

    // '&:after': { // todo maybe flex-box is not rendered properly
    //   content: '""',
    //   position: 'absolute',
    //   width: '100%',
    //   height: 2,
    //   bottom: 1,
    //   left: 0,
    //   backgroundColor: theme.palette.text.primary,
    // },
  },
  imageWrap: {
    width: '100%',
    height: '100%',

    '&.hover:hover': {
      cursor: 'pointer',
      // opacity: 0.8,
    },

    '&.hover:hover:before': {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      content: '"Click to change banner"',
      fontSize: 15,
      textAlign: 'center',
      color: '#000',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      position: 'absolute',
      top: 20,
      left: 'calc(50% - 90px)',
      padding: 5,
    },
  },
  dyHeaderLeftInner: {
    width: 'auto',
    height: 43,
    margin: '12px 0 9px 10px',

    '&.full': {
      width: '100%',
      height: '100%',
      margin: 0,
    },
  },
  dyHeaderRightWrap: {
    textAlign: 'right',
    // width: '50%',
    minWidth: 20,
    minHeight: 20,
    marginRight: 15,
    padding: '0 5px 0 7px',
    backgroundColor: theme.palette.getContrastText(theme.palette.getContrastText('#fff')), // todo - set the dynamic backgroundColor
    '&:hover': {
      opacity: 0.5
    },
  },


  // dyTitle: {
  //   fontSize: 30,
  //   margin: '40px 10px 30px 10px',
  // },

  dyPaper: {
    padding: 10,
    margin: '0 20px 15px 20px',
    border: '1px solid #ededed',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',

    '&#overview': {
      marginBottom: 25,
    },
  },

  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  titleAreaGrow: {
    flexGrow: 1,
  },

  dyInnerTitle: {
    fontSize: 18,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    marginBottom: 0,

    '#overview &': {
      marginBottom: 10,
    },
  },

  topicContainer: {
    minHeight: 305,
    maxHeight: 305,
    // overflow: 'hidden',
  },
});

// todo need immutability check
const initialDYReportState = Object.freeze({
  bgColor: defaultBgColor,
  headerBannerUrl: '',
  title: 'Title',
  customdate: 'DD/MM/YYYY',
  overviewlist: [
    {
      assetclass: 'Government Bonds',
      view: 'Neutral',
      order: 0,
    },
    {
      assetclass: 'Investment grade bonds',
      view: 'Neutral',
      order: 1,
    },
    {
      assetclass: 'High yield bonds',
      view: 'Neutral',
      order: 2,
    },
    {
      assetclass: 'Developed Market Equities',
      view: 'Neutral',
      order: 3,
    },
    {
      assetclass: 'Emerging Market Equities',
      view: 'Neutral',
      order: 4,
    },
  ],
  topicinstances: [], // List<topicInstanceTO>
});

function stateReducer(state, action) {

  function swapOverviewlistItem(from, to, updateFrom) {
    let overviewlist = state.overviewlist, tempOrder;

    tempOrder = overviewlist[to].order;
    overviewlist[to].order = overviewlist[from].order;
    overviewlist[from].order = tempOrder;

    updateFrom(to);

    return overviewlist;
  }

  function updateOverviewlistField(key, overviewField) {
    let overviewlist = state.overviewlist;

    overviewlist[key] = {
      assetclass: typeof overviewField.assetclass === 'string' ? overviewField.assetclass : state.overviewlist[key].assetclass,
      view: typeof overviewField.view === 'string' ? overviewField.view : state.overviewlist[key].view,
      order: state.overviewlist[key].order,
    };

    return overviewlist;
  }

  function updateTopicInstanceField(key, fieldId, value) {
    let topicInstances = state.topicinstances;

    topicInstances[key] = {
      ...state.topicinstances[key],
      [fieldId]: typeof value === 'string' ? value : state.topicinstances[key][fieldId],
    };

    return topicInstances;
  }

  function updateTopicInstanceTextPosition(key) {
    let topicInstances = state.topicinstances;

    topicInstances[key] = {
      ...state.topicinstances[key],
      textposition: state.topicinstances[key].textposition === 'LEFT' ? 'RIGHT' : 'LEFT',
    };

    return topicInstances;
  }

  function swapTopicInstanceItem(from, to, updateFrom) {
    let topicInstances = state.topicinstances, tempOrder;

    tempOrder = topicInstances[to].order;
    topicInstances[to].order = topicInstances[from].order;
    topicInstances[from].order = tempOrder;

    updateFrom(to);

    return topicInstances;
  }

  function updateTopicInstance(key, topicInstance) {
    let topicInstances = state.topicinstances;

    topicInstances[key] = topicInstance;

    return topicInstances;
  }


  // todo - need immutability check
  switch (action.type) {

    // GENERIC STATE UPDATE
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };

    // DYREPORT
    case 'RESET_DYREPORT':
      return action.initialState;
    case 'SET_DYREPORT':
      return {
        ...state,
        ...action.entity,
      };
    case 'UPDATE_DYREPORT_HEADERBANNER':
      return {
        ...state,
        headerBannerUrl: action.headerBannerUrl,
      };

    // OVERVIEW
    case 'OVERVIEW_SORT':
      return {
        ...state,
        overviewlist: swapOverviewlistItem(action.from, action.to, action.updateFrom),
      };
    case 'UPDATE_OVERVIEW_FIELD':
      return {
        ...state,
        overviewlist: updateOverviewlistField(action.key, action.overviewField),
      };

    // TOPIC INSTANCES
    case 'UPDATE_TOPICINSTANCE_IDS':
      return {
        ...state,
        topicinstances: action.topicInstances && action.topicInstances.map(topicInstance => (
          new topicInstanceTO(topicInstance.id, topicInstance.topic, topicInstance.topicrevision, topicInstance.title, topicInstance.text, topicInstance.textposition, topicInstance.order, topicInstance.contenturl, topicInstance.imagechanged)
        )),
      };
    case 'UPDATE_TOPICINSTANCES':
      return {
        ...state,
        topicinstances: state.topicinstances.concat(action.topicinstances),
      };
    case 'UPDATE_TOPICINSTANCE_FIELD':
      return {
        ...state,
        topicinstances: updateTopicInstanceField(action.key, action.fieldId, action.value),
      };
    case 'UPDATE_TOPICINSTANCE_TEXTPOSITION':
      return {
        ...state,
        topicinstances: updateTopicInstanceTextPosition(action.key),
      };
    case 'TOPICINSTANCE_SORT':
      return {
        ...state,
        topicinstances: swapTopicInstanceItem(action.from, action.to, action.updateFrom),
      };
    case 'DELETE_TOPICINSTANCE':
      return {
        ...state,
        topicinstances: state.topicinstances.filter((topicinstance, key) => key !== action.key),
      };
    case 'CREATE_CUSTOM_TOPICINSTANCE':
      return {
        ...state,
        topicinstances: [
          ...state.topicinstances,
          action.topicInstance
        ]
      };
    case 'TOPICINSTANCE_SYNC':
      return {
        ...state,
        topicinstances: updateTopicInstance(action.key, action.topicInstance),
      };
    default:
      throw new Error('Unexpected action');

  }
}

let topicInstancesOrderCounter = 0;
let readyToAutoSave = false;

function DYReport({classes, history, match}) {

  const latestDYReportId = useRef(match.params.id);
  const dyContainer = useRef(null);

  const {enqueueSnackbar} = useSnackbar();
  // loader for fetcher
  const [dyLoading, setDyLoading] = useState(false);
  // loader for auto save
  const [autoSaveLoading, setAutoSaveLoading] = useState(false);

  const [pdfInProgress, setPdfInProgress] = useState(false);

  const [isHeaderUploaderShown, setIsHeaderUploaderShown] = useState(false);

  const [dyReportDialogOpened, setDyReportDialogOpened] = useState(false);
  const [topicDialogOpened, setTopicDialogOpened] = useState(false);
  const [customTopicInstanceDialogOpened, setCustomTopicInstanceDialogOpened] = useState(false);
  const [dyReportBgColorOpened, setDyReportBgColorOpened] = useState(false);
  // const [syncTopicOpened, setSyncTopicOpened] = useState(false); // todo enable this to cache already fetched syncTopicInstance

  const [moveTopicInstanceFrom, setMoveTopicInstanceFrom] = useState(-1); // -1 means no item has been selected

  const [syncTopicInstance, setSyncTopicInstance] = useState({});

  const [state, dispatch] = useReducer(stateReducer, initialDYReportState);

  const bgColorSaved = useRef(defaultBgColor);

  useEffect(() => {
    topicInstancesOrderCounter = 0;
    readyToAutoSave = false;
  }, []);

  // specific callback for topic instances autoSave
  useEffect(handleSaveTopicInstances, [state.topicinstances.length]);

  useEffect(() => {
    if (match.params.id) {
      fetchDYReport();
    } else {
      topicInstancesOrderCounter = 0;
      readyToAutoSave = true;
    }

    latestDYReportId.current = match.params.id;
  }, [match.params.id]);

  async function fetchDYReport() {
    readyToAutoSave = false;
    setDyLoading(true);

    try {

      const {data: {returnobject:dyReport}} = await request.get(`${API}dyreport/${match.params.id}`);
      setDYReport(dyReport);

      setTimeout(() => {
        readyToAutoSave = true;
        setDyLoading(false);
      }, CRUD.delay*6);

    } catch (e) {
      console.log(e);
      enqueueSnackbar('Something went wrong', {variant: 'error'});

      readyToAutoSave = true;
      setDyLoading(false);

      history.push('/dyreport');
    }

  }

  function handleChange(event) {
    const target = event.target,
      {id, type, value, checked} = target;

    let fieldValue = type === 'checkbox' ? checked : value;

    dispatch({
      type: 'UPDATE_FIELD',
      field: id,
      value: fieldValue,
    })
  }

  //DYREPORT
  function toggleDYReportDialog() {
    setDyReportDialogOpened(!dyReportDialogOpened);
  }

  function setDYReport(dyReport) {
    let topicInstances = [];
    if (dyReport.topicinstances && window.Array.isArray(dyReport.topicinstances)) {
      topicInstances = dyReport.topicinstances.map(topicinstance => (
        new topicInstanceTO(topicinstance.id, topicinstance.topic, topicinstance.topicrevision, topicinstance.title, topicinstance.text, topicinstance.textposition, topicinstance.order, topicinstance.contenturl, false)
      ));
    }

    if (topicInstances.length > 0) {
      topicInstancesOrderCounter = topicInstances[topicInstances.length-1].order;
    }

    dispatch({
      type: 'SET_DYREPORT',
      entity: {
        bgColor: dyReport.bgColor || initialDYReportState.bgColor,
        headerBannerUrl: dyReport.headerBannerUrl || initialDYReportState.headerBannerUrl,
        title: dyReport.title || initialDYReportState.title,
        customdate: dyReport.customdate !== null && dyReport.customdate !== undefined ? dyReport.customdate : initialDYReportState.customdate,
        overviewlist: dyReport.overviewlist || initialDYReportState.overviewlist,
        topicinstances: topicInstances,
      },
    });

    bgColorSaved.current = dyReport.bgColor || initialDYReportState.bgColor;
  }

  function handleCreateNewDYReport() {
    if (!match.params.id) return;

    readyToAutoSave = false;
    // todo - need research immutability problems
    dispatch({
      type: 'RESET_DYREPORT',
      initialState: {
        bgColor: defaultBgColor,
        headerBannerUrl: '',
        title: 'Title',
        customdate: 'DD/MM/YYYY',
        overviewlist: [
          {
            assetclass: 'Government Bonds',
            view: 'Neutral',
            order: 0,
          },
          {
            assetclass: 'Investment grade bonds',
            view: 'Neutral',
            order: 1,
          },
          {
            assetclass: 'High yield bonds',
            view: 'Neutral',
            order: 2,
          },
          {
            assetclass: 'Developed Market Equities',
            view: 'Neutral',
            order: 3,
          },
          {
            assetclass: 'Emerging Market Equities',
            view: 'Neutral',
            order: 4,
          },
        ],
        topicinstances: [], // List<topicInstanceTO>
      },
    });

    handleToggleHeaderBannerUpload(false);

    history.push('/dyreport');
  }

  function handleClickUseDYReport(dyReport) {
    if (!dyReport) return;

    if (dyReport.id !== match.params.id) {
      readyToAutoSave = false;
      setDYReport(dyReport);
      history.push('/dyreport/' + dyReport.id);
    } else {
      enqueueSnackbar('The "' + dyReport.title + '" report is already selected', {variant: 'warning'});
    }
  }

  function handleCloneDYReport(dyReport) {
    if (dyReport) {
      readyToAutoSave = false;
      history.push('/dyreport/' + dyReport.id);
    }
  }

  function handleToggleHeaderBannerUpload(state) {
    setIsHeaderUploaderShown(state);
  }

  function handleSaveHeaderBannerDYReport(file) {
    if (file.files.length === 0) {
      enqueueSnackbar('You have to choose a file before save', {variant: 'error'});
      return;
    }

    DYReport.headerBannerImage = file;

    handleAutoSave()
      .then(dyreport => {
        dispatch({type: 'UPDATE_DYREPORT_HEADERBANNER', headerBannerUrl: dyreport.headerBannerUrl});
        handleToggleHeaderBannerUpload(false);
      })
      .catch(e => console.log(e));
  }

  async function handleRemoveHeaderBannerDYReport() {

    try {

      await request.put(`${API}dyreport/${match.params.id}/rmheaderbanner`);

      dispatch({
        type: 'UPDATE_DYREPORT_HEADERBANNER',
        headerBannerUrl: '',
      });

      handleToggleHeaderBannerUpload(false);

    } catch (ex) {
      console.log(ex);
      enqueueSnackbar('Something went wrong when trying to remove the DYReport header banner', {variant: 'error'});
    }

  }

  function toggleColorPickerDialog() {
    setDyReportBgColorOpened(!dyReportBgColorOpened);
  }

  function handleChangeBgColor(bgColor = state.bgColor) {
    dispatch({
      type: 'SET_DYREPORT',
      entity: {
        bgColor: bgColor,
      },
    });
  }

  function handleSaveBgColor() {
    handleAutoSave()
      .then(() => {
        bgColorSaved.current = state.bgColor;
        toggleColorPickerDialog();
      })
      .catch(e => console.log(e));
  }
  //EoDYREPORT

  //OVERVIEW
  function handleRearrangeOverview(from, to, updateFrom) {
    dispatch({type: 'OVERVIEW_SORT', from, to, updateFrom});
  }

  function handleChangeOverviewField(key, id) {
    return function (event) {
      dispatch({
        type: 'UPDATE_OVERVIEW_FIELD',
        key: key,
        overviewField: {
          [id]: event.target.value
        }
      });
    }
  }

  function handleDeleteOverviewField(key) {
    dispatch({
      type: 'UPDATE_OVERVIEW_FIELD',
      key: key,
      overviewField: {
        assetclass: '',
        view: '',
      }
    });
  }
  //EoOVERVIEW


  //TOPICS
  function toggleTopicDialog() {
    if (state.topicinstances && state.topicinstances.length >= config.topics.limit) {
      enqueueSnackbar('You reached the max number of topics.', {variant: 'warning'});
      return;
    }
    setTopicDialogOpened(!topicDialogOpened);
  }

  function toggleCustomTopicInstanceDialog() {
    if (state.topicinstances && state.topicinstances.length >= config.topics.limit) {
      enqueueSnackbar('You reached the max number of topics.', {variant: 'warning'});
      return;
    }
    setCustomTopicInstanceDialogOpened(!customTopicInstanceDialogOpened);
  }

  function toggleSyncTopicDialog(key, topicInstance) {
    // setSyncTopicOpened(!syncTopicOpened);

    // no need of isOpened variable. If topicInstance is selected then show dialog
    setSyncTopicInstance({
      key: key,
      object: topicInstance,
    });
  }

  // wrapper for autoSave topic instances. It's called only if the length of topic instances array have been changed.
  // check useEffect
  // Usages: handleDeleteTopicInstance, handleCreateCustomTopicInstance, handleClickImportTopicInstances,
  // handleClickUseDYReportwhen when dy.topicinstances.length != newdy.topicinstances.length
  function handleSaveTopicInstances() {
    if (latestDYReportId.current !== match.params.id || !readyToAutoSave) return;

    handleAutoSave()
      .then(dyreport => {
        dispatch({type: 'UPDATE_TOPICINSTANCE_IDS', topicInstances: dyreport.topicinstances});
      })
      .catch(e => console.log(e));
  }

  /**
   * Used only for new topics
   *
   * @param topics
   * @returns {boolean}
   */
  function handleClickImportTopicInstances(topics) {
    if (state.topicinstances.length + topics.length > config.topics.limit) {
      enqueueSnackbar('You reached the max number of topics.', {variant: 'warning'});
      return false;
    }
    // create topic instances from topics
    let topicinstances = topics.map(topic => {
      topicInstancesOrderCounter++;
      return new topicInstanceTO('null', topic.id, null, topic.title, topic.text, 'LEFT', topicInstancesOrderCounter, topic.image, false);
    });

    dispatch({type: 'UPDATE_TOPICINSTANCES', topicinstances: topicinstances});

    return true;
  }

  function handleChangeTopicFields(key, id) {
    return function (event) {
      dispatch({
        type: 'UPDATE_TOPICINSTANCE_FIELD',
        key: key,
        fieldId: id,
        value: event.target.value,
      });
    }
  }

  function handleChangeTextPosition(key) {
    dispatch({type: 'UPDATE_TOPICINSTANCE_TEXTPOSITION', key: key});
    // todo
    setTimeout(() => {
      handleAutoSave();
    }, 500);
  }

  function handleRearrangeTopicInstance(from, to, updateFrom) {
    dispatch({type: 'TOPICINSTANCE_SORT', from, to, updateFrom});
  }

  function handleDeleteTopicInstance(key) {
    dispatch({
      type: 'DELETE_TOPICINSTANCE',
      key: key,
    })
  }

  function handleCreateCustomTopicInstance({id, title, text}, topicImage) {
    DYReport.topicImage = topicImage;

    const newTopicInstance = new topicInstanceTO(id, null, null, title, text, 'LEFT', ++topicInstancesOrderCounter, null, true);

    dispatch({
      type: 'CREATE_CUSTOM_TOPICINSTANCE',
      topicInstance: newTopicInstance,
    });
  }

  // use this function for editing custom topic instance image.
  // But it can be also used for saving the whole topicinstance object - for this need extra code on the backend side
  function handleEditTopicInstance(topicInstance) {

    return async function (image) {

      let formData = new FormData();

      let topicInstanceTransfer = new topicInstanceTO(topicInstance.id, topicInstance.topic, topicInstance.topicrevision, topicInstance.title, topicInstance.text, topicInstance.textposition, topicInstance.order, topicInstance.contenturl, true);

      let fieldsData = Base64.encode(JSON.stringify(topicInstanceTransfer));

      formData.append('fieldsData', fieldsData);
      if (image && image.files && image.files.length > 0) {
        formData.append('image', image.files[0]);
      }

      setAutoSaveLoading(true);

      try {
        const {data: {returnobject:dyreportTO}} = await request.post(`${API}dyreport/${match.params.id}/topicinstance/${topicInstance.id}`, formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

        setDYReport(dyreportTO);

      } catch (e) {
        console.log(e);
        enqueueSnackbar('Something went wrong', {variant: 'error'});
      }

      setTimeout(() => setAutoSaveLoading(false), CRUD.delay);

    }

  }

  async function handleSyncTopicInstance(key, topicInstanceId) {
    if (!state.topicinstances[key].id) {
      console.log('Topic instance need to have an id in order to continue syncing with the latest topic');
      enqueueSnackbar('Something went wrong. Please contact your system administrator');
      return;
    }

    try {
      const {data: {returnobject:topicInstance}} = await request.put(`${API}dyreport/${match.params.id}/topicinstance/${topicInstanceId}/sync`);
      const parsedTopicInstance = new topicInstanceTO(topicInstance.id, topicInstance.topic, topicInstance.topicrevision, topicInstance.title, topicInstance.text, topicInstance.textposition, topicInstance.order, topicInstance.contenturl, false);
      dispatch({type: 'TOPICINSTANCE_SYNC', key: key, topicInstance: parsedTopicInstance});
      setSyncTopicInstance({});
    } catch (e) {
      console.log(e);
      enqueueSnackbar(e, {variant: 'error'});
    }
  }
  //EoTOPICS

  function handleAutoSave() {
    let formData = new FormData();

    let fieldsData = Base64.encode(JSON.stringify({
      bgColor: state.bgColor,
      headerBannerImage: DYReport.headerBannerImage && DYReport.headerBannerImage.files && DYReport.headerBannerImage.files.length > 0,
      title: state.title,
      customdate: state.customdate,
      overviewlist: state.overviewlist,
      topicinstances: state.topicinstances,
    }));

    formData.append('fieldsData', fieldsData);
    if (DYReport.topicImage && DYReport.topicImage.files && DYReport.topicImage.files.length > 0) {
      formData.append('file', DYReport.topicImage.files[0]);
    }

    if (DYReport.headerBannerImage && DYReport.headerBannerImage.files && DYReport.headerBannerImage.files.length > 0) {
      formData.append('file', DYReport.headerBannerImage.files[0]);
    }

    setAutoSaveLoading(true);

    return new Promise(async (resolve, reject) => {

      try {
        const {data: {returnobject:dyreportTO}} = await request.post(`${API}dyreport/${match.params.id || null}`, formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

        // this used only for newly created reports
        if (!match.params.id && dyreportTO.id) {
          history.push('/dyreport/' + dyreportTO.id);
        }

        resolve(dyreportTO);

        DYReport.topicImage = null;
        DYReport.headerBannerImage = null;

      } catch (e) {
        enqueueSnackbar('Something went wrong', {variant: 'error'});
        // history.push('/dyreport');
        console.log(e);
        reject(e);
      }

      setTimeout(() => setAutoSaveLoading(false), CRUD.delay);

    });
  }

  /**
   * Old pdf exporter version
   */
  function convertHTML2PDFV1() {
    setPdfInProgress(true);

    setTimeout(() => {

      let pdfEl = dyContainer.current;
      // html2pdf(pdfEl);

      const options = {
        // pagebreak: { mode: ['css'] },
        // margin:       1,
        filename:     state.title.toLowerCase().replace(/ /g, '-').trim() + '.pdf',
        image:        { type: 'jpeg', quality: 0.99 },
        html2canvas:  { scale: 3, backgroundColor: '#f1f1f1' },
        // jsPDF:        { unit: 'in', /*format: 'letter',*/ orientation: 'portrait' },
      };

      let worker = html2pdf();
      worker.from(pdfEl).set(options).save();

      setTimeout(() => setPdfInProgress(false), 1500);

    }, 500);
  }

  function convertHTML2PDF() {
    return '/api-pdf/v1/pdf/' + match.params.id + '/' + window.btoa(state.title);
  }

  // RENDER
  let stepPage = 2; // count from 0 (0, 1, 2). We set 2 because we want 3 topics per page.
  let stepPageCounter = 0; // starts from zer0

  const topicInstancesSorted = state.topicinstances.sort((a, b) => {
    return a.order - b.order;
  });

  return (
    <div className={classes.container}>

      <DYToolbar
        dyLoading={dyLoading}
        saved={match.params.id ? true : false}
        autoSaveLoading={autoSaveLoading}
        dyTitle={state.title}
        onHandleCreateNewDYReport={handleCreateNewDYReport}
        onToggleDYReportDialog={toggleDYReportDialog}
        onToggleTopicDialog={toggleTopicDialog}
        onToggleCustomTopicInstanceDialog={toggleCustomTopicInstanceDialog}
        onToggleColorPickerDialog={toggleColorPickerDialog}
        convertHTML2PDF={convertHTML2PDF}
      />

      {dyReportDialogOpened ? <LoadDYReportDialog
        dyReportId={match.params.id}
        isOpened={true}
        onToggleDYReportDialog={toggleDYReportDialog}
        onHandleClickUseDYReport={handleClickUseDYReport}
        onHandleCloneDYReport={handleCloneDYReport}
      /> : ''}

      <LoadTopicsDialog
        isOpened={topicDialogOpened}
        onToggleTopicDialog={toggleTopicDialog}
        onHandleClickImportTopicInstances={handleClickImportTopicInstances}
      />

      <CreateCustomTopicDialog
        isOpened={customTopicInstanceDialogOpened}
        onToggleCustomTopicInstanceDialog={toggleCustomTopicInstanceDialog}
        onHandleCreateCustomTopicInstance={handleCreateCustomTopicInstance}
      />

      <SyncDialog
        // isOpened={syncTopicOpened}
        onToggleSyncTopicDialog={toggleSyncTopicDialog}
        syncTopicInstance={syncTopicInstance}
        onHandleSyncTopicInstance={handleSyncTopicInstance}
        // onHandleClickImportTopicInstances={handleClickImportTopicInstances}
      />

      <ColorPickerDialog
        isOpened={dyReportBgColorOpened}
        bgColorState={state.bgColor}
        bgColorSaved={bgColorSaved.current}
        onToggleColorPickerDialog={toggleColorPickerDialog}
        onHandleChangeBgColor={handleChangeBgColor}
        onHandleSaveBgColor={handleSaveBgColor}
      />


      <MainBareWrapper className={classes.main}>

        <AuthConsumer>
          {({user}) => (
            <RootRef rootRef={dyContainer}>
              <div id="dy-container" style={{backgroundColor: state.bgColor}} className={classnames(classes.dyContainer, {'pdfing': pdfInProgress})}>

                <div className={classes.page}>

                  <header className={classnames(classes.header, {'progress': dyLoading})}>
                    {!isHeaderUploaderShown ?
                      <div className={classnames(classes.imageWrap, {'hover': !isHeaderUploaderShown})} onClick={() => handleToggleHeaderBannerUpload(true)}>
                        <img
                          src={state.headerBannerUrl === '' ? user.organization.logoUrl : state.headerBannerUrl}
                          className={classnames(classes.dyHeaderLeftInner, {'full': state.headerBannerUrl !== ''})}
                        />
                      </div>
                      :
                      <DYHeaderBannerUploader
                        canRemoveBanner={state.headerBannerUrl !== ''}
                        onHandleCloseUploader={() => handleToggleHeaderBannerUpload(false)}
                        onHandleRemoveBanner={handleRemoveHeaderBannerDYReport}
                        onSave={handleSaveHeaderBannerDYReport}
                      />
                    }
                  </header>

                  <div className={classes.titleContainer}>
                    <DYTitle
                      id="title"
                      fieldValue={state.title}
                      defaultValue="Report"
                      className={classnames({'progress': dyLoading})}
                      disabled={dyLoading}
                      onChange={handleChange}
                      onBlur={handleAutoSave}
                    />

                    <div className={classes.titleAreaGrow}></div>

                    <div className={classnames(classes.dyHeaderRightWrap, {'progress': dyLoading})}>
                      <DYHeaderRight
                        id="customdate"
                        fieldValue={state.customdate}
                        // defaultValue="DD/MM/YYYY"
                        disabled={dyLoading}
                        onChange={handleChange}
                        onBlur={handleAutoSave}
                      />
                    </div>
                  </div>

                  <div id="overview" className={classes.dyPaper}>
                    <HeadingTwoLines variant="h4" className={classes.dyInnerTitle}>Asset Class Overview</HeadingTwoLines>
                    <AssetClassOverview
                      dyLoading={dyLoading}
                      overviewlist={state.overviewlist}
                      onHandleRearrangeOverview={handleRearrangeOverview}
                      onHandleChangeOverviewField={handleChangeOverviewField}
                      onHandleDeleteOverviewField={handleDeleteOverviewField}
                      onHandleAutoSave={handleAutoSave}
                    />
                  </div>

                  {/*Show the first topic of topicInstancesSorted array*/}
                  {topicInstancesSorted.length > 0 ?
                    <div className={classnames(classes.dyPaper, classes.topicContainer)}>
                      <TopicInstance
                        dyLoading={dyLoading}
                        topicInstanceKey={0}
                        topicinstance={topicInstancesSorted[0]}
                        onHandleChangeTopicFields={handleChangeTopicFields}
                        onHandleRearrangeTopicInstance={handleRearrangeTopicInstance}
                        move={{
                          moveFrom: moveTopicInstanceFrom,
                          setMoveFrom: setMoveTopicInstanceFrom,
                        }}
                        onHandleChangeTextPosition={handleChangeTextPosition}
                        onHandleDeleteTopicInstance={handleDeleteTopicInstance}
                        onHandleEditTopicInstance={handleEditTopicInstance}
                        onToggleSyncTopicDialog={toggleSyncTopicDialog}
                        onHandleAutoSave={handleAutoSave}
                      />
                    </div>
                    : ''}

                  {/*Show the second topic of topicInstancesSorted array*/}
                  {topicInstancesSorted.length > 1 ?
                    <div className={classnames(classes.dyPaper, classes.topicContainer)}>
                      <TopicInstance
                        dyLoading={dyLoading}
                        topicInstanceKey={1}
                        topicinstance={topicInstancesSorted[1]}
                        onHandleChangeTopicFields={handleChangeTopicFields}
                        onHandleRearrangeTopicInstance={handleRearrangeTopicInstance}
                        move={{
                          moveFrom: moveTopicInstanceFrom,
                          setMoveFrom: setMoveTopicInstanceFrom,
                        }}
                        onHandleChangeTextPosition={handleChangeTextPosition}
                        onHandleDeleteTopicInstance={handleDeleteTopicInstance}
                        onHandleEditTopicInstance={handleEditTopicInstance}
                        onToggleSyncTopicDialog={toggleSyncTopicDialog}
                        onHandleAutoSave={handleAutoSave}
                      />
                    </div>
                    : ''}

                </div>


                {/*Create pages depending on the number of topics. Create an Array on the fly depending on how many topicinstances
                   we have to show. */}
                {new Array(Math.floor((topicInstancesSorted.length-2-1)/3)+1).fill(0).map((NOP, numPage) => {
                  stepPageCounter += stepPage;
                  return (
                    <div key={'page' + numPage} className={classes.page} style={{paddingTop: 85}}>

                      {/*Inner loop for appending topics by skipping index 0 & 1, because we have attached the first two topics on the first page*/}
                      {topicInstancesSorted.slice(2, topicInstancesSorted.length).slice(numPage*3, 3*(numPage+1)).map((topicinstance, key) =>
                        <div key={'t' + key} className={classnames(classes.dyPaper, classes.topicContainer)}>
                          <TopicInstance
                            dyLoading={dyLoading}
                            topicInstanceKey={numPage + key + stepPageCounter}
                            topicinstance={topicinstance}
                            onHandleChangeTopicFields={handleChangeTopicFields}
                            onHandleRearrangeTopicInstance={handleRearrangeTopicInstance}
                            move={{
                              moveFrom: moveTopicInstanceFrom,
                              setMoveFrom: setMoveTopicInstanceFrom,
                            }}
                            onHandleChangeTextPosition={handleChangeTextPosition}
                            onHandleDeleteTopicInstance={handleDeleteTopicInstance}
                            onHandleEditTopicInstance={handleEditTopicInstance}
                            onToggleSyncTopicDialog={toggleSyncTopicDialog}
                            onHandleAutoSave={handleAutoSave}
                          />
                        </div>
                      )}

                    </div>
                  )
                })}


                {user.organization.contactUrl ?
                  <div style={{paddingTop: 25}} className={classes.page}>
                    <ContactDetails image={user.organization.contactUrl}/>
                  </div>
                  : ''}

                {user.organization.disclaimer ?
                  <div style={{paddingTop: 25}} className={classes.page}>
                    {/*Maximum chars: 5100*/}
                    <Disclaimer text={user.organization.disclaimer}/>
                  </div>
                  : ''}

              </div>
            </RootRef>
          )}
        </AuthConsumer>

      </MainBareWrapper>

    </div>
  )
}

export default withStyles(styles)(DYReport);