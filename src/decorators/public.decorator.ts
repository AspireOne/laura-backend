import { SetMetadata } from '@nestjs/common';

/**
 * Key used to mark routes as public.
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Custom decorator to mark a route as public, bypassing the API key guard.
 * 
 * @returns {CustomDecorator<string>} - The metadata to mark the route as public.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
