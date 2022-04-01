import React from 'react';
import {withStyles} from '@material-ui/core/styles/index';
import HeadingTwoLines from 'components/HeadingTwoLines';
import {Fab, Typography} from '@material-ui/core';
import EditInput from 'components/FlatField/EditInput';
import classnames from 'classnames';
import {
  ControlCamera as ControlCameraIcon,
  Delete as DeleteIcon,
  SwapHorizontalCircle as SwapHorizIcon,
  Sync as SyncIcon,
} from '@material-ui/icons';
import EditImageUpload from 'components/FlatField/EditImageUpload';


const styles = theme => ({
  // override action
  actionParent: {
    '&.active': {
      backgroundColor: '#e2f7e2',
      border: '2px dotted gray !important',
    },
    '&.start-sort': {
      cursor: 'move',
    },
  },
  action: {
    top: '44% !important',
    left: '-53px !important',
    height: '48px !important',
  },

  title: {
    fontSize: 18,
    maxWidth: 725,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    marginBottom: 0,
  },
  selectedTopicRow: {
    display: 'flex',
    // alignItems: 'center', // ??????
    padding: theme.spacing.unit,

    '&.right': {
      flexDirection: 'row-reverse',
    }
  },
  selectedTopicText: {
    width: '50%',
    height: 235,
    overflow: 'hidden',
    paddingRight: 10,

    '.right &': {
      paddingRight: 0,
      paddingLeft: 10,
    },
  },
  topicText: {
    fontSize: 14,
    fontWeight: 'normal',
    // textAlign: 'justify',
  },
  selectedTopicImageWrap: {
    textAlign: 'center',
    width: '50%',
    height: 235,
    // paddingTop: 5,
    paddingLeft: 10,

    '.right &': {
      paddingLeft: 0,
      paddingRight: 10,
    },

    '.action-parent.custom &': {
      cursor: 'pointer',
      opacity: 1,
      transition: 'opacity 0.4s',
    },
    '.action-parent.custom &:hover': {
      opacity: 0.7
    },
  },
  selectedTopicImage: {
    width: 370,
    height: 235,

    maxWidth: 370,
    maxHeight: 235,
  },

  inputTitle: {
    width: 720,
  },
  textInput: {
    width: 340,
  },
  textResult: {
    whiteSpace: 'pre-line',
    maxWidth: 723,
    height: 230,
    overflow: 'hidden',
  },

  sync: {
    position: 'absolute',
    top: 'calc(50% - 20px)',
    right: -250,
  },
  syncIcon: {
    marginRight: theme.spacing.unit,
  },

});

function TopicInstance({
                         classes,
                         dyLoading,
                         topicInstanceKey,
                         topicinstance,
                         onHandleChangeTopicFields,
                         onHandleRearrangeTopicInstance,
                         onHandleChangeTextPosition,
                         onToggleSyncTopicDialog,
                         onHandleDeleteTopicInstance,
                         onHandleEditTopicInstance,
                         move: {moveFrom, setMoveFrom},
                         onHandleAutoSave
                       }
) {

  let isCustomTopic = !topicinstance.topic || topicinstance.topic === 'null';

  //REARRANGE_TOPIC_INSTANCES
  function handleMove(event, clickedItem) {
    event.preventDefault();

    if (clickedItem < 0) return;

    if (moveFrom === -1) {
      setMoveFrom(clickedItem);
    }
  }

  function handleStopMove() {
    // on second click ->
    if (moveFrom > -1) {
      onHandleAutoSave();
      setMoveFrom(-1);
    }
  }

  function handleMouseOverMove(moveTo) {
    if (moveTo < 0 || moveFrom === -1) return;

    onHandleRearrangeTopicInstance(moveFrom, moveTo, setMoveFrom);
  }
  //EoREARRANGE_TOPIC_INSTANCES

  /*function handleEditTopicInstanceWrap() {
    return function (image) {
      onHandleEditTopicInstance(topicinstance, image);
    }
  }*/

  const {title, text, contenturl: image, textposition, topicrevision} = topicinstance;

  return (
    <div
      className={classnames(classes.actionParent, 'action-parent', {'progress': dyLoading}, {'custom': isCustomTopic}, {active: topicInstanceKey === moveFrom}, {'start-sort': moveFrom > -1})}
      onClick={handleStopMove}
      onMouseOver={() => handleMouseOverMove(topicInstanceKey)}
    >
      {topicrevision ?
        <div className={classes.sync}>
          <Fab variant="extended" aria-label="Sync" color="secondary" onClick={() => onToggleSyncTopicDialog(topicInstanceKey, topicinstance)}>
            <SyncIcon className={classes.syncIcon}/>
            Update available
          </Fab>
        </div>
        : ''}

      <div>
        <HeadingTwoLines variant="h4" className={classes.title}>
          {topicInstanceKey === moveFrom
            ? title
            : <EditInput
              defaultValue="xxx"
              fieldValue={title}
              css={{
                control: classes.inputTitle,
              }}
              disabled={dyLoading}
              onChange={onHandleChangeTopicFields(topicInstanceKey, 'title')}
              onBlur={onHandleAutoSave}
            />}
        </HeadingTwoLines>
      </div>
      <div className={classnames(classes.selectedTopicRow, textposition.toLowerCase())}>
        <div className={classes.selectedTopicText}>
          <Typography component="div" variant="body1" className={classes.topicText}>
            {topicInstanceKey === moveFrom
              ? text
              : <EditInput
                multiline
                defaultValue="Add some text..."
                fieldValue={text}
                css={{
                  result: classes.textResult,
                  control: classes.textInput,
                }}
                disabled={dyLoading}
                onChange={onHandleChangeTopicFields(topicInstanceKey, 'text')}
                onBlur={onHandleAutoSave}
              />}
          </Typography>
        </div>
        <div className={classes.selectedTopicImageWrap}>
          {topicInstanceKey === moveFrom || !isCustomTopic
            ? <img src={image} className={classes.selectedTopicImage}/>
            : <EditImageUpload
              fieldValue={image}
              css={{
                result: classes.selectedTopicImage,
              }}
              onSave={onHandleEditTopicInstance(topicinstance)}
            />}
        </div>
      </div>

      {moveFrom === -1 ?
        <div className={classnames('action', classes.action)}>
          <Typography component="div" onClick={() => onHandleDeleteTopicInstance(topicInstanceKey)}>Delete <DeleteIcon fontSize="inherit"/></Typography>
          <Typography component="div" onClick={event => handleMove(event, topicInstanceKey)}>Move <ControlCameraIcon fontSize="inherit"/></Typography>
          <Typography component="div" onClick={() => onHandleChangeTextPosition(topicInstanceKey)}>Swap <SwapHorizIcon fontSize="inherit"/></Typography>
        </div> : ''}

    </div>
  )
}

export default withStyles(styles)(TopicInstance);