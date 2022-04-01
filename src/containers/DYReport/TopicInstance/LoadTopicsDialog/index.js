import React, {useState, useEffect} from 'react';
import {Dialog, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import {useSnackbar} from 'notistack';
import {withStyles} from '@material-ui/core/styles/index';
import {request} from 'constants/alias';
import {API} from 'constants/config';
import FilterForm from './FilterForm';
import TopicResultTable from './TopicResultTable';


const styles = () => ({
  paperScrollPaper: {
    height: 'calc(100% - ' + 96 + 'px)', // todo make 96 dynamic
  }
});

function LoadTopicsDialog({classes, isOpened, onToggleTopicDialog, onHandleClickImportTopicInstances}) {
  const {enqueueSnackbar} = useSnackbar();
  const [searchLoading, setSearchLoading] = useState(false);
  const [list, setList] = useState({
    topicTags: {}
  });
  const [filters, setFilters] = useState({
    ASSET_CLASS: [],
    SECTOR: [],
    THEMATIC: [],
    GLOBAL_MACRO_AND_POLITICS: [],
  });
  const [searchResult, setSearchResult] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);

  useEffect(() => {
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
        const topicTags = l[0];
        setList({
          topicTags: topicTags,
        });

        // Create enumerator object
        const findIdByCategoryAndTag = {};

        for (let cat in topicTags) {
          findIdByCategoryAndTag[cat] = {};
          topicTags[cat].forEach(tag => {
            findIdByCategoryAndTag[cat][tag.tag] = tag.id;
          });
        }

        LoadTopicsDialog.findIdByCategoryAndTag = findIdByCategoryAndTag;
      })
      .catch(error => console.log(error));

  }, []);


  function handleClose() {
    onToggleTopicDialog();
  }

  const handleChangeMultiSelect = ({target: {value}}, key) => setFilters({
    ...filters,
    [key]: value
  });

  function handleResetFilters() {
    setFilters({
      ASSET_CLASS: [],
      SECTOR: [],
      THEMATIC: [],
      GLOBAL_MACRO_AND_POLITICS: [],
    });
  }

  function handleReset() {
    setSearchResult([]);
    setSelectedTopics([]);
    handleResetFilters();
  }

  async function handleSearch() {
    // define request body vars
    const tags = [];

    for (let cat in filters) {
      filters[cat].forEach(tag => {
        tags.push(LoadTopicsDialog.findIdByCategoryAndTag[cat][tag]);
      })
    }

    if (tags.length === 0) {
      setSearchResult([]);
      LoadTopicsDialog.findTopicById = {};
      return;
    }

    setSearchLoading(true);

    try {
      const {data: {returnobject: {content:tps}}} = await request.post(`${API}topic/limitedlist?page=0&size=200&sort=lastmodified,DESC`, {tags: tags});

      setSearchResult(tps.map(topic => ({
        id: topic.id,
        title: topic.title,
        text: topic.text,
        image: topic.contentURL,
        lastmodified: topic.lastmodified
      })));

      const findTopicById = {};
      tps.forEach(topic => {
        findTopicById[topic.id] = {
          title: topic.title,
          text: topic.text,
          image: topic.contentURL,
          lastmodified: topic.lastmodified
        };
      });

      LoadTopicsDialog.findTopicById = findTopicById;
    } catch (e) {
      enqueueSnackbar('Something went wrong.', {variant: 'error'});
      console.log(e);
    }

    setSearchLoading(false);
  }

  function handleClickSelectTopic(topics) {
    setSelectedTopics(topics);
  }

  function handleClickUseTopics() {
    if (onHandleClickImportTopicInstances(selectedTopics)) {
      handleClose();
      handleReset();
    }
  }

  return (
    <Dialog fullWidth maxWidth="md" classes={{paperScrollPaper: classes.paperScrollPaper}} open={isOpened} onClose={handleClose}>

      <DialogTitle>Select Topic</DialogTitle>

      <DialogContent>
        <DialogContentText component="div">
          <FilterForm
            searchLoading={searchLoading}
            list={list}
            filters={filters}
            onHandleChangeMultiSelect={handleChangeMultiSelect}
            onHandleReset={handleReset}
            onHandleSearch={handleSearch}
          />
        </DialogContentText>


        <TopicResultTable
          searchResult={searchResult}
          selectedTopics={selectedTopics}
          onHandleClickSelectTopic={handleClickSelectTopic}
          onHandleClickUseTopics={handleClickUseTopics}
        />

      </DialogContent>
    </Dialog>
  )
}

export default withStyles(styles)(LoadTopicsDialog);
