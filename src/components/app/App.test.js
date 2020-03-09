import React from 'react';
import { render } from '@testing-library/react';
import { strings } from './App.strings';
import App from './App';

test('renders loader', () => {
  const { getByText } = render(<App />);
  const loaderElement = getByText(strings.LOADING);
  expect(loaderElement).toBeInTheDocument();
});
