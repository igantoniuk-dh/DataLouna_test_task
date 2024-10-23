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

    it('/list failed', () => {
        return request(app.getHttpServer()).get('/item/list').expect(401);
    });

    it('/list success', async () => {
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('pageSize', '15');
        const response = await request(app.getHttpServer())
            .get(`/item/list?${params.toString()}`)
            .set('Cookie', `user=${adminToken}`);
        expect(response.status).toBe(200);

        expect(response.body.data.length).toBe(15);
    });
});
