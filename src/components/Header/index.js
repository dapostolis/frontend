import React from 'react';
import {Link} from 'react-router-dom';
import {AppBar, Badge, IconButton, Menu, MenuItem, Toolbar} from '@material-ui/core';
import {
  AccountCircle,
  Dashboard as DashboardIcon,
  MoreVert as MoreIcon,
} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';
import {AuthConsumer} from 'context/AuthContext';
import ModulesMenu from './ModulesMenu'


const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.primary.light,
    display: 'inline',
    flexDirection: 'unset',
    flexShrink: 'unset',
  },
  toolbar: {
    paddingLeft: 10,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  logo: {
    marginTop: 4,
    height: 41,
    width: 'auto',
  },
  iconBudge: {
    paddingLeft: 8,
  },


  mdWrap: {
    maxWidth: 600,
    minWidth: 550,
    width: '55%',
    height: 300,
    padding: theme.spacing.unit * 3,
    outline: 'medium none',
  },
  mdColWrap: {
    display: 'flex',
    marginTop: 20,
    outline: 'medium none',
  },
  mdCol: {
    flexGrow: 1,
  },
  mdColTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingBottom: 5,
    position: 'relative',
    display: 'inline-block',
    marginBottom: 15,
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '60%',
      borderBottom: '2px solid rgb(56, 108, 167)',
    },
  },
  mdLinkWrap: {
    fontSize: 15,
    outline: 'medium none',
    color: '#b2b2b2',
    marginTop: 4,
    '&.disabled': {
      cursor: 'no-drop',
    },
  },
  mdLink: {
    fontSize: 15,
    color: theme.palette.textPrimary.main,
  },
});

class PrimarySearchAppBar extends React.Component {
  state = {
    modulesAnchor: null,
    userAnchorEl: null,
    settingsAnchorEl: null,
    mobileMoreAnchorEl: null,
    isLogoutInProgress: false,
  };

  handleModulesMenuOpen = event => {
    this.setState({modulesAnchor: event.currentTarget});
  };

  handleProfileMenuOpen = event => {
    this.setState({userAnchorEl: event.currentTarget});
  };

  handleSettingsMenuOpen = event => {
    this.setState({settingsAnchorEl: event.currentTarget});
  };

  handleMenuClose = () => {
    this.setState({
      modulesAnchor: null,
      userAnchorEl: null,
      settingsAnchorEl: null,
    });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({mobileMoreAnchorEl: event.currentTarget});
  };

  handleMobileMenuClose = () => {
    this.setState({mobileMoreAnchorEl: null});
  };

  handleLogout = (contextLogout) => {
    this.setState({isLogoutInProgress: true});

    contextLogout()
      .then(msg => console.log(msg))
      .catch(ex => {
        this.setState({isLogoutInProgress: false});
      });
  }

  hasAccessToModules(user) {
    return user.role === 'SUPERADMIN' || user.twoFactor || user.skipTwoFactor;
  }

  render() {
    const {modulesAnchor, userAnchorEl, settingsAnchorEl, mobileMoreAnchorEl} = this.state,
      {classes} = this.props,
      isModulesMenuOpen = Boolean(modulesAnchor),
      isUserMenuOpen = Boolean(userAnchorEl),
      isSettingsMenuOpen = Boolean(settingsAnchorEl),
      isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    return (
      <AuthConsumer>
        {({user, handleLogout}) => (
          <>
            <AppBar id="header" className={classes.appBar}>
              <Toolbar className={classes.toolbar}>
                {/*<IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
                    <MenuIcon/>
                </IconButton>*/}
                {/*<Link to="/"><img src={logo} alt="logo" className={classes.logo}/></Link>*/}
                <Link to="/"><img src={user.organization.logoUrl} alt="logo" className={classes.logo}/></Link>
                <div className={classes.grow}/>
                  <div className={classes.sectionDesktop}>
                    {this.hasAccessToModules(user) ?
                      <IconButton
                        aria-owns={isModulesMenuOpen ? 'material-appbar' : undefined}
                        aria-haspopup="true"
                        onClick={this.handleModulesMenuOpen}
                        color="inherit"
                      >
                        <DashboardIcon/>
                      </IconButton>
                      : ''}

                  {/*<IconButton color="inherit" className={classes.iconBudge}>*/}
                  {/*<Badge badgeContent={17} color="secondary">*/}
                  {/*<NotificationsIcon/>*/}
                  {/*</Badge>*/}
                  {/*</IconButton>*/}

                  {/*<Tooltip title="Toggle light/dark theme" aria-label="theme-toggle">
                    <IconButton
                      color="inherit"
                      onClick={() => toggleTheme(themeType === 'light' ? 'dark' : 'light')}
                    >
                      {themeType === 'light' ? <WbSunnyIconOutlined/> : <WbSunnyIcon/>}
                    </IconButton>
                  </Tooltip>*/}

                  <IconButton
                    aria-owns={isUserMenuOpen ? 'material-appbar' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleProfileMenuOpen}
                    color="inherit"
                  >
                    <AccountCircle/>
                  </IconButton>
                </div>
                <div className={classes.sectionMobile}>
                  <IconButton
                    aria-haspopup="true"
                    onClick={this.handleMobileMenuOpen}
                    color="inherit"
                  >
                    <MoreIcon/>
                  </IconButton>
                </div>
              </Toolbar>
            </AppBar>

            {/*Modules menu*/}
            <Menu
              anchorEl={modulesAnchor}
              anchorOrigin={{vertical: 'top', horizontal: 'right'}}
              transformOrigin={{vertical: 'top', horizontal: 'right'}}
              open={isModulesMenuOpen}
              onClose={this.handleMenuClose}
              classes={{paper: classes.mdWrap}}
            >

              <ModulesMenu classes={classes} user={user}/>

            </Menu>

            {/*User Menu*/}
            <Menu
              anchorEl={userAnchorEl}
              anchorOrigin={{vertical: 'top', horizontal: 'right'}}
              transformOrigin={{vertical: 'top', horizontal: 'right'}}
              open={isUserMenuOpen}
              onClose={this.handleMenuClose}
            >
              {/*<Authorized
                resource="elem:user-management"
                yes={() => <MenuItem component={Link} to={'/user'}>User Management</MenuItem>}
              />*/}

              <MenuItem component={Link} to="/settings/user">Settings</MenuItem>

              <MenuItem onClick={() => this.handleLogout(handleLogout)}>Logout</MenuItem>
            </Menu>

            {/*Settings Menu*/}
            <Menu
              anchorEl={settingsAnchorEl}
              anchorOrigin={{vertical: 'top', horizontal: 'right'}}
              transformOrigin={{vertical: 'top', horizontal: 'right'}}
              open={isSettingsMenuOpen}
              onClose={this.handleMenuClose}
            >
              {/*<Authorized
                resource="menuitem:qis"
                yes={() => <MenuItem component={Link} to="admin/qi">QIs</MenuItem>}
              />

              <Authorized
                resource="menuitem:rst"
                yes={() => <MenuItem component={Link} to="/admin/radio-service-type">Radio Service
                  Types</MenuItem>}
              />*/}

              <MenuItem>Theme</MenuItem> {/*todo - open modal*/}
            </Menu>

            {/*Responsive menu*/}
            <Menu
              anchorEl={mobileMoreAnchorEl}
              anchorOrigin={{vertical: 'top', horizontal: 'right'}}
              transformOrigin={{vertical: 'top', horizontal: 'right'}}
              open={isMobileMenuOpen}
              onClose={this.handleMobileMenuClose}
            >
              {this.hasAccessToModules(user)
                ? <MenuItem onClick={this.handleModulesMenuOpen}>
                  <IconButton color="inherit">
                    <DashboardIcon/>
                  </IconButton>
                  <p>Modules</p>
                </MenuItem>
                : ''}
              <MenuItem onClick={this.handleProfileMenuOpen}>
                <IconButton color="inherit">
                  <AccountCircle/>
                </IconButton>
                <p>Profile</p>
              </MenuItem>
            </Menu>
          </>
        )}
      </AuthConsumer>
    );
  }
}

export default withStyles(styles)(PrimarySearchAppBar);
