import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class AbstractOAuthService<T> {
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
  protected abstract exchangeCredentialsForToken(): Promise<T>;

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
}
