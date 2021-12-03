import { render, screen } from '@testing-library/react';
import RoverComponent from './RoverComponent';

test('renders learn react link', () => {
  render(<RoverComponent />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
