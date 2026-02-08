import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner, LoadingOverlay, Skeleton } from '../components/UI/LoadingStates';

describe('LoadingStates', () => {
  describe('LoadingSpinner', () => {
    it('should render with default size and color', () => {
      const { container } = render(<LoadingSpinner />);
      const spinner = container.querySelector('div');
      
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('w-8', 'h-8', 'border-purple-500/30');
    });

    it('should render with custom size', () => {
      const { container } = render(<LoadingSpinner size="lg" />);
      const spinner = container.querySelector('div');
      
      expect(spinner).toHaveClass('w-12', 'h-12');
    });

    it('should render with custom color', () => {
      const { container } = render(<LoadingSpinner color="cyan" />);
      const spinner = container.querySelector('div');
      
      expect(spinner).toHaveClass('border-cyan-500/30', 'border-t-cyan-500');
    });

    it('should apply custom className', () => {
      const { container } = render(<LoadingSpinner className="custom-class" />);
      const spinner = container.querySelector('div');
      
      expect(spinner).toHaveClass('custom-class');
    });
  });

  describe('LoadingOverlay', () => {
    it('should render with default message', () => {
      render(<LoadingOverlay />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render with custom message', () => {
      render(<LoadingOverlay message="Please wait..." />);
      
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });

    it('should render without message when message is null', () => {
      render(<LoadingOverlay message={null} />);
      
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('should apply fullScreen class when fullScreen is true', () => {
      const { container } = render(<LoadingOverlay fullScreen={true} />);
      const overlay = container.firstChild;
      
      expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50');
    });

    it('should apply relative positioning when fullScreen is false', () => {
      const { container } = render(<LoadingOverlay fullScreen={false} />);
      const overlay = container.firstChild;
      
      expect(overlay).toHaveClass('absolute', 'inset-0');
    });
  });

  describe('Skeleton', () => {
    it('should render single skeleton by default', () => {
      const { container } = render(<Skeleton />);
      const skeletons = container.querySelectorAll('.animate-pulse');
      
      expect(skeletons).toHaveLength(1);
    });

    it('should render multiple skeletons when count is specified', () => {
      const { container } = render(<Skeleton count={3} />);
      const skeletons = container.querySelectorAll('.animate-pulse');
      
      expect(skeletons).toHaveLength(3);
    });

    it('should apply text variant by default', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('.animate-pulse');
      
      expect(skeleton).toHaveClass('h-4', 'rounded');
    });

    it('should apply circle variant', () => {
      const { container } = render(<Skeleton variant="circle" />);
      const skeleton = container.querySelector('.animate-pulse');
      
      expect(skeleton).toHaveClass('rounded-full');
    });

    it('should apply custom width and height', () => {
      const { container } = render(<Skeleton width="200px" height="50px" />);
      const skeleton = container.querySelector('.animate-pulse');
      
      expect(skeleton).toHaveStyle({ width: '200px', height: '50px' });
    });
  });
});
