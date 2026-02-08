import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './submission.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Submission])],
})
export class SubmissionsModule {}
