import { Test, TestingModule } from '@nestjs/testing';
import { ChildcareService } from './childcare.service';

describe('ChildcareService', () => {
  let service: ChildcareService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChildcareService],
    }).compile();

    service = module.get<ChildcareService>(ChildcareService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
