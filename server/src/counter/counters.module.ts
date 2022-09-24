import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CountersService } from './services/counters.service';
import { Counters } from './entities/counters.entity';
import { LoggerModule } from '../logger/logger.module';
import { CounterController } from './controllers/counter.controller';
import { LoansModule } from '../loan/loans.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Counters]),
    forwardRef(() => LoansModule),
    LoggerModule,
  ],
  providers: [CountersService],
  exports: [TypeOrmModule, CountersService],
  controllers: [CounterController],
})
export class CountersModule {}
