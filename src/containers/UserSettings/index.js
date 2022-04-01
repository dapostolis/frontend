import React from 'react';
import {Grid} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import MainBareWrapper from 'components/MainBareWrapper';
import {AuthConsumer} from 'context/AuthContext';
import ProfilePaper from './ProfilePaper';
import OrganizationPaper from './OrganizationPaper';
import ModulesPaper from './ModulesPaper';


const styles = theme => ({
  container: {
    marginTop: theme.mixins.toolbar.minHeight + 20,

    '& .gridItem': {
      // width: '50%',
    },
  },

  rootGrid: {
    // flexFlow: 'column wrap',
  },
});

function UserSettings({classes}) {
  function hasAccessToModules(user) {
    return user.role === 'SUPERADMIN' || user.twoFactor || user.skipTwoFactor;
  }

  return (
    <AuthConsumer>
      {({user, handleChangeUser, handleChangeThemeColor, handleLogout}) => (
        <MainBareWrapper className={classes.container}>

          <Grid container className={classes.rootGrid} spacing={24}>
            <Grid item xs={12} sm={12} md={12} lg={hasAccessToModules(user) ? 6 : 12}>
              <ProfilePaper
                user={user}
                onHandleChangeUser={handleChangeUser}
                onHandleLogout={handleLogout}
              />
            </Grid>

            {hasAccessToModules(user) ?
              <>

                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <ModulesPaper
                    user={user}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <OrganizationPaper
                    user={user}
                    onHandleChangeUser={handleChangeUser}
                    onHandleChangeThemeColor={handleChangeThemeColor}
                  />
                </Grid>

                {/*<Grid item xs={12} sm={12} md={12} lg={6}>*/}
                {/*  <PaymentHistoryPaper*/}
                {/*    user={user}*/}
                {/*  />*/}
                {/*</Grid>*/}
              </>
              : ''}
          </Grid>
        </MainBareWrapper>
      )}
    </AuthConsumer>
  );
}

export default withStyles(styles)(UserSettings);
