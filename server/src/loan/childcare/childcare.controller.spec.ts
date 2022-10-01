import { Test, TestingModule } from '@nestjs/testing';
import { ChildcareController } from './childcare.controller';
import { ChildcareService } from './childcare.service';

describe('ChildcareController', () => {
  let controller: ChildcareController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildcareController],
      providers: [ChildcareService],
    }).compile();

    controller = module.get<ChildcareController>(ChildcareController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
