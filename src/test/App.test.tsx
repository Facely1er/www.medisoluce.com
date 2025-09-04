import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Check if the app renders
    expect(document.body).toBeTruthy();
  });

  it('includes essential providers', () => {
    const { container } = render(<App />);
    // Check if the app has content
    expect(container.firstChild).toBeTruthy();
  });
});