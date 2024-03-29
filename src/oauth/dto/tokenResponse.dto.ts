export class TokenResponseDto {
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
