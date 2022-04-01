import React from 'react';
import {Link} from 'react-router-dom';
import {Paper, List, ListItem, ListItemIcon, ListItemText, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import {Folder as FolderIcon} from '@material-ui/icons';


const styles = theme => ({
  paper: {
    color: theme.palette.text.secondary,
    height: '100%',
    padding: theme.spacing.unit * 2,
    transition: 'transform 0.4s ease',

    '&:hover': {
      transform: 'scale(1.05)'
    },
    '&.disabled': {
      opacity: '0.4',
    },
  },

  listItem: {
    alignItems: 'flex-start',
    borderBottom: '1px solid ' + theme.palette.primary.light,
    padding: '10px 6px',
  },

  moduleTitle: {
    fontSize: 20,
    paddingBottom: 5,
    borderBottom: '2px solid ' + theme.palette.secondary.main
  },

  sideIcon: {
    margin: 0,
  },
});

function ExtendedList({classes, disabled, category, secondary}) { // todo remove secondary and use modules.js

  return (
    <Paper className={classes.paper + (disabled ? ' disabled' : '')}>
      <Typography variant="h3" className={classes.moduleTitle}>
        {category.name}
      </Typography>

      <List component="nav">

        {Array.isArray(category.modules) && category.modules.map((value, key) => (

          <ListItem
            key={key}
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            aria-label={value}
            className={classes.listItem}
            component={!disabled ? Link : null}
            to={!disabled ? "/private-market" : null} // todo link
          >
            <ListItemIcon className={classes.sideIcon}><FolderIcon/></ListItemIcon>
            <ListItemText
              primary={value}
              secondary={secondary}
            />
          </ListItem>

        ))}

      </List>

    </Paper>
  )

}

export default withStyles(styles)(ExtendedList);