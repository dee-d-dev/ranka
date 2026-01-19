import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsModule } from './groups/groups.module';
import { Users } from './users/entities/users.entity';
import { HealthModule } from './health/health.module';
import { HealthController } from './health/health.controller';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'postgres',
			password: 'adedotun',
			database: 'ranka',
			autoLoadEntities: true,
			synchronize: true,
		}),
		UsersModule,
		GroupsModule,
		HealthModule,
		AppModule
	],
	controllers: [AppController, HealthController, UsersController],
	providers: [AppService],
})
export class AppModule {}
