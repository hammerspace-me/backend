import { ApiProperty } from '@nestjs/swagger';

export const CategoryApiProperty = () => {
  return ApiProperty({
    description:
      'Category or module of the underlying asset (e.g., avatar, nft)',
  });
};
