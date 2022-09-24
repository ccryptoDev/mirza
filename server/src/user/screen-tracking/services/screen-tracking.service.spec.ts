import { Test, TestingModule } from '@nestjs/testing';
import { ScreenTrackingService } from './screen-tracking.service';

describe('ScreenTrackingService', () => {
  let service: ScreenTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScreenTrackingService],
    }).compile();

    service = module.get<ScreenTrackingService>(ScreenTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
