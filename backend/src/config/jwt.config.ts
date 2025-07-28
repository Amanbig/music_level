import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  jwtSecret: process.env.JWT_SECRET || 'defaultSecretKey',
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME || '1h',
  jwtRefreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME || '7d',
}));