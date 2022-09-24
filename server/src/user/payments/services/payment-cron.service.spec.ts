import { Test, TestingModule } from '@nestjs/testing';
import { PaymentCronService } from './payment-cron.service';

describe('PaymentCronService', () => {
  let service: PaymentCronService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentCronService],
    }).compile();

    service = module.get<PaymentCronService>(PaymentCronService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
