import React from 'react';
import ReactDOM from 'react-dom';
import PrivateMarketTeasers from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PrivateMarketTeasers/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
