import React, {useEffect, useReducer, useRef} from 'react';
import {RootRef} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import MainBareWrapper from 'components/MainBareWrapper';
import {API} from 'constants/config';
import {request} from 'constants/alias';
import HeadingTwoLines from '../../components/HeadingTwoLines';
import {useSnackbar} from 'notistack';
import DYTitle from './DYTitle';
import DYHeaderRight from './DYHeaderRight';
import classnames from 'classnames';
import Disclaimer from './Disclaimer';
import ContactDetails from './ContactDetails';
import AssetClassOverview from './AssetClassOverview';
import {TopicInstance, topicInstanceTO} from './TopicInstance';
import DYHeaderBannerUploader from '../DYReport/DYHeaderBannerUploader';

const defaultBgColor = '#f1f1f1';

const styles = theme => ({
  // main (DY Stage)
  main: {
    width: 840,
    margin: 0,
    padding: 0,
  },
  dyContainer: {
    backgroundColor: '#f1f1f1',//'#fff',
  },

  page: {
    // height: '314mm', // todo
    height: '1188px',
    breakAfter: 'page',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.secondary.main,
    borderBottom: '1px solid ' + theme.palette.text.primary,
    position: 'relative',
    height: 67,
  },
  imageWrap: {
    width: '100%',
    height: '100%',
  },
  dyHeaderLeftWrap: {
    width: '50%',
    padding: '13px 0 9px 10px',
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
    minWidth: 20,
    minHeight: 20,
    marginRight: 15,
    padding: '0 5px 0 7px',
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

  dyInnerTitle: {
    fontSize: 18,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    marginBottom: 0,

    '#overview &': {
      marginBottom: 10,
    },
  },

  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  titleAreaGrow: {
    flexGrow: 1,
  },

  topicContainer: {
    minHeight: 325,
    maxHeight: 325,
    // overflow: 'hidden',
  },
});

// todo need immutability check
const initialDYReportState = Object.freeze({
  bgColor: defaultBgColor,
  headerBannerUrl: '',
  logoUrl: '',
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
  contactUrl: '',
  disclaimer: '',
});

function stateReducer(state, action) {
  switch (action.type) {

    case 'SET_DYREPORT':
      return {
        ...state,
        ...action.entity,
      };
    default:
      throw new Error('Unexpected action');

  }
}

let topicInstancesOrderCounter = 0;

function DYReportPublic({classes, match, handleChangeThemeColor}) {

  const dyContainer = useRef(null);

  const {enqueueSnackbar} = useSnackbar();

  const [state, dispatch] = useReducer(stateReducer, initialDYReportState);

  useEffect(() => {
    async function fetchDYReport() {

      try {

        const {data: {returnobject:dyReport}} = await request.get(`${API}dyreport/public-only/${match.params.id}`);
        setDYReport(dyReport);

      } catch (e) {
        console.log(e);
        enqueueSnackbar('Something went wrong', {variant: 'error'});
      }

    }

    fetchDYReport();

    window.document.body.classList.add('report');

    return () => {
      window.document.body.classList.remove('report');
    }
  }, []);


  //DYREPORT
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

    let logoUrl, contactUrl, disclaimer;

    if (dyReport.user && dyReport.user.organization) {
      logoUrl = dyReport.user.organization.logoUrl;
      contactUrl = dyReport.user.organization.contactUrl;
      disclaimer = dyReport.user.organization.disclaimer;

      handleChangeThemeColor(dyReport.user.organization.themeColor);
    }

    dispatch({
      type: 'SET_DYREPORT',
      entity: {
        bgColor: dyReport.bgColor || initialDYReportState.bgColor,
        headerBannerUrl: dyReport.headerBannerUrl || initialDYReportState.headerBannerUrl,
        logoUrl: logoUrl,
        title: dyReport.title || initialDYReportState.title,
        customdate: dyReport.customdate !== null && dyReport.customdate !== undefined ? dyReport.customdate : initialDYReportState.customdate,
        overviewlist: dyReport.overviewlist || initialDYReportState.overviewlist,
        topicinstances: topicInstances,
        contactUrl: contactUrl,
        disclaimer: disclaimer,
      },
    });
  }
  //EoDYREPORT

  // RENDER
  let stepPage = 2; // count from 0 (0, 1, 2). We set 2 because we want 3 topics per page.
  let stepPageCounter = 0; // starts from zer0

  const topicInstancesSorted = state.topicinstances.sort((a, b) => {
    return a.order - b.order;
  });

  return (
    <div className={classes.container}>

      <MainBareWrapper className={classes.main}>

        <RootRef rootRef={dyContainer}>
          <div id="dy-container" style={{backgroundColor: state.bgColor}} className={classes.dyContainer}>

            <div className={classes.page}>

              {/*Logo and Title*/}
              <header className={classes.header}>
                <div className={classnames(classes.imageWrap, 'hover')}>
                  {/*<img src={state.logoUrl} className={classes.dyHeaderLeftInner}/>*/}
                  <img
                    src={state.headerBannerUrl === '' ? state.logoUrl : state.headerBannerUrl}
                    className={classnames(classes.dyHeaderLeftInner, {'full': state.headerBannerUrl !== ''})}
                  />
                </div>
              </header>

              <div className={classes.titleContainer}>
                <DYTitle id="title" fieldValue={state.title}/>

                <div className={classes.titleAreaGrow}></div>

                <div className={classes.dyHeaderRightWrap}>
                  <DYHeaderRight id="customdate" fieldValue={state.customdate}/>
                </div>
              </div>

              <div id="overview" className={classes.dyPaper}>
                <HeadingTwoLines variant="h4" className={classes.dyInnerTitle}>Asset Class Overview</HeadingTwoLines>
                <AssetClassOverview overviewlist={state.overviewlist}/>
              </div>

              {/*Show the first topic of topicInstancesSorted array*/}
              {topicInstancesSorted.length > 0 ?
                <div className={classnames(classes.dyPaper, classes.topicContainer)}>
                  <TopicInstance topicinstance={topicInstancesSorted[0]}/>
                </div>
                : ''}

              {/*Show the second topic of topicInstancesSorted array*/}
              {topicInstancesSorted.length > 1 ?
                <div className={classnames(classes.dyPaper, classes.topicContainer)}>
                  <TopicInstance topicinstance={topicInstancesSorted[1]}/>
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
                      <TopicInstance topicinstance={topicinstance}/>
                    </div>
                  )}

                </div>
              )
            })}



            {state.contactUrl ?
              <div style={{paddingTop: 25}} className={classes.page}>
                <ContactDetails image={state.contactUrl}/>
              </div>
              : ''}

            {state.disclaimer ?
              <div style={{paddingTop: 25}} className={classes.page}>
                <Disclaimer text={state.disclaimer}/>
              </div>
              : ''}


          </div>
        </RootRef>

      </MainBareWrapper>

    </div>
  )
}

export default withStyles(styles)(DYReportPublic);