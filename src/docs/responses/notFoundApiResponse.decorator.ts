import { ApiResponse } from '@nestjs/swagger';

export const SpaceNotFoundApiResponse = () => {
  return ApiResponse({
    status: 404,
    description: 'Space could not be found.',
  });
};

export const ItemNotFoundApiResponse = () => {
  return ApiResponse({
    status: 404,
    description: 'Item could not be found.',
  });
};

export const ApplicationNotFoundApiResponse = () => {
  return ApiResponse({
    status: 404,
    description: 'Application could not be found.',
  });
};

export const ActivationRequestNotFoundApiResponse = () => {
  return ApiResponse({
    status: 404,
    description: 'Activation request could not be found.',
  });
};

export const AuthorizationRequestNotFoundApiResponse = () => {
  return ApiResponse({
    status: 404,
    description: 'Authorization request could not be found.',
  });
};
