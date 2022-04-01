import React from 'react';
import HasAccess from './HasAccess';
import {AuthConsumer} from "context/AuthContext";

/**
 * <HasAccess/> Wrapper to reduce boilerplate code by always using <AuthConsumer/>
 */
const Authorized = (props) => (
  <AuthConsumer>
    {({user}) => (
      <HasAccess
        role={user.role}
        resource={props.resource}
        data={(() => (!isNaN(props.resourceOwnerId) ? {
          userId: user.id,
          resourceOwnerId: props.resourceOwnerId
        } : null))()}
        yes={props.yes}
        no={props.no}
      />
    )}
  </AuthConsumer>
)

export default Authorized;