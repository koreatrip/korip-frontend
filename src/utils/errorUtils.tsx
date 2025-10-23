import { ERROR_CODES } from '@/constants/errorCodes';

interface ExtendedError extends Error {
  response?: {
    status: number;
  };
}

export const getErrorCode = (error: ExtendedError): string => {
  // 에러 메시지나 타입으로 구분
  if (error.name === 'ChunkLoadError') {
    return ERROR_CODES.CHUNK_LOAD_ERROR;
  }

  if (error.message?.includes('Network')) {
    return ERROR_CODES.NETWORK_ERROR;
  }

  if (
    error.message?.includes('401') ||
    error.message?.includes('Unauthorized')
  ) {
    return ERROR_CODES.AUTH_FAILED;
  }

  if (error.message?.includes('404')) {
    return ERROR_CODES.DATA_NOT_FOUND;
  }

  // API 응답 에러
  if (error.response?.status) {
    switch (error.response.status) {
      case 401:
        return ERROR_CODES.AUTH_FAILED;
      case 404:
        return ERROR_CODES.DATA_NOT_FOUND;
      case 500:
        return ERROR_CODES.RUNTIME_ERROR;
      default:
        return ERROR_CODES.UNKNOWN_ERROR;
    }
  }

  return ERROR_CODES.UNKNOWN_ERROR;
};
