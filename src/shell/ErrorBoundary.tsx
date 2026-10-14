import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
  info: string;
}

/**
 * A blank screen is the worst failure mode for a prototype being reviewed by
 * stakeholders. If anything throws, show the error instead.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: '' };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ info: info.componentStack ?? '' });
    // eslint-disable-next-line no-console
    console.error('[prototype shell]', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0d1117',
          color: '#e6edf3',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 760 }}>
          <h1 style={{ fontSize: 18, margin: 0 }}>The prototype crashed</h1>
          <p style={{ color: '#8b949e', fontSize: 13, marginTop: 6 }}>
            Nothing was lost — reload to restart the shell.
          </p>
          <pre
            style={{
              marginTop: 16,
              padding: 14,
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: 8,
              fontSize: 12,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              color: '#ff7b72',
            }}
          >
            {String(this.state.error?.stack ?? this.state.error)}
          </pre>
          {this.state.info && (
            <pre
              style={{
                marginTop: 10,
                padding: 14,
                background: '#161b22',
                border: '1px solid #30363d',
                borderRadius: 8,
                fontSize: 11,
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                color: '#8b949e',
              }}
            >
              {this.state.info}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 16,
              padding: '10px 16px',
              background: '#00baf2',
              color: '#002970',
              border: 0,
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Reload prototype
          </button>
        </div>
      </div>
    );
  }
}
