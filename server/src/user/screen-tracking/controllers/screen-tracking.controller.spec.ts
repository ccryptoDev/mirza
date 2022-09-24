import { Test, TestingModule } from '@nestjs/testing';
import { ScreenTrackingController } from './screen-tracking.controller';

describe('ScreenTrackingController', () => {
  let controller: ScreenTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScreenTrackingController],
    }).compile();

    controller = module.get<ScreenTrackingController>(ScreenTrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
