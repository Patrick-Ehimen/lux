/**
 * Helper for API error handling
 * @param {Error} error - Error object
 * @returns {Object} Standardized error response
 */
export const handleApiError = (error: any) => {
  console.error("API Error:", error);

  // Network error
  if (!error.response) {
    return {
      message: "Network error, please check your connection",
      status: "error",
      code: "NETWORK_ERROR",
    };
  }

  // API error with response
  const status = error.response.status;

  if (status === 401 || status === 403) {
    return {
      message: "Authentication error, please check your API key",
      status: "error",
      code: "AUTH_ERROR",
    };
  }

  if (status === 429) {
    return {
      message: "Rate limit exceeded, please try again later",
      status: "error",
      code: "RATE_LIMIT",
    };
  }

  // Default error
  return {
    message: error.response.data?.message || "Something went wrong",
    status: "error",
    code: `ERROR_${status}`,
  };
};
