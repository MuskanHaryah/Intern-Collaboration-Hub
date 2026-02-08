import { Component } from 'react';
import { ErrorBoundaryFallback } from './ErrorStates';

/**
 * ErrorBoundary - React component that catches JavaScript errors anywhere in the child component tree
 * Logs those errors and displays a fallback UI instead of crashing the whole app
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('❌ [ErrorBoundary] Caught error:', error);
    console.error('📍 [ErrorBoundary] Error info:', errorInfo);
    
    // Update state with error details
    this.setState({
      error,
      errorInfo
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          resetErrorBoundary: this.resetErrorBoundary,
        });
      }

      // Default fallback UI
      return (
        <ErrorBoundaryFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
          title={this.props.title}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * withErrorBoundary - HOC to wrap components with error boundary
 * Usage: export default withErrorBoundary(MyComponent);
 */
export function withErrorBoundary(Component, fallbackProps = {}) {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...fallbackProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}

export default ErrorBoundary;
