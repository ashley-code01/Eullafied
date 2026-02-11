import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, IsDateString } from 'class-validator';

export class CreateTicketDto {
    @ApiProperty({ description: 'Unique ticket number', maxLength: 40 })
    @IsString()
    ticket_number: string;

    @ApiProperty({ description: 'Ticket description', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Requester ID (user who raised the ticket)' })
    @IsNotEmpty()
    requester_id: string;

    @ApiProperty({ description: 'Department ID', required: false })
   @IsNotEmpty()
    department_id?: string;

    @ApiProperty({ description: 'Category ID', required: false })
    @IsNotEmpty()
    category_id?: string;

    @ApiProperty({ description: 'Priority ID' })
    @IsNotEmpty()
    priority_id: string;

    @ApiProperty({ description: 'Status ID' })
    @IsNotEmpty()
    status_id: string;

    @ApiProperty({ description: 'Manager ID', required: false })
    @IsOptional()
    @IsNotEmpty()
    manager_id?: string;

    @ApiProperty({ description: 'Manager comment', required: false })
    @IsOptional()
    @IsString()
    manager_comment?: string;



    @ApiProperty({ description: 'Ticket closed date', required: false })
    @IsOptional()
    @IsDateString()
    @Transform(({ value }) => (value === '' ? undefined : value))
    closed_at?: Date;

    @ApiProperty({ description: 'Ticket cancelled date', required: false })
    @IsOptional()
    @IsDateString()
    @Transform(({ value }) => (value === '' ? undefined : value))
    cancelled_at?: Date;


    @ApiProperty({ description: 'Resolution summary', required: false })
    @IsOptional()
    @IsString()
    resolution_summary?: string;
}
