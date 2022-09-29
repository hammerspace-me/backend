import { ApiResponse } from '@nestjs/swagger';

export const UnauthorizedApiResponse = () => {
  return ApiResponse({
    status: 401,
    description: 'Unauthorized due to wrong credentials.',
  });
};
