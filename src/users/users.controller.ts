import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.dto';

@Controller('users')
export class UsersController {
	userService = new UsersService();
	
	@Post()
	createUser(@Req() req: any, @Body() body: CreateUserDto) {
		try {
			const {username} = body
			return this.userService.createUser({
				username
			})
		} catch (error) {
			return {
				status: 500,
				message: 'An error occurred while creating the user.',
				error: error.message
			}
		}

	}
}
