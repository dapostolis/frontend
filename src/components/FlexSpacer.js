import React from 'react';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    spacer: {
        flex: '1 1 100%',
    },
});

const FlexSpacer = ({classes}) => (
    <div className={classes.spacer}></div>
);

export default withStyles(styles)(FlexSpacer);