import {createContext} from "react";

const authContext = createContext({
  isAuthenticated: false, // to check if authenticated or not
  user: {}, // store all the user details
  preferences: {}, // store user's preferences
  handleChangeThemeColor: () => {}, // to change secondary main color
  handleLogin: () => {}, // to start the login process
  handleChangeUser: () => {}, // change user object values (example usage on profile/account page)
  handleChangeUserPreferences: () => {}, // store all user preferences (general purpose property)
  handleLogoutNoRequest: () => {}, // reset AuthContext state without calling logout REST endpoint
  handleLogout: () => {} // logout the user
});

export const AuthProvider = authContext.Provider;
export const AuthConsumer = authContext.Consumer;
