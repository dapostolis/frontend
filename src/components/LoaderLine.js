import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Fade, LinearProgress} from '@material-ui/core';


const style = theme => ({
    LinearProgressRoot: {
        position: 'absolute',
        width: '100%',
        height: 2, // todo - make height dynamic
    }
})

let LoaderLine = ({classes, start}) => (
    <Fade in={start} unmountOnExit>
        <LinearProgress
            color="secondary"
            classes={{root: classes.LinearProgressRoot}}
        />
    </Fade>
)

export default withStyles(style)(LoaderLine);