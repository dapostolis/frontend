import React from 'react';
import {withStyles} from '@material-ui/core/styles/index';
import HeadingTwoLines from 'components/HeadingTwoLines';
import {Typography} from '@material-ui/core';
import classnames from 'classnames';


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
    marginTop: 10,

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

function TopicInstance({classes, topicinstance}) {

  const {title, text, contenturl: image, textposition} = topicinstance;

  return (
    <div
      className={classnames(classes.actionParent, 'action-parent')}
    >
      <div>
        <HeadingTwoLines variant="h4" className={classes.title}>
          {title}
        </HeadingTwoLines>
      </div>
      <div className={classnames(classes.selectedTopicRow, textposition.toLowerCase())}>
        <div className={classes.selectedTopicText}>
          <Typography component="div" variant="body1" className={classes.topicText}>
            <div className={classes.textResult}>{text}</div>
          </Typography>
        </div>
        <div className={classes.selectedTopicImageWrap}>
          <img src={image} className={classes.selectedTopicImage}/>
        </div>
      </div>

    </div>
  )
}

export default withStyles(styles)(TopicInstance);