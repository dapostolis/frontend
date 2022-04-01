/**
 * Component route for Authenticated users
 */

import React, {useEffect} from 'react';
import Header from 'components/Header';
import Main from 'components/Main';
import Menu from 'components/Menu';
import Footer from 'components/Footer';
import {Authorized} from 'components/Auth';
import {request} from 'constants/alias'

function Authenticated({user, handleLogoutNoRequest, handleChangeUserPreferences}) {
  useEffect(() => {
    // Setup interceptor for auto-logout
    // first option to save this interceptor to AuthContext and then reject it on logout
    let interceptor = request.interceptors.response.use((response) => {
      return response;
    }, (error) => {
      const {response} = error;

      if (response && response.status === 401) { //&& response.config.url.indexOf('/api/v1/auth/logout') === -1) {
        handleLogoutNoRequest();
      }

      return Promise.reject(error);
    });

    // store interceptor
    handleChangeUserPreferences({
      requestInterceptor: interceptor,
    });
  }, []);

  return (
    <React.Fragment>

      <Header/>

      <Authorized
        resource="menuWrap"
        yes={() => <Menu/>}
      />

      {/*Basic Routers*/}
      <Main user={user}/>

      <Footer/>

    </React.Fragment>
  )
}

export default Authenticated;
