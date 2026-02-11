import { SetMetadata } from '@nestjs/common';

// This decorator will mark routes as "public" (no authentication needed)
export const Public = () => SetMetadata('isPublic', true);
