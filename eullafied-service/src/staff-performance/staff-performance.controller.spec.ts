import { Test, TestingModule } from '@nestjs/testing';
import { StaffPerformanceController } from './staff-performance.controller';
import { StaffPerformanceService } from './staff-performance.service';

describe('StaffPerformanceController', () => {
  let controller: StaffPerformanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffPerformanceController],
      providers: [StaffPerformanceService],
    }).compile();

    controller = module.get<StaffPerformanceController>(StaffPerformanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
