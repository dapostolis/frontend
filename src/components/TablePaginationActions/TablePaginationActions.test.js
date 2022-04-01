import React from 'react';
import ReactDOM from 'react-dom';
import TablePaginationActions from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TablePaginationActions/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
