import React from 'react';
import MainBareWrapper from '../MainBareWrapper'
import {Typography} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'


const style = () => ({
  h1: {
    fontSize: 40,
    textAlign: 'center',
    paddingTop: '15%',
  },
});

function ErrorPage({classes}) {
  return (
    <MainBareWrapper>
      <Typography variant="h1" className={classes.h1}>Page not found</Typography>
    </MainBareWrapper>
  )
}

export default withStyles(style)(ErrorPage);