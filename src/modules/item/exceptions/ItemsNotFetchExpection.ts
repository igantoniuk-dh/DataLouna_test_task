export class ItemsNotFetchException extends Error {
    constructor() {
        super('Items not fetched');
    }
}
