import { Body, Controller, Post, Req } from '@nestjs/common';

@Controller('users')
export class UsersController {
	@Post()
	createUser(@Req() req: any, @Body() body: any) {}
}
