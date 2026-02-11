import { PartialType } from '@nestjs/swagger';
import { CreateTicketAssignmentDto } from './create-ticket-assignment.dto';

export class UpdateTicketAssignmentDto extends PartialType(CreateTicketAssignmentDto) {}
