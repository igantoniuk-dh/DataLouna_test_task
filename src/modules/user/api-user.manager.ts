import * as _ from 'lodash';
import { ShopApiResponse } from 'src/interfaces/ShopApiResponse';
import { User } from 'src/interfaces/User';
import { DataSource, QueryRunner } from 'typeorm';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { LoginDto } from './dto/login.dto';
import { UserNotFoundException } from './exceptions/UserNotFoundException';
export class ApiUserManager {
    constructor(private readonly datasource: DataSource) {}

    async updateBalance(opts: { userId: string; newBalance: number; qrunner?: QueryRunner }) {
        const runner = opts.qrunner || this.datasource.createQueryRunner();
        if (!opts.qrunner) {
            await runner.connect();
        }
        try {
            const qRyAndParams = this.datasource
                .createQueryBuilder()
                .update('users')
                .set({ balance: opts.newBalance })
                .where('id = :id', { id: opts.userId })
                .returning('*')
                .getQueryAndParameters();

            return runner.query(qRyAndParams[0], qRyAndParams[1]);
        } finally {
            if (!opts.qrunner) {
                await runner.release();
            }
        }
    }

    async getById(opts: { userId: string; qrunner?: QueryRunner }) {
        const { userId, qrunner } = opts;
        const runner = qrunner || this.datasource.createQueryRunner();
        if (!qrunner) {
            await runner.connect();
        }
        try {
            const qRyAndParams = this.datasource
                .createQueryBuilder()
                .select('*')
                .from('users', 'u')
                .where('u.id = :id', { id: userId })
                .limit(1)
                .getQueryAndParameters();

            const users = await runner.query(qRyAndParams[0], qRyAndParams[1]);

            const user = users?.at(0);

            if (!user) throw new UserNotFoundException();

            return user;
        } finally {
            if (!opts.qrunner) {
                await runner.release();
            }
        }
    }

    async login(opts: LoginDto): Promise<ShopApiResponse<User>> {
        const runner = this.datasource.createQueryRunner();
        await runner.connect();
        try {
            const [loginQuery, loginParams] = this.createCheckUserQuery(opts);

            const users = await runner.query(loginQuery, loginParams);

            const user = users?.at(0);

            if (!user) throw new UserNotFoundException(opts);

            const lastLoginAt = new Date().toISOString();

            const [updateLastLogingQuery, updateLastLogingParams] = this.createLastLoginAtReq({
                userId: user.id,
                lastLoginAt,
            });

            await runner.query(updateLastLogingQuery, updateLastLogingParams);

            const transormedUser = this.transformUser({
                ...user,
                last_login_at: lastLoginAt,
            });
            return {
                message: 'LOGIN_SUCCESS',
                ok: true,
                code: 200,
                data: [transormedUser],
            };
        } finally {
            await runner.release();
        }
    }

    private createCheckUserQuery(opts: { login: string; password: string }): [string, unknown[]] {
        return this.datasource
            .createQueryBuilder()
            .select('*')
            .from('users', 'u')
            .where('u.login = :login', { login: opts.login })
            .andWhere(`password = crypt(:password, password)`, {
                password: opts.password,
            })
            .limit(1)
            .getQueryAndParameters();
    }

    private createLastLoginAtReq(opts: { userId: string; lastLoginAt: string }): [string, unknown[]] {
        const { lastLoginAt, userId } = opts;
        return this.datasource
            .createQueryBuilder()
            .update('users')
            .set({ last_login_at: lastLoginAt })
            .where('id = :id', { id: userId })
            .returning('*')
            .getQueryAndParameters();
    }

    private transformUser(user: unknown) {
        const safetyUser = _.omit(user, ['password']);

        return _.mapKeys(
            {
                ...safetyUser,
            },
            (v, k) => _.camelCase(k)
        );
    }

    async changePassword(opts: ChangePasswordDto, user: User): Promise<ShopApiResponse<User>> {
        const res = await this.datasource.manager.query(
            `update users set password = crypt($1, gen_salt('md5')), updated_at=$2 where id = $3 and password = crypt($4, password) returning *`,
            [opts.newPassword, new Date().toISOString(), user.id, opts.password]
        );
        const returning = res[0];
        const rowAffected = res[1];

        if (!rowAffected) throw new UserNotFoundException();

        const transormedUser = this.transformUser(returning[0]);
        return {
            message: 'CHANGE_PASSWORD_SUCCESS',
            ok: true,
            code: 200,
            data: [transormedUser],
        };
    }

    getUserByLogin(opts: { login: string }) {
        const runner = this.datasource.createQueryRunner();
        try {
            runner.connect();

            const [qry, par] = this.datasource
                .createQueryBuilder()
                .select('*')
                .from('users', 'u')
                .where('u.login = :login', { login: opts.login })
                .getQueryAndParameters();

            return runner.query(qry, par).then(res => res[0]);
        } finally {
            runner.release();
        }
    }
}
