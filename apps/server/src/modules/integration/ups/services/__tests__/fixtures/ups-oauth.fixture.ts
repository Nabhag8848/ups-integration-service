/**
 * Stubbed OAuth token response — looks exactly like what UPS returns
 * when you POST to their /security/v1/oauth/token endpoint.
 */
export const STUB_OAUTH_TOKEN_RESPONSE = {
  token_type: 'Bearer',
  issued_at: '1719331477552',
  client_id: 'test-client-id',
  access_token: 'eyJhbGciOiJSUzM4NCIsInR5cCI6Ikp..._FAKE_TOKEN',
  scope: 'public',
  expires_in: '14399',
  refresh_count: '0',
  status: 'approved',
};
