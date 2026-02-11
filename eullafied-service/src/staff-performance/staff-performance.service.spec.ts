import { Test, TestingModule } from '@nestjs/testing';
import { StaffPerformanceService } from './staff-performance.service';

describe('StaffPerformanceService', () => {
  let service: StaffPerformanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffPerformanceService],
    }).compile();

    service = module.get<StaffPerformanceService>(StaffPerformanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
