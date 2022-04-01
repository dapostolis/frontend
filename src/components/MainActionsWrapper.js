import React from 'react';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
  actionsWrapper: {
    flex: '0 0 auto',
  },
});

let MainActionsWrapper = ({classes, children}) => (
  <div className={classes.actionsWrapper}>
    {children}
  </div>
);

export default withStyles(styles)(MainActionsWrapper);