/**
 * Stubbed UPS error responses — realistic error payloads for different HTTP status codes.
 */
export const STUB_UPS_ERROR_400 = {
  response: {
    errors: [
      {
        code: '111210',
        message:
          'The requested service is unavailable between the selected locations.',
      },
    ],
  },
};

export const STUB_UPS_ERROR_401 = {
  response: {
    errors: [
      {
        code: '250003',
        message: 'Invalid Access License number',
      },
    ],
  },
};
