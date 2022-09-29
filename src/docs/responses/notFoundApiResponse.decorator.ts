import { ApiResponse } from '@nestjs/swagger';

export const BackpackNotFoundApiResponse = () => {
  return ApiResponse({
    status: 404,
    description: 'Backpack could not be found.',
  });
};

export const BackpackItemNotFoundApiResponse = () => {
  return ApiResponse({
    status: 404,
    description: 'Backpack item could not be found.',
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
