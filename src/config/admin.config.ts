import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const config = {
    login: process.env.ADMIN_LOGIN || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin',
    balance: parseFloat(process.env.ADMIN_BALANCE) || 5000000,
};

export const adminConfig = registerAs('admin', () => {
    try {
        const adminConfigSchema = z.object({
            login: z.string(),
            password: z.string(),
            balance: z.number(),
        });

        return adminConfigSchema.parse(config) as z.infer<typeof adminConfigSchema>;
    } catch (e) {
        console.error(JSON.stringify({ level: 'error', error: 'bad admin config', e }));
        process.exit(1);
    }
});
