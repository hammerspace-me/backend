import { ApiResponse } from '@nestjs/swagger';

export const ValidationFailedApiResponse = () => {
  return ApiResponse({
    status: 400,
    description: 'Validation of input data failed.',
  });
};
