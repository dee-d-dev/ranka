import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModule } from './sessions/session.module';
import { HealthModule } from './health/health.module';
import { HealthController } from './health/health.controller';
import { SubmissionsModule } from './submissions/submissions.module';
import { RoundsModule } from './rounds/rounds.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			autoLoadEntities: true,
			synchronize: true,
		}),
		UsersModule,
		SessionModule,
		HealthModule,
		AppModule,
		SubmissionsModule,
		RoundsModule
	],
	controllers: [AppController, HealthController, UsersController],
	providers: [AppService],
})
export class AppModule {}
