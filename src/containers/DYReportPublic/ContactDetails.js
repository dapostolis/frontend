/**
 * Contact Details area
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
  image: {
    fontSize: 14,
    textAlign: 'center',
    padding: 5,

    '& > img': {
      width: '100%',
      maxWidth: 740,
      maxHeight: 1000,
    }
  }
});

function ContactDetails({classes, image}) {
  return (
    <div className={classes.container}>
      <Typography variant="h5" className={classes.head}>Contact Details</Typography>
      <div className={classes.image}><img src={image} alt="contact"/></div>
    </div>
  )
}

export default withStyles(styles)(ContactDetails);