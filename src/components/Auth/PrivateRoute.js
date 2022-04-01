import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import Authorized from './Authorized';

/**
 * <PrivateRoute/> is an Authorized wrapper just for protected react-routes
 */
function PrivateRoute(props) {

  let Component = props.component;

  return (
    <Authorized
      resource={props.path}
      resourceOwnerId={props.resourceOwnerId}
      yes={() => <Route path={props.path} component={Component}/>}
      no={() => <Redirect to="/404"/>}
    />
  )

}

export default PrivateRoute;