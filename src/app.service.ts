import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
    constructor() {}
    async getHello(): Promise<string> {
        return 'Hello World!';
    }
}
