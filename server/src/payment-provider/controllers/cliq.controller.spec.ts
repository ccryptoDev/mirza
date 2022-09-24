import { Test, TestingModule } from '@nestjs/testing';
import { CliqController } from './cliq.controller';

describe('CliqController', () => {
  let controller: CliqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CliqController],
    }).compile();

    controller = module.get<CliqController>(CliqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
