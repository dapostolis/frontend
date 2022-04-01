/**
 * WebSockets/Stomp wrapper
 */

import Stomp from 'stompjs';
// import SockJS from "sockjs-client";


let client = {},        // stomp object
  topics = [],        // topics Array
  reconnect = true,   // reconnect when socket lose its connection
  debug = false;


const WS = {

  /*
   * Set debug for stomp protocol debugging messages
   *
   * @param {boolean} hasDebug - The topics you would like to subscribe
   */
  setDebug: function (d) {
    debug = d;
  },


  /*
   * Use this method to connect.
   *
   * @param {Array} topics - The topics you would like to subscribe
   * @param {function} reconCallback - Execute a function after a reconnection is requested
   */
  connect: function (endpoint, onConnectCallback, reconCallback) {
    if (endpoint === undefined) {
      throw new TypeError("You need to set an endpoint uri and at least one topic like [{ url: 'topic_url', call: function }]. Use setTopics() method.");
    }
    // init socket
    var sockjs = new WebSocket(endpoint);
    // var sockjs = new SockJS(endpoint);

    client = Stomp.over(sockjs);

    if (!debug) {
      client.debug = null;
    }

    client.connect({}, function (frame) {
      if (client.debug) {
        console.log('WebSocket connection established: ' + frame);
      }

      if (typeof onConnectCallback === 'function') onConnectCallback();

    }, function () {
      if (!reconnect) {
        console.log("WebSocket closed");
        return;
      }//else
      // TODO - reconnection counter property
      if (client.debug) console.warn("WebSocket closed. Try to reconnect");
      setTimeout(function () {
        WS.connect(endpoint, onConnectCallback);
      }, 2000);
    });
  },

  disconnect: function () {
    client.disconnect(function () {
      if (client.debug) console.log("Successfully disconnected from WebSocket");
    });
  },

  isConnected: function () {
    if ('connected' in client) return client.connected;
  },


  subscribe: function (topic) {
    if (typeof topic === 'undefined' || (typeof topic !== 'object' && !(('url' in topic) || ('call' in topic)))) {
      throw new TypeError("You have to pass a topic argument that must be an object like { url: 'topic_url', call: function }");
    }

    if (WS.isSubscribed(topic.id)) {
      console.warn("Already subscribed to topic: " + topic.id);
      return false;
    }

    let tid = client.subscribe(topic.url, topic.call).id;
    topic.tid = tid;
    topics.push(topic);

    return tid;
  },

  unsubscribe: function (id) {
    // TODO - need optimization
    var topic = topics.filter(function (obj) {
      return obj.id === id;
    });

    var index = topics.map(function (obj) {
      return obj.id;
    }).indexOf(id);
    topics.splice(index, 1);

    if (topic.length === 1) {
      // pop out from topics array
      client.unsubscribe(topic[0].tid); // todo - check if client.unsubscribe returns anything
    } else {
      if (client.debug) console.warn("Couldn't find topic with id: " + id);
      return false;
    }
  },

  isSubscribed: function (id) {
    var topic = topics.filter(function (obj) {
      return obj.id === id;
    });
    return topic.length === 1 ? true : false;
  },

  unsubscribeAll: function () {
    var i;

    for (i in topics) {
      client.unsubscribe(topics[i].tid);
    }

    topics = [];
  },


  setReconnect: function (r) {
    reconnect = r;
  }

};

export default WS;