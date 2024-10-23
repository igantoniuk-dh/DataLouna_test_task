import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { z } from 'zod';
import * as path from 'path';

const config = {
    ssl: process.env.TLS_CA_PATH,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    type: 'postgres',
    migrations: [getMigrationsPath()],
};

function getMigrationsPath() {
    return path.resolve(__dirname, '..', 'migrations/*.ts');
}

export const typeormConfig = registerAs('typeorm', () => {
    try {
        const typeormConfigSchema = z.object({
            host: z.string(),
            port: z.string(),
            username: z.string(),
            password: z.string(),
            database: z.string(),
            ssl: z.string().optional(),
            type: z.enum(['postgres']),
            migrations: z.array(z.string()),
        });

        return typeormConfigSchema.parse(config) as z.infer<typeof typeormConfigSchema>;
    } catch (e) {
        console.error(JSON.stringify({ level: 'error', error: 'bad typeorm config', e }));
        process.exit(1);
    }
});

export const connectionSource = new DataSource(config as DataSourceOptions);
