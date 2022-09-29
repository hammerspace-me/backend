import { ApiProperty } from '@nestjs/swagger';

export const MetadataApiProperty = () => {
  return ApiProperty({
    description:
      'Arbitriary metadata used for interpretation of assets by the metaverses',
  });
};
