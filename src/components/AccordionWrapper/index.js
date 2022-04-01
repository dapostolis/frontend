import React from 'react';
import {withStyles} from '@material-ui/core/styles';


const styles = () => ({
  root: {
    width: '100%',
  },
});

function AccordionWrapper({classes, children}) {
  return (
    <div className={classes.root}>
      {children}
    </div>
  );
}

export default withStyles(styles)(AccordionWrapper);