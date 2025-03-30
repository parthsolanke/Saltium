export const handleApiError = (error) => {
  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return {
      message: 'Request timed out. Please try again.',
      shouldRedirect: false
    };
  }

  // Handle direct error objects (client-side errors, validation errors, etc.)
  if (error.message && !error.response && !error.request) {
    return {
      message: error.message,
      shouldRedirect: error.shouldRedirect || false,
      redirectTo: error.redirectTo
    };
  }

  // Handle API responses
  if (error.response) {
    const { data, status } = error.response;
    
    // Authentication errors
    if (status === 401) {
      localStorage.removeItem('token');
      return {
        message: data.message || 'Your session has expired. Please log in again.',
        shouldRedirect: true,
        redirectTo: '/login'
      };
    }

    // Handle Multer errors (400 status)
    if (status === 400 && data.message?.includes('Multer error')) {
      return {
        message: data.message.replace('Multer error: ', ''),
        shouldRedirect: false
      };
    }

    // Handle specific Multer cases
    if (status === 400) {
      const message = data.message;
      if (message?.includes('Too many files uploaded') || 
          message?.includes('Unexpected file field') ||
          message?.includes('No files uploaded')) {
        return {
          message: data.message,
          shouldRedirect: false
        };
      }
    }

    // Validation errors (Zod errors from backend)
    if (status === 400 && data.message?.length > 0) {
      if (Array.isArray(data.message)) {
        return {
          message: data.message.map(err => err.message).join(', '),
          shouldRedirect: false
        };
      }
      return {
        message: data.message,
        shouldRedirect: false
      };
    }

    // File-related errors
    if (status === 404) {
      return {
        message: data.message || 'Requested resource not found',
        shouldRedirect: false
      };
    }

    // Storage/upload errors
    if (status === 413) {
      return {
        message: data.message || 'File size exceeds the allowed limit',
        shouldRedirect: false
      };
    }

    // Server errors
    if (status >= 500) {
      return {
        message: 'Server error occurred. Please try again later.',
        shouldRedirect: false
      };
    }

    return {
      message: data.message || 'An unexpected error occurred',
      shouldRedirect: false
    };
  }

  // Handle network errors
  if (error.request) {
    return {
      message: 'Unable to connect to server. Please check your connection.',
      shouldRedirect: false
    };
  }

  // Fallback for unknown error types
  return {
    message: error?.toString() || 'An unexpected error occurred',
    shouldRedirect: false
  };
};

export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (Array.isArray(error)) return error.join(', ');
  if (error.message) return error.message;
  return 'An unexpected error occurred';
};
