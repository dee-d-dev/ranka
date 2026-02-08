import { Injectable } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World!';
	}
}