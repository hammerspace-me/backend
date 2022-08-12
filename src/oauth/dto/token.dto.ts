export class TokenDto {
  constructor(
    tokenType: string,
    accessToken: string,
    expiresIn: number,
    refreshToken: string,
  ) {
    this.tokenType = tokenType;
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;
    this.refreshToken = refreshToken;
  }

  expiresIn: number;
  tokenType: string;
  accessToken: string;
  refreshToken: string;
}

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
