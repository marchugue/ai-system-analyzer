import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
          <span className="section-tag mb-2">Something Went Wrong</span>
          <h2 className="font-display text-2xl font-semibold text-ink dark:text-text-dark">
            The page hit an unexpected error
          </h2>
          <p className="mt-2 max-w-md text-sm text-text-soft dark:text-text-dark-soft">
            {this.state.message || 'Please refresh the page. Your questionnaire answers were auto-saved.'}
          </p>
          <button className="btn-primary mt-5" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
