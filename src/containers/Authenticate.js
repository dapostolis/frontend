import React, {useEffect, useState} from 'react';
import {AuthProvider} from 'context/AuthContext';
import {API, CRUD, PROJECT_NAME} from 'constants/config';
import {request} from 'constants/alias';


/**
 * Set Context <AuthProvider/> value
 */
function Authenticate({children, handleChangeThemeColor}) {

  const [state, setState] = useState({
    isAuthenticated: false,
    getAuthenticatedUserCompleted: false,
    user: {
      role: 'anonymous',
    },
    preferences: {},
  });

  useEffect(() => {
    getAuthenticatedUser()
      .then(response => console.log(response))
      .catch(error => console.log(error));
  }, []);

  async function getAuthenticatedUser() {
    try {

      const {data: {returnobject: user}} = await request.get(`${API}auth/user`);

      setState({
        isAuthenticated: true,
        getAuthenticatedUserCompleted: true,
        user: {
          id: user.id,
          firstname: user.firstName,
          lastname: user.lastName,
          phone: user.phone,
          email: user.email,
          username: user.username,
          currency: user.currency || '',
          role: user.role,
          organization: user.organization,
          categories: user.categories,
          twoFactor: user.twoFactor,
          skipTwoFactor: user.skipTwoFactor,
          dateCreated: user.dateCreated,
        },
        preferences: {},
      });

      // white label for logged in user
      let theme = {
        themeColor: user.organization.themeColor,
        logoUrl: user.organization.logoUrl,
      };
      window.localStorage.setItem('th', window.btoa(JSON.stringify(theme)));
      handleChangeThemeColor(user.organization.themeColor);

      // openSocket();

      return `User ${user.email} is authenticated`;

    } catch (ex) {
      console.log(ex);

      const user = {
        role: 'anonymous',
      };

      const organization = await getOrganizationFromLocalstorage();

      if (organization) {
        user.organization = organization;
        handleChangeThemeColor(organization.themeColor);
      }

      setState({
        ...state,
        user: user,
        getAuthenticatedUserCompleted: true,
      });

      throw new Error(ex);

    }
  }

  /**
   * White label for anonymous user
   *
   * @returns {Promise<boolean|{themeColor: string, logoUrl: string}>}
   */
  async function getOrganizationFromLocalstorage() {
    try {

      let th = window.localStorage.getItem('th');
      if (!th) throw 'It looks that no user has been logged in on this browser yet';

      let theme = JSON.parse(window.atob(th));

      // Check if logo url exists status:[200]
      await request.get(theme.logoUrl);

      let organization = {
        logoUrl: theme.logoUrl,
        themeColor: theme.themeColor,
      };

      return organization;

    } catch (ex) {
      console.log(ex);

      return false;
    }
  }

  /**
   * Login REST call
   *
   * @param username
   * @param password
   * @param webAuthnBody - if U2F enabled else undefined
   * @returns {Promise<any>}
   */
  function handleLogin(username, password, webAuthnBody) {
    return new Promise((resolve, reject) => {
      const requestData = {
        username: username,
        password: password,
      };

      if (webAuthnBody) {
        requestData.webAuthnBody = JSON.stringify(webAuthnBody);
      }

      request
        .post(`${API}auth/login`, requestData)
        .then(() => {
          setTimeout(() => {
            getAuthenticatedUser()
              .then(response => console.log(response))
              .catch(error => console.error(error));
          }, CRUD.delay);
        })
        .catch((error) => {
          const {response: {status}} = error;

          if (status === 401 || status === 403) {
            reject('Wrong username or password');
          } else {
            reject('Something went wrong. Please contact the system administrator');
          }
        });
    });
  }

  function handleChangeUser(user) {
    setState({
      ...state,
      user: user,
    });
  }

  function handleChangeUserPreferences(preferences) {
    setState({
      ...state,
      preferences: preferences
    });
  }

  function handleLogoutNoRequest() {
    // Clear request interceptor
    if ('requestInterceptor' in state.preferences) {
      // requestInterceptor is used to monitor unauthorized access to the platform
      request.interceptors.response.eject(state.preferences.requestInterceptor);
    }

    getOrganizationFromLocalstorage()
      .then(organization => {
        // clear state to logout
        setState({
          isAuthenticated: false,
          user: {
            role: 'anonymous',
            organization: organization,
          },
          preferences: {},
          getAuthenticatedUserCompleted: true,
        });

        handleChangeThemeColor(organization.themeColor);
      })
      .catch(error => {
        console.log(error);

        setState({
          isAuthenticated: false,
          user: {
            role: 'anonymous',
          },
          preferences: {},
          getAuthenticatedUserCompleted: true,
        });

        handleChangeThemeColor();
      });
  }

  function handleLogout() {
    return new Promise((resolve, reject) => {
      // Clear request interceptor
      if ('requestInterceptor' in state.preferences) {
        // requestInterceptor is used to monitor unauthorized access to the platform
        request.interceptors.response.eject(state.preferences.requestInterceptor);
      }


      // clear state to logout
      let logoutState = () => {

        setTimeout(() => {

          getOrganizationFromLocalstorage()
            .then(organization => {

              setState({
                isAuthenticated: false,
                user: {
                  role: 'anonymous',
                  organization: organization,
                },
                preferences: {},
                getAuthenticatedUserCompleted: true,
              });

              handleChangeThemeColor(organization.themeColor);

            })
            .catch(error => {
              console.log(error);

              setState({
                isAuthenticated: false,
                user: {
                  role: 'anonymous',
                },
                preferences: {},
                getAuthenticatedUserCompleted: true,
              });

              handleChangeThemeColor();

            });

        }, CRUD.delay);

      };//EoFunc

      request
        .post(`${API}auth/logout`)
        .then(() => {
          logoutState();
          resolve('You have been successfully logged out!');
        })
        .catch(error => {
          if (error.response.status === 401) {
            logoutState();
            reject('Unauthorized access!');
            return;
          }
          // generic
          reject('Something went wrong. Please contact the system administrator');
          console.log(error);
        });

    });
  }

  /*function openSocket() {
    WS.setDebug(process.env.NODE_ENV === 'development');
    if (!WS.isConnected()) {
      WS.connect(WS_ENDPOINT);
    }
  }*/

  // RENDER
  if (!state.getAuthenticatedUserCompleted) return '';

  const authProviderValue = {
    ...state,
    handleChangeThemeColor: handleChangeThemeColor,
    handleLogin: handleLogin,
    handleChangeUser: handleChangeUser,
    handleChangeUserPreferences: handleChangeUserPreferences,
    handleLogoutNoRequest: handleLogoutNoRequest,
    handleLogout: handleLogout,
  };

  return (
    <AuthProvider value={authProviderValue}>
      {children}
    </AuthProvider>
  )
}

export default Authenticate;
