// components/common/ErrorBoundary.tsx
import { ERROR_CODES } from '@/constants/errorCodes';
import type { AxiosError } from 'axios';
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
    const status = (error as AxiosError).response?.status;

    switch (status) {
      case 400:
        return ERROR_CODES.INVALID_DATA;
      case 401:
        return ERROR_CODES.AUTH_FAILED;
      case 403:
        return ERROR_CODES.AUTH_FAILED;
      case 404:
        return ERROR_CODES.DATA_NOT_FOUND;
      case 500:
        return ERROR_CODES.RUNTIME_ERROR;
      default:
        break;
    }

    // 상태코드 없으면 메시지로 추측
    if (error.message?.includes('timeout')) return ERROR_CODES.API_TIMEOUT;
    if (error.message?.includes('Network')) return ERROR_CODES.NETWORK_ERROR;

    return ERROR_CODES.UNKNOWN_ERROR;
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
