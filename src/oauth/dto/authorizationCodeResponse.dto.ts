export class AuthorizationCodeResponseDto {
  constructor(code: string, state?: string) {
    this.code = code;
    this.state = state;
  }

  code: string;
  state?: string;
}
