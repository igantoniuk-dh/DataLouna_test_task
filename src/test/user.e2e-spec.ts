/* eslint-disable max-lines-per-function */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    afterAll(() => {});

    const admin = {
        login: process.env.ADMIN_LOGIN,
        password: process.env.ADMIN_PASSWORD,
        hashed: '$1$3LxQ3Myw$DNot1YReyvKsRIsJfxxXh.', //hashed "admin" для ручного добавления в базу при сбое в тесте,
    };

    let adminToken;
    const newPassword = 'admin1';

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

    it('/login (GET) failed', () => {
        return request(app.getHttpServer())
            .post('/user/login')
            .send({
                login: admin.login,
                password: admin.password + '13',
            })
            .expect(404);
    });

    it('/login (GET) failed', () => {
        return request(app.getHttpServer())
            .post('/user/login')
            .send({
                login: admin.login + 'daw',
                password: admin.password,
            })
            .expect(404);
    });

    it('/login (GET) success', () => {
        return request(app.getHttpServer())
            .post('/user/login')
            .send({
                ...admin,
            })
            .expect(200);
    });

    it('/changePassword (GET) failed', () => {
        return request(app.getHttpServer())
            .post('/user/changePassword')
            .send({
                password: admin.password + '123',
                newPassword: admin.password,
            })
            .expect(401);
    });

    it('/changePassword (GET) success', () => {
        return request(app.getHttpServer())
            .post('/user/changePassword')
            .send({
                password: admin.password,
                newPassword,
            })
            .set('Cookie', `user=${adminToken}`)
            .expect(200);
    });

    afterAll(async () => {
        return request(app.getHttpServer())
            .post('/user/changePassword')
            .send({
                password: newPassword,
                newPassword: admin.password,
            })
            .set('Cookie', `user=${adminToken}`)
            .expect(200);
    });
});
