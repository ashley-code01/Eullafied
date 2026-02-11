import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTicketAssignmentDto {
  @ApiProperty({ description: 'The ID of the ticket being assigned' })
  @IsString()
  @IsNotEmpty()
  ticket_id: string;

  @ApiProperty({ description: 'The ID of the user assigned to the ticket' })
  @IsString()
  @IsNotEmpty()
  assigned_to: string;

  @ApiProperty({
    description: 'Reason for assignment',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  assignment_reason?: string;
}
