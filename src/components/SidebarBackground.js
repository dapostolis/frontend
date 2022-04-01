import React from 'react';
import {withStyles} from '@material-ui/core';
import classnames from 'classnames';


const styles = () => ({
  sidebarbg: {
    position: 'fixed',
    top: 0,
    width: 300,
    height: '100%',
    backgroundColor: '#fff',
  }
});

function SidebarBackground({classes, id, className}) {
  return <div id={id} className={classnames(classes.sidebarbg, className)}></div>
}

export default withStyles(styles)(SidebarBackground);