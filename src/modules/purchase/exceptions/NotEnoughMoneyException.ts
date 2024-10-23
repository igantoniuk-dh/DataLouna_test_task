export class NotEnoughMoneyException extends Error {
    constructor(message?: string) {
        super(message);
    }
}
