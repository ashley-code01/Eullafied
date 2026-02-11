import { PartialType } from '@nestjs/swagger';
import { CreateStaffPerformanceDto } from './create-staff-performance.dto';

export class UpdateStaffPerformanceDto extends PartialType(CreateStaffPerformanceDto) {}
