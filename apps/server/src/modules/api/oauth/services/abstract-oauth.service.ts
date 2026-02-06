import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class AbstractOAuthService {
  /**
   * Integration name (e.g., 'ups', 'fedex', 'usps')
   */
  abstract readonly name: string;

  /**
   * Get the client credentials endpoint URL
   * This should be implemented by each integration
   * @returns The client credentials endpoint URL
   */
  protected abstract getClientCredentialsEndpoint(): string | Promise<string>;

  /**
   * This should be implemented by each integration
   * This will be used to exchange the credentials for a token
   * @returns The access token
   */
  protected abstract exchangeCredentialsForToken(): Promise<string>;

  /**
   * This should be implemented by each integration
   * This will be used to listen for token expiry and refresh the token
   */
  protected abstract listenForTokenExpiry(): Promise<void>;

  /**
   * This should be implemented by each integration
   * This will be used to get the carrier's access token
   * @returns The carrier's access token
   */
  protected abstract getAccessToken(): Promise<string>;

  /**
   * This should be implemented by each integration
   * This will be used to set the carrier's access token with expiry in redis
   * The key will be the carrier's provider and client id
   * @param accessToken - The carrier's access token
   * @param expiry - The expiry date of the access token
   */
  protected abstract setAccessTokenWithExpiry(
    refreshToken: string,
    expiry: Date
  ): Promise<void>;
}
