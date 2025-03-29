export const handleApiError = (error) => {
  if (error.response) {
    const { data, status } = error.response;
    
    if (status === 401) {
      localStorage.removeItem('token');
      return {
        message: 'Your session has expired. Please log in again.',
        shouldRedirect: true,
        redirectTo: '/login'
      };
    }

    return {
      message: data.message || 'An unexpected error occurred',
      shouldRedirect: false
    };
  }
  
  return {
    message: 'Unable to connect to server. Please check your connection.',
    shouldRedirect: false
  };
};
