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

export const ApplicationExistsApiResponse = () => {
  return ApiResponse({
    status: 409,
    description: 'Application already exists.',
  });
};
