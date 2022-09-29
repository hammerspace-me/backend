import { ApiProperty } from '@nestjs/swagger';

export const SourceApiProperty = () => {
  return ApiProperty({
    description:
      'Creator / technology provider of the underlying asset (e.g., avatar providers like `ready-player-me`).',
  });
};
