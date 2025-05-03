import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to display the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error tracking service or console
    console.error('Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI when error occurs
      return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h1>Something went wrong.</h1>
          <p>We are working on fixing the issue. Please try again later.</p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '10px 20px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
            }}
          >
            Go Home
          </button>
        </div>
      );
    }

    return this.props.children; // Render children if no error
  }
}

export default ErrorBoundary;
