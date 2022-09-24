import { Test, TestingModule } from '@nestjs/testing';
import { LoanpaymentproService } from './loanpaymentpro.service';

describe('LoanpaymentproService', () => {
  let service: LoanpaymentproService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanpaymentproService],
    }).compile();

    service = module.get<LoanpaymentproService>(LoanpaymentproService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
