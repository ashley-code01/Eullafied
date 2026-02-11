import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateStaffPerformanceDto {
  @ApiProperty({ description: 'User ID (UUID) of the staff member' })
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: 'Metric date in YYYY-MM-DD format' })
  @IsNotEmpty()
  @IsDateString()
  metric_date: string;

  @ApiProperty({ description: 'Number of tickets resolved', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tickets_resolved?: number;

  @ApiProperty({ description: 'Average resolution time in seconds', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  avg_resolution_seconds?: number;
}
