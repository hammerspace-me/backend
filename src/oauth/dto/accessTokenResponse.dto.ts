export class AccessTokenResponseDto {
  constructor(
    tokenType: string,
    accessToken: string,
    expiresIn: number,
    state?: string,
  ) {
    this.tokenType = tokenType;
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;
    this.state = state;
  }

  expiresIn: number;
  tokenType: string;
  accessToken: string;
  state?: string;
}
