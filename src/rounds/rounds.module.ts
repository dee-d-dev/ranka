import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round } from './rounds.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Round])],
})
export class RoundsModule {}
