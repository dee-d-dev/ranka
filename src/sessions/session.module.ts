import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/session.entity';

@Module({
	controllers: [SessionController],
	providers: [SessionService],
	imports: [TypeOrmModule.forFeature([Group])]
	
})
export class SessionModule {}
