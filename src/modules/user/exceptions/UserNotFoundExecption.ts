export class UserNotFoundException extends Error {
    constructor(opts?: { login?: string }) {
        super(opts?.login ? `User not found by login: ${opts?.login}` : 'User not found');
    }
}
