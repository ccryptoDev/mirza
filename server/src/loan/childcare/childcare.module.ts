import { Module } from '@nestjs/common';
import { ChildcareService } from './childcare.service';
import { ChildcareController } from './childcare.controller';
import { PaymentManagement } from '../../loan/payments/payment-management/entities/payment-management.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentManagement])],
  controllers: [ChildcareController],
  providers: [ChildcareService],
})
export class ChildcareModule {}
