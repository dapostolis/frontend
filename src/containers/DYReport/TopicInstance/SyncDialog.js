import React, {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Button, Dialog, DialogContent, DialogContentText, DialogTitle, Typography} from '@material-ui/core';
import {request} from 'constants/alias';
import {API} from 'constants/config';


const styles = theme => ({
  paperScrollPaper: {
    height: 'calc(100% - ' + 96 + 'px)', // todo make 96 dynamic
  },

  diffContainer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',

    '& > div': {
      width: '100%',
      display: 'flex',
    },
    '& > div > div': {
      textAlign: 'center',
      width: '50%',
      padding: 4,
      border: '2px dotted ' + theme.palette.primary.light,
    },
  },

  mainTitleWrapper: {
    backgroundColor: theme.palette.secondary.dark,
  },
  mainTitle: {
    fontSize: 24,
    color: theme.palette.getContrastText(theme.palette.secondary.dark),
    padding: '10px 0',
  },
  h5: {
    fontSize: 18,
  },
  body: {
    whiteSpace: 'pre-line',
  },

  img: {
    maxWidth: '100%',
  },

  button: {
    marginTop: 20,
    marginRight: 10,
  }
});

function SyncDialog({classes, syncTopicInstance, onToggleSyncTopicDialog, onHandleSyncTopicInstance}) {

  const [fetchedLatestTopic, setFetchedLatestTopic] = useState({});

  useEffect(() => {

    if (syncTopicInstance.object && syncTopicInstance.object.topicrevision) {
      request.get(`${API}topic/${syncTopicInstance.object.topicrevision}`)
        .then(({data: {returnobject:latestTopicInstance}}) => {
          setFetchedLatestTopic(latestTopicInstance);
        })
        .catch(error => {
          console.log(error);
        });
    }

  }, [syncTopicInstance]); // todo cache syncTopicInstance


  function handleClose() {
    onToggleSyncTopicDialog({});
  }

  function handleClickSync() {
    if (syncTopicInstance.key >= 0 && syncTopicInstance.object) {
      onHandleSyncTopicInstance(syncTopicInstance.key, syncTopicInstance.object.id);
    } else {
      console.log('Something went wrong with the current topic instance', syncTopicInstance);
    }
  }

  return (
    <Dialog fullWidth maxWidth="md" classes={{paperScrollPaper: classes.paperScrollPaper}} open={syncTopicInstance.object ? true : false} onClose={handleClose}>

      <DialogTitle>Review Latest Topic</DialogTitle>

      <DialogContent>
        <DialogContentText component="div">
          Before update your current topic content, compare the differences with the latest.
        </DialogContentText>

        <div className={classes.diffContainer}>

          <div className={classes.mainTitleWrapper}>
            <div><Typography className={classes.mainTitle} variant="h3">Current Topic</Typography></div>
            <div><Typography className={classes.mainTitle} variant="h3">Latest Topic</Typography></div>
          </div>

          <div>
            {syncTopicInstance.object ? <div><Typography variant="h5" className={classes.h5}>{syncTopicInstance.object.title}</Typography></div> : ''}
            {fetchedLatestTopic.id ? <div><Typography variant="h5"  className={classes.h5}>{fetchedLatestTopic.title}</Typography></div> : ''}
          </div>

          <div>
            {syncTopicInstance.object ? <div><Typography variant="body1">{syncTopicInstance.object.text}</Typography></div> : ''}
            {fetchedLatestTopic.id ? <div><Typography variant="body1">{fetchedLatestTopic.text}</Typography></div> : ''}
          </div>

          <div>
            {syncTopicInstance.object ? <div><img className={classes.img} src={syncTopicInstance.object.contenturl} alt="topic-current-image"/></div> : ''}
            {fetchedLatestTopic.id ? <div><img className={classes.img} src={fetchedLatestTopic.contentURL} alt="topic-current-image"/></div> : ''}
          </div>

        </div>

        <Button className={classes.button} variant="contained" color="secondary" onClick={handleClickSync}>Accept Topic Update</Button>

      </DialogContent>

    </Dialog>
  )
}

export default withStyles(styles)(SyncDialog);