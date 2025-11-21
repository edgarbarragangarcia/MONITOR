import React from 'react';

type Props = { children: React.ReactNode };

type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
  declare props: Props;
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {}

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
          <div style={{ background: 'white', padding: 16, borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Se produjo un error</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Intenta recargar la página.</div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}