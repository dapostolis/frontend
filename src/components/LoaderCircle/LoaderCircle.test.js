import React from 'react';
import ReactDOM from 'react-dom';
import LoaderCircle from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LoaderCircle/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
