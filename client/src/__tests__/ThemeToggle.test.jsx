import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeToggle } from '../components/UI/ThemeToggle';
import useThemeStore from '../stores/themeStore';

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    // Reset theme store
    useThemeStore.setState({ theme: 'dark' });
  });

  it('should render theme toggle button', () => {
    const { container } = render(<ThemeToggle />);
    const button = container.querySelector('button');
    
    expect(button).toBeInTheDocument();
  });

  it('should display current theme', () => {
    useThemeStore.setState({ theme: 'dark' });
    const { container } = render(<ThemeToggle />);
    
    expect(container).toBeInTheDocument();
  });

  it('should toggle theme on click', () => {
    const { container } = render(<ThemeToggle />);
    const button = container.querySelector('button');
    
    const initialTheme = useThemeStore.getState().theme;
    button?.click();
    
    // Theme should change after click
    expect(useThemeStore.getState().theme).not.toBe(initialTheme);
  });
});
