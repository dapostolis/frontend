/**
 * Configuration object that contains project's variables
 */


// todo - get this value from backend
export const PROJECT_NAME = process.env.REACT_APP_NAME ? process.env.REACT_APP_NAME : 'αlchemist';

export const API = 'http://192.168.122.242:8080/api/v1/';

export const CRUD = {
  delay: 600 // in ms
};

export const U2F_TIMEOUT = 60000;

/**
 * Define WebSocket
 */
let WS_PROTOCOL = window.location.protocol === 'https:' ? 'wss' : 'ws';
export const WS_ENDPOINT = process.env.NODE_ENV === 'development'
  ? `${WS_PROTOCOL}://${window.location.hostname}:8080/stomp`
  : `${WS_PROTOCOL}://${window.location.hostname}/stomp`;
