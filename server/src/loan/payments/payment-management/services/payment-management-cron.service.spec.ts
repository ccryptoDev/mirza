import { Test, TestingModule } from '@nestjs/testing';
import { PaymentManagementCronService } from './payment-management-cron.service';

describe('PaymentManagementCronService', () => {
  let service: PaymentManagementCronService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentManagementCronService],
    }).compile();

    service = module.get<PaymentManagementCronService>(
      PaymentManagementCronService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
