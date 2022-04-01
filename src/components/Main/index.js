import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {AuthConsumer} from 'context/AuthContext';
import {withStyles} from '@material-ui/core/styles';
import {PrivateRoute} from 'components/Auth';
import ErrorPage from 'components/ErrorPage';
import PrivateMarket from 'containers/PrivateMarket';
import UserManagement from 'containers/UserManagementTable';
import OrganizationTable from 'containers/OrganizationTable';
import VendorTable from 'containers/VendorTable';
import ModulesPage from 'components/ModulesPage';
import TopicTable from 'containers/TopicTable';
import TopicTagTable from 'containers/TopicTagTable';
import Olistic from 'components/ThirdParty/Olistic';
import DYReport from 'containers/DYReport';
import Currencies from 'containers/Currencies';
import Commodities from 'containers/Commodities';
import Activity from 'containers/Activity';
import Axidia from 'components/ThirdParty/Axidia';
import Equities from 'containers/Equities';
import TYB from 'containers/TYB';
import IndexSignals from 'containers/IndexSignals';
import UserSettings from 'containers/UserSettings';
import DataManagement from 'containers/DataManagement';
import MutualFund from 'containers/MutualFunds';
import HedgeFund from 'containers/HedgeFunds';
import FaqTable from 'containers/FaqTable';


const styles = () => ({
  main: {
    flexGrow: 1,
    position: 'relative',
    // overflow: 'hidden',
    marginBottom: 23,
  },
});

function Main({classes, user}) {

  let userCanAccessModules = user.role === 'SUPERADMIN' || user.skipTwoFactor || user.twoFactor;

  return (
    <main className={classes.main}>
      {userCanAccessModules ?

        <Switch>
          <Route path="/" exact component={() => <Redirect to="/category"/>}/>

          <Route path="/404" component={ErrorPage}/>

          <Route path="/category" component={ModulesPage}/>

          {/*todo finish with parsing dynamic type*/}
          {/*<Route path="/private-market/:type" component={(props) => (
            <AuthConsumer>
              {({user}) => (
                <PrivateMarket user={user} {...props}/>
              )}
            </AuthConsumer>
          )}/>*/}
          <Route path="/quant-strategist" component={IndexSignals}/>

          <Route path="/private-market" component={PrivateMarket}/>

          <Route path="/dyreport/:id" component={DYReport}/>
          <Route path="/dyreport" component={DYReport}/>

          <Route path="/currencies" component={Currencies}/>

          <Route path="/commodities" component={Commodities}/>

          <Route path="/equities" component={Equities}/>

          <Route path="/testyourbanker" component={TYB}/>

          <Route path="/mutual-funds" component={MutualFund}/>
          <Route path="/hedge-funds" component={HedgeFund}/>

          <Route path="/settings/user" component={UserSettings}/>


          {/*3rd party modules*/}
          <Route path="/olistic" component={() => (
            <AuthConsumer>
              {({user}) => (
                <Olistic authUser={user}/>
              )}
            </AuthConsumer>
          )}/>

          {/*<Route path="/flyplanet9" component={FlyPlanet9}/>*/}
          <Route path="/axidia" component={Axidia}/>


          <PrivateRoute path="/topic" component={TopicTable}/>

          <PrivateRoute path="/topic-tag" component={TopicTagTable}/>

          <PrivateRoute path="/organization" component={OrganizationTable}/>

          <PrivateRoute path="/faq" component={FaqTable}/>

          <PrivateRoute path="/vendor" component={VendorTable}/>

          <PrivateRoute path="/user/activity" component={Activity}/>
          <PrivateRoute path="/user" component={UserManagement}/>

          <PrivateRoute path="/data-management" component={DataManagement}/>

          {/*todo - Create generic error Component*/}
          <Route component={() => <Redirect to="/404"/>}/>
        </Switch>

        :

        <Switch>
          <Route path="/" exact component={() => <Redirect to="/settings/user"/>}/>

          <Route path="/404" component={ErrorPage}/>

          <Route path="/settings/user" component={UserSettings}/>

          <Route component={() => <Redirect to="/404"/>}/>
        </Switch>

      }
    </main>
  )
}

export default withStyles(styles)(Main);
