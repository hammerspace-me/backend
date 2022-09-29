import { ApiResponse } from '@nestjs/swagger';

export const ServerErrorApiResponse = () => {
  return ApiResponse({
    status: 500,
    description: 'Unexpected internal server error.',
  });
};
