import * as dotenv from 'dotenv';
dotenv.config();

import { typeormConfig, connectionSource as TypeormDataSourceForMigrations } from './typeorm.config';

import { redisConfig } from './redis.config';

import { adminConfig } from './admin.config';

const configs = [redisConfig, typeormConfig, adminConfig];

export default configs;

// пляски с бубном, чтобы нормально работали миграции typeorm
export const connectionSource = TypeormDataSourceForMigrations;

export const defAdminCredentialsConfig = adminConfig;
