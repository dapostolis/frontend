import React from 'react';
import {Link as MLink, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import byobetaImage from './byob-circle.png';


const styles = theme => ({
  poweredContainer: {

    textAlign: 'center',
    position: 'fixed',
    bottom: 25,
    width: 300,
    padding: '20px 0',
    opacity: 0.7,
    borderTop: '1px solid #ccc',
    backgroundColor: 'white',
    transition: 'all 0.4s ease',

    // textAlign: 'center',
    // width: '100%',
    // position: 'relative',
    // padding: '20px 0',
    // backgroundColor: 'white',
    // borderTop: '1px solid #ccc',
    //
    // opacity: 0.7,
    // transition: 'all 0.4s ease',

    '&:hover': {
      opacity: 1,
    },
  },
  powered: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    textDecoration: 'none',

    height: 60,
    width: 60,
    padding: 10,
    borderRadius: 30,
    bottom: 5,
    backgroundColor: 'white',
    boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',

    '& img': {
      width: 40,
      height: 'auto',
    },

    // '&:hover': {
    //   opacity: 1,
    //   textDecoration: 'none',
    //   width: 200,
    // },

    // '& .poweredby': {
    //   opacity: 0,
    //   visibility: 'hidden',
    //   display: 'none',
    // },

    // '&:hover .poweredby': {
    //   opacity: 1,
    //   visibility: 'visible',
    //   display: 'inline',
    // },

  },
  poweredTextLink: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  poweredText: {
    fontWeight: 'bold',
    color: '#ef6537',
  },
});

function PoweredBy({classes}) {
  return (
    <div className={classes.poweredContainer}>
      <MLink
        className={classes.poweredTextLink}
        href="https://www.byobeta.com/"
        rel="noopener noreferrer"
        target="_blank"
      >
        {/*<Button
              variant="contained"
              // color="secondary"
              component={MLink}
              className={classes.powered}
              href="https://www.byobeta.com/"
              rel="noopener noreferrer"
              target="_blank"
            >*/}
        <div className={classes.powered}>
          <img src={byobetaImage}/>
        </div>
        {/*</Button>*/}
        <Typography className={classes.poweredText}>
          In collaboration with byobeta
        </Typography>
      </MLink>
    </div>
  )
}

export default withStyles(styles)(PoweredBy);