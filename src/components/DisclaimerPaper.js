import React from 'react';
import {Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    fontSize: 13,
  },
});

function DisclaimerPaper({classes}) {
  return (
    <>
      <Typography variant="h5" className={classes.title}>Disclaimer</Typography>

      <Typography className={classes.text}>Historical performance results, forecasts and/or indicators are provided for general comparison purposes only and do not
        reflect the impact of any fees, nor the impact of taxes. It should not be assumed that your portfolio corresponds directly to any
        comparative results. Past recommendations are not a guarantee of future results.  Using any graph, chart, or other device to assist
        in deciding which securities to trade or when to trade them presents many difficulties and their effectiveness has significant
        limitations, including that prior patterns may not repeat themselves continuously or on any particular occasion.</Typography>
    </>
  )
}

export default withStyles(styles)(DisclaimerPaper);