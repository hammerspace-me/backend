import { ApiResponse } from '@nestjs/swagger';

export const SpaceExistsApiResponse = () => {
  return ApiResponse({
    status: 409,
    description: 'Space already exists.',
  });
};

export const ItemExistsApiResponse = () => {
  return ApiResponse({
    status: 409,
    description: 'Item already exists.',
  });
};

export const ApplicationExistsApiResponse = () => {
  return ApiResponse({
    status: 409,
    description: 'Application already exists.',
  });
};
