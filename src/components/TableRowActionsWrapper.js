import React from 'react';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    ActionsWrapper: {
        whiteSpace: 'nowrap',
    },
});

let TableRowActionsWrapper = ({classes, children}) => (
    <div className={classes.ActionsWrapper}>
        {children}
    </div>
);

export default withStyles(styles)(TableRowActionsWrapper);