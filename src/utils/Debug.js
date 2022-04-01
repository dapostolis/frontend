/**
 * Debug Component
 *
 * It prints a structured object
 */

import React from 'react';

const Debug = (props) => (
  <pre
    style={{
      fontSize: '14px',
      color: 'lightgreen',
      padding: '10px',
      backgroundColor: 'black',
      marginBottom: '40px'
    }}
  >
    <strong>DEBUG</strong><hr/><br/>{JSON.stringify(props.object, null, 4)}
  </pre>
)


export default Debug;