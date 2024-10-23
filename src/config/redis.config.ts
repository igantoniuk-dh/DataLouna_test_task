import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export const redisConfig = registerAs('redis', () => {
    try {
        const redisConfigSchema = z.object({
            host: z.string(),
            port: z.number(),
            password: z.string(),
            tls: z
                .object({
                    ca: z.string().optional(),
                })
                .optional(),
            db: z.number(),
        });

        return redisConfigSchema.parse({
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PASSWORD,
            port: parseInt(process.env.REDIS_PORT || ''),
            db: parseInt(process.env.REDIS_DB || ''),

            tls: {
                ca: process.env.TLS_CA_PATH,
            },
        }) as z.infer<typeof redisConfigSchema>;
    } catch (e) {
        console.error(JSON.stringify({ level: 'error', error: 'bad redis config', e }));
        process.exit(1);
    }
});
