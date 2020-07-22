import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Footer from './Footer';
 
let container;
 
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});
 
afterEach(() => {
  document.body.removeChild(container);
  container = null;
});
 
it('should render © 2020 Copyright: Piyush Aggarwal as text', () => {
  act(() => {
    ReactDOM.render(<Footer />, container);
  });
  const labelTag = container.querySelector('.footer-copyright');
  expect(labelTag.textContent).toBe('© 2020 Copyright: Piyush Aggarwal');
});