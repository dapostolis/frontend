/**
 * Disclaimer area
 */

import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';


const styles = () => ({
  container: {
    margin: '0 20px 15px 20px',
  },
  head: {
    fontSize: 15,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    // whiteSpace: 'pre-wrap',
    maxHeight: 990,
    overflow: 'hidden',
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  }
});

function Disclaimer({classes, text}) {
  return (
    <div className={classes.container}>
      <Typography variant="h5" className={classes.head}>Disclaimer</Typography>
      <Typography variant="body1" className={classes.text}>{text}</Typography>
    </div>
  )
}

export default withStyles(styles)(Disclaimer);