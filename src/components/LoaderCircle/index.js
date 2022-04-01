/**
 * Loader component
 */

import React from 'react';
import {Paper} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';


const styles = () => ({
  loaderWrap: {
    zIndex: '11',
    position: 'absolute',
    top: 100,
    left: 'calc(50% - 40px)',
    opacity: 0,
    visibility: 'hidden',
    backgroundColor: 'transparent',

    '&.start': {
      visibility: 'visible',
      opacity: 1,
      animation: 'spin 1s cubic-bezier(0.18, 0.74, 0.82, 0.73) infinite',
    },
  },
  loader: {
    width: 60,
    height: 60,
    border: '5px solid #ededed',
    borderTop: '5px solid #0288d1',
    borderRadius: '50%',
    margin: '0 auto',
    '&.small': {
      width: 35,
      height: 35,
    },
  },
});

/**
 * Loader React Component
 *
 * @param {boolean} isStarted
 * @returns {React Component}
 */
const Loader = ({classes, className, size, start: isStarted}) => (
  <Paper className={classnames(classes.loaderWrap, className, {start: isStarted})} square={true} elevation={0}>
    <div className={classnames(classes.loader, size)}></div>
  </Paper>
)

export default withStyles(styles)(Loader);