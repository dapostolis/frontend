import React from 'react';
import ReactDOM from 'react-dom';
import ModulesPage from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ModulesPage/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
