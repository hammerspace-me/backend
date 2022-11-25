import { ApiResponse } from '@nestjs/swagger';
import { EndpointMethod } from './endpointMethod.enum';

export const SpaceSuccessApiResponse = (method: EndpointMethod) => {
  return ApiResponse({
    status: method === EndpointMethod.CREATE ? 201 : 200,
    description: 'Space has been successfully ' + method + '.',
  });
};

export const ItemSuccessApiResponse = (method: EndpointMethod) => {
  return ApiResponse({
    status: method === EndpointMethod.CREATE ? 201 : 200,
    description: 'Item has been successfully ' + method + '.',
  });
};

export const LoginSuccessApiResponse = () => {
  return ApiResponse({
    status: 201,
    description: 'User has been successfully logged in.',
  });
};

export const NonceSuccessApiResponse = () => {
  return ApiResponse({
    status: 201,
    description: 'Nonce has been successfully created.',
  });
};

export const AuthorizationRequestSuccessApiResponse = (
  method: EndpointMethod,
) => {
  return ApiResponse({
    status: method === EndpointMethod.CREATE ? 201 : 200,
    description:
      method === EndpointMethod.UPDATE
        ? 'Authorization request has been successfully confirmed.'
        : 'Authorization request has been successfully ' + method + '.',
  });
};

export const TokenSuccessApiResponse = () => {
  return ApiResponse({
    status: 201,
    description: 'Token has been successfully created.',
  });
};

export const ActivationRequestSuccessApiResponse = (method: EndpointMethod) => {
  return ApiResponse({
    status: method === EndpointMethod.CREATE ? 201 : 200,
    description: 'Activation request has been successfully ' + method + '.',
  });
};

export const ApplicationSuccessApiResponse = (method: EndpointMethod) => {
  return ApiResponse({
    status: method === EndpointMethod.CREATE ? 201 : 200,
    description: 'Application has been successfully ' + method + '.',
  });
};
