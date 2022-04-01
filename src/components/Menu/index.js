import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import {Drawer, List, ListItem, ListItemText, Divider, Typography} from '@material-ui/core';
import {
  People as PeopleIcon,
  Work as WorkIcon,
  Assessment as AssessmentIcon,
  GroupWork as GroupWorkIcon,
  Label as LabelIcon,
  ViewHeadline as ViewHeadlineIcon,
  Folder as FolderIcon,
  QuestionAnswer as QuestionAnswerIcon
} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';
import ListItemIcon from "@material-ui/core/ListItemIcon";


const drawerWidth = 55;

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: { // override paper
    width: drawerWidth,
    height: 'calc(100% - 20px)',
    boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.2)',
    backgroundColor: theme.palette.primary.moreLight,

    '&:hover': {
      width: 270
    }
  },

  toolbar: theme.mixins.toolbar,

  menuHead: {
    margin: '20px 5px 0 10px',
    color: theme.palette.secondary.main,
  },

  listItem: {
    // borderBottom: '1px solid ' + theme.palette.primary.light
    whiteSpace: 'nowrap',
    // padding: 0,
    overflow: 'hidden',
    '&.active': {
      backgroundColor: 'rgba(0, 0, 0, 0.14)'
    },
  },
  rootListItemText: {
    padding: 0
  }
});

let Menu = ({classes}) => (
  <Drawer
    id="main-menu"
    className={classes.drawer}
    variant="permanent"
    classes={{
      paper: classes.drawerPaper,
    }}
  >

    <div className={classes.toolbar}/>
    <List>
      <ListItem button component={NavLink} to="/topic" activeClassName="active" className={classes.listItem}>
        <ListItemIcon><ViewHeadlineIcon/></ListItemIcon>
        <ListItemText classes={{root: classes.rootListItemText}} primary="Topics"/>
      </ListItem>
      <ListItem button component={NavLink} to="/topic-tag" activeClassName="active" className={classes.listItem}>
        <ListItemIcon><LabelIcon/></ListItemIcon>
        <ListItemText classes={{root: classes.rootListItemText}} primary="Topic Tags"/>
      </ListItem>
      <ListItem button component={NavLink} to="/vendor" activeClassName="active" className={classes.listItem}>
        <ListItemIcon><WorkIcon/></ListItemIcon>
        <ListItemText classes={{root: classes.rootListItemText}} primary="Vendors"/>
      </ListItem>
      <ListItem button component={NavLink} to="/user/activity" activeClassName="active" className={classes.listItem}>
        <ListItemIcon><AssessmentIcon/></ListItemIcon>
        <ListItemText classes={{root: classes.rootListItemText}} primary="Activities"/>
      </ListItem>
      <ListItem button component={NavLink} to="/user" activeClassName="active" className={classes.listItem}>
        <ListItemIcon><PeopleIcon/></ListItemIcon>
        <ListItemText classes={{root: classes.rootListItemText}} primary="Users"/>
      </ListItem>
      <ListItem button component={NavLink} to="/organization" activeClassName="active" className={classes.listItem}>
        <ListItemIcon><GroupWorkIcon/></ListItemIcon>
        <ListItemText classes={{root: classes.rootListItemText}} primary="Organizations"/>
      </ListItem>
      <ListItem button component={NavLink} to="/faq" activeClassName="active" className={classes.listItem}>
              <ListItemIcon><QuestionAnswerIcon/></ListItemIcon>
              <ListItemText classes={{root: classes.rootListItemText}} primary="FAQs"/>
            </ListItem>
      <ListItem button component={NavLink} to="/data-management" activeClassName="active" className={classes.listItem}>
        <ListItemIcon><FolderIcon/></ListItemIcon>
        <ListItemText classes={{root: classes.rootListItemText}} primary="Data Management"/>
      </ListItem>
    </List>

  </Drawer>
)

export default withStyles(styles)(Menu);
