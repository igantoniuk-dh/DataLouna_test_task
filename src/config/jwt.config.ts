import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const config = {
    secret: process.env.JWT_SECRET || 'verystrongsecret',
    ttlInSeconds: parseInt(process.env.JWT_TTL_IN_SECONDS || '3600', 10),
};

export const jwtConfig = registerAs('jwt', () => {
    try {
        const jwtConfigSchema = z.object({
            secret: z.string(),
            ttlInSeconds: z.number(),
        });

        return jwtConfigSchema.parse(config) as z.infer<typeof jwtConfigSchema>;
    } catch (e) {
        console.error(JSON.stringify({ level: 'error', error: 'bad jwt config', e }));
        process.exit(1);
    }
});
