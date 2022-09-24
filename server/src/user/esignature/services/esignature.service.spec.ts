import { Test, TestingModule } from '@nestjs/testing';
import { EsignatureService } from './esignature.service';

describe('EsignatureService', () => {
  let service: EsignatureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EsignatureService],
    }).compile();

    service = module.get<EsignatureService>(EsignatureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
