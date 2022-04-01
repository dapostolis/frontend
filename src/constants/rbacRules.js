/**
 * Determine the RBAC rules
 *
 * [Resources]
 *
 * Define resources in order to enable the RBAC checker. Resources are string identifiers that has to be unique.
 * E.g.1 /route-path/xxx/xx declare a router resource
 * E.g.2 user-rest declare a REST resource
 * E.g.x whatever you like
 *
 *
 *
 * [Possible Actions]
 * <resource>:<action>
 *
 * list
 * create
 * get
 * getSelf - to get self details only (for user resource only)
 * edit
 * delete
 * E.g. user-rest:edit
 *
 *
 *
 * [Other conventions]
 *
 * ALL - gives access in any resource of the app
 */

let genericResourceEdit = ({userId, resourceOwnerId}) => {
  if (!userId || !resourceOwnerId) {
    return false;
  }
  return userId === resourceOwnerId;
};



export default {
  // ANONYMOUS: {
  //     static: [''],
  // },

  WEALTH_MANAGER: {
    static: [
      'faq:user-component'
    ],

    dynamic: {
      "/user/:id": genericResourceEdit,
    }
  },

  SUPERADMIN: {
    static: 'ALL',
  },
};
