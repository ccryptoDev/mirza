import { Test, TestingModule } from '@nestjs/testing';
import { CliqService } from './cliq.service';

describe('CliqService', () => {
  let service: CliqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CliqService],
    }).compile();

    service = module.get<CliqService>(CliqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
