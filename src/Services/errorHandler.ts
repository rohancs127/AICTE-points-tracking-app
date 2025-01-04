export const handleError = (error: string): string => {
    // Map error codes/messages to user-friendly messages
    switch (error) {
      case 'Invalid login credentials':
        return 'The email or password is incorrect.';
      case 'Network error':
        return 'Unable to connect. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };
  