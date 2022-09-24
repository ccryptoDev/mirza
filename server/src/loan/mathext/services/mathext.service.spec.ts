import { Test, TestingModule } from '@nestjs/testing';
import { MathExtService } from './mathext.service';

describe('MathextService', () => {
  let service: MathExtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MathExtService],
    }).compile();

    service = module.get<MathExtService>(MathExtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
