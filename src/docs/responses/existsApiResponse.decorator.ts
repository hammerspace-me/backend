import { ApiResponse } from '@nestjs/swagger';

export const BackpackExistsApiResponse = () => {
  return ApiResponse({
    status: 409,
    description: 'Backpack already exists.',
  });
};

export const BackpackItemExistsApiResponse = () => {
  return ApiResponse({
    status: 409,
    description: 'Backpack item already exists.',
  });
};
