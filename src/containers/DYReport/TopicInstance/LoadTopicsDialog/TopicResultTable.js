import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Button, Typography} from '@material-ui/core';
import classnames from 'classnames';
import {format as dateFormat} from 'date-fns';


const styles = theme => ({
  noresults: {
    marginTop: 25,
    padding: 10,
    border: '1px solid ' + theme.palette.primary.light,
  },

  tableRoot: {
    width: '100%',
    position: 'relative',
    marginTop: 25,
  },
  table: {
    width: '100%',
    border: '1px solid ' + theme.palette.primary.light,
  },
  tHead: {
    width: 'inherit',
  },
  tBody: {
    width: 'inherit',
    // cursor: 'pointer',

    '& > div:last-child': {
      border: 'medium none',
    },
  },
  tRow: {
    display: 'flex',
    position: 'relative',
    borderBottom: '1px solid ' + theme.palette.primary.light,
    transition: 'backgroundColor 0.4s',

    '&:hover':{
      backgroundColor: '#f8f8ff',
      cursor: 'pointer',
    },
    '&.active': {
      backgroundColor: '#e4e4f9',
    },
  },
  tRowHead: {
    height: 38,
  },
  tRowBody: {

  },

  tCell: {
    display: 'flex',
    height: 'inherit',
    alignItems: 'baseline',
    width: '100%',
    padding: 10,
    border: 'medium none',
    borderRight: '1px solid ' + theme.palette.primary.light,
  },
  tCell1: {
    width: '20%',
    '& img': {
      maxWidth: '100%',
    }
  },
  tCell2: {
    width: '20%',
  },
  tCell3: {
    width: '40%',
  },
  tCell4: {
    width: '20%',
    borderRight: 'medium none',
  },
  tCellLine: { // bottom line
    fontSize: 14,
    color: theme.palette.text.primary,
    fontWeight: 'bold',
    position: 'relative',
    paddingBottom: 5,

    '&:after': {
      content: '""',
      position: 'absolute',
      width: '40%',
      height: 1,
      bottom: 4,
      left: 0,
      backgroundColor: theme.palette.secondary.main,
    }
  },

  button: {
    marginTop: 20,
  },

});

function TopicResultTable({classes, searchResult, selectedTopics, onHandleClickSelectTopic, onHandleClickUseTopics}) {

  /**
   * Check if topic is selected
   *
   * @param topic {object} - Topic object
   * @returns {boolean}
   */
  function isTopicSelected(topic) {
    let isTopicFound = false;
    selectedTopics.forEach(selectedTopic => {
      if (topic.id === selectedTopic.id) {
        isTopicFound = true;
      }
    });

    return isTopicFound;
  }

  /**
   * add/remove the new topic
   *
   * @param topic - Topic object
   * @param active - boolean
   */
  function handleClickSelectTopic(topic) {
    let topics = selectedTopics.filter(selectedTopic => selectedTopic.id !== topic.id);

    if (selectedTopics.length === topics.length) {
      topics.push(topic);
    }

    onHandleClickSelectTopic(topics);
  }

  // RENDER
  if (searchResult.length === 0) {
    return (
      <Typography component="div" className={classes.noresults}>
        No Results. Please use the filters above to search topics.
      </Typography>
    )
  }

  return (
    <div className={classes.tableRoot}>

      <div className={classes.table}>
        <div className={classes.tHead}>
          <div className={classnames(classes.tRow, classes.tRowHead)}>

            <Typography component="div" className={classnames(classes.tCell, classes.tCell1)}>
              <span className={classes.tCellLine}>Image</span>
            </Typography>

            <Typography component="div" className={classnames(classes.tCell, classes.tCell2)}>
              <span className={classes.tCellLine}>Title</span>
            </Typography>

            <Typography component="div" className={classnames(classes.tCell, classes.tCell3)}>
              <span className={classes.tCellLine}>Text</span>
            </Typography>

            <Typography component="div" className={classnames(classes.tCell, classes.tCell4)}>
              <span className={classes.tCellLine}>Date Modified</span>
            </Typography>

          </div>
        </div>

        <div className={classnames(classes.tBody)}>
          {searchResult.map((topic, key) =>
            <div
              key={key}
              className={classnames(classes.tRow, classes.tRowBody, {'active': (isTopicSelected(topic))})}
              onClick={() => handleClickSelectTopic(topic)}
            >
              <Typography component="div" className={classnames(classes.tCell, classes.tCell1)}>
                <img src={topic.image} alt="topic image"/>
              </Typography>

              <Typography component="div" className={classnames(classes.tCell, classes.tCell2)}>
                {topic.title}
              </Typography>

              <Typography component="div" className={classnames(classes.tCell, classes.tCell3)}>
                {topic.text}
              </Typography>

              <Typography component="div" className={classnames(classes.tCell, classes.tCell4)}>
                {dateFormat(topic.lastmodified, 'DD/MM/YYYY')}
              </Typography>

            </div>
          )}
        </div>

      </div>

      <Button variant="contained" color="secondary" className={classes.button} onClick={onHandleClickUseTopics} disabled={selectedTopics.length === 0}>
        Import Topics
      </Button>

    </div>
  )
}

export default withStyles(styles)(TopicResultTable);
