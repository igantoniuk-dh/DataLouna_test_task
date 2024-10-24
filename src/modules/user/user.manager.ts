import * as _ from 'lodash';
import { User } from 'src/interfaces/User';
import { DataSource } from 'typeorm';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { LoginDto } from './dto/login.dto';
import { UserNotFoundException } from './exceptions/UserNotFoundExecption';
export class UserManager {
    constructor(private readonly datasource: DataSource) {}

    async getByIdAndUpdatedAt(id: string) {
        const runner = this.datasource.createQueryRunner();
        const qRyAndParams = this.datasource
            .createQueryBuilder(runner)
            .select('*')
            .from('users', 'u')
            .where('u.id = :id', { id })
            .limit(1)
            .getQueryAndParameters();

        const users = await this.datasource.manager.query(qRyAndParams[0], qRyAndParams[1]);

        const user = users?.at(0);

        if (!user) throw new UserNotFoundException();

        return user;
    }

    async login(opts: LoginDto): Promise<User> {
        const runner = this.datasource.createQueryRunner();
        const qRyAndParams = this.datasource
            .createQueryBuilder(runner)
            .select('*')
            .from('users', 'u')
            .where('u.login = :login', { login: opts.login })
            .andWhere(`password = crypt(:password, password)`, {
                password: opts.password,
            })
            .limit(1)
            .getQueryAndParameters();

        const users = await this.datasource.manager.query(qRyAndParams[0], qRyAndParams[1]);

        const user = users?.at(0);

        if (!user) throw new UserNotFoundException(opts);

        const lastLoginAt = new Date().toISOString();
        const updateLastLoging = this.datasource
            .createQueryBuilder(runner)
            .update('users')
            .set({ last_login_at: lastLoginAt })
            .where('id = :id', { id: user.id })
            .returning('*')
            .getQueryAndParameters();

        await this.datasource.manager.query(updateLastLoging[0], updateLastLoging[1]);

        return this.transformUser({
            ...user,
            last_login_at: lastLoginAt,
        });
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

    async changePassword(opts: ChangePasswordDto, user: User) {
        const res = await this.datasource.manager.query(
            `update users set password = crypt($1, gen_salt('md5')), updated_at=$2 where id = $3 and password = crypt($4, password) returning *`,
            [opts.newPassword, new Date().toISOString(), user.id, opts.password]
        );
        const returning = res[0];
        const rowAffected = res[1];

        if (!rowAffected) throw new UserNotFoundException();

        return this.transformUser(returning[0]);
    }
}
