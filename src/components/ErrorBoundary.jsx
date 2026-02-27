import { Component } from 'react';

/**
 * ErrorBoundary — Catches unhandled rendering errors in the React component tree.
 * Without this, a single component crash would show a blank white screen.
 * This provides a graceful fallback UI and logs the error for debugging.
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReload = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '2rem',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    background: '#0f172a',
                    color: '#e2e8f0',
                    textAlign: 'center',
                }}>
                    <div style={{
                        fontSize: '4rem',
                        marginBottom: '1rem',
                    }}>
                        ⚠️
                    </div>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem',
                        color: '#f8fafc',
                    }}>
                        Something went wrong
                    </h1>
                    <p style={{
                        fontSize: '1rem',
                        color: '#94a3b8',
                        marginBottom: '1.5rem',
                        maxWidth: '400px',
                    }}>
                        An unexpected error occurred. Please try refreshing the page.
                    </p>
                    <button
                        onClick={this.handleReload}
                        style={{
                            padding: '0.75rem 2rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#0f172a',
                            background: '#38bdf8',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                        }}
                        onMouseOver={(e) => e.target.style.background = '#7dd3fc'}
                        onMouseOut={(e) => e.target.style.background = '#38bdf8'}
                    >
                        Go to Homepage
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
