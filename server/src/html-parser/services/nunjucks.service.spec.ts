import { Test, TestingModule } from '@nestjs/testing';
import { NunjucksService } from './nunjucks.service';

describe('NunjucksService', () => {
  let service: NunjucksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NunjucksService],
    }).compile();

    service = module.get<NunjucksService>(NunjucksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
