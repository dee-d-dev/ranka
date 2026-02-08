import { Injectable } from '@nestjs/common';
import { Response } from '../response';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }
    async createUser(payload: any): Promise<Response> {
        const {username} = payload;
        const data = this.userRepository.create({
            username
        })

        return {
            status: 200,
            message: `User ${username} created successfully!`,
            data
        }
        
    }
}
