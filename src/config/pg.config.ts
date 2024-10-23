import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const pgConfig = registerAs('pg', () => {
    try {
        const pgConfigSchema = z.object({
            host: z.string(),
            port: z.number(),
            user: z.string(),
            password: z.string(),
            database: z.string(),
            ssl: z.string().optional(),
        });

        return pgConfigSchema.parse({
            ssl: process.env.TLS_CA_PATH,
            host: process.env.PG_HOST,
            port: parseInt(process.env.PG_PORT || ''),
            user: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            database: process.env.PG_DATABASE,
        }) as z.infer<typeof pgConfigSchema>;
    } catch (e) {
        console.error(JSON.stringify({ level: 'error', error: 'bad pg config', e }));
        process.exit(1);
    }
});
