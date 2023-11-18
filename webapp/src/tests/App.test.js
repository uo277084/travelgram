import { render } from '@testing-library/react';
import App from '../App';
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
}));

test('renders app', () => {
  render(<App />);
});
