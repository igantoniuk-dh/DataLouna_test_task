/* eslint-disable max-lines-per-function */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
describe('AppController (e2e)', () => {
    let app: INestApplication;

    afterAll(() => {});
    let adminToken;
    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.use(cookieParser());
        await app.init();
        adminToken = await request(app.getHttpServer())
            .get('/user/test-user-token')
            .then(res => res.body?.data[0]);
    });

    it('/purchase failed', () => {
        return request(app.getHttpServer()).post('/purchase').expect(401);
    });

    it('/purchase success', async () => {
        const item = await getItem();
        const response = await request(app.getHttpServer())
            .post(`/purchase`)
            .send({ itemId: item.id })
            .set('Cookie', `user=${adminToken}`);

        expect(response.status).toBe(200);

        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].newBalance).toBeDefined();
    });

    async function getItem() {
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('pageSize', '15');
        const response = await request(app.getHttpServer())
            .get(`/item/list?${params.toString()}`)
            .set('Cookie', `user=${adminToken}`);
        return response.body.data[0];
    }
});
