// components/common/ErrorBoundary.tsx
import { Component, lazy, type ErrorInfo, type ReactNode } from 'react';

const ErrorPage = lazy(() => import('@/pages/statusPage/errorPage'));

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);

    // 에러 정보 저장
    this.setState({
      error,
      errorInfo,
    });
  }

  private getErrorCode(error: Error): string {
    if (error.name === 'ChunkLoadError') return 'KR-CHUNK-001';
    if (error.message?.includes('Network')) return 'KR-NET-001';
    if (error.message?.includes('Cannot read')) return 'KR-RUNTIME-001';
    if (error.message?.includes('undefined')) return 'KR-RUNTIME-002';
    return 'KR-500-TRAVEL';
  }

  private resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      // fallback이 제공되면 사용, 아니면 ErrorPage 사용
      return (
        this.props.fallback || (
          <ErrorPage
            error={this.state.error}
            errorCode={this.getErrorCode(this.state.error!)}
            resetError={this.resetError}
          />
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
