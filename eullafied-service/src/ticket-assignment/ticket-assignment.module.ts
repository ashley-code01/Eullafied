import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketAssignment } from './entities/ticket-assignment.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { User } from 'src/user/entities/user.entity';
import { TicketAssignmentService } from './ticket-assignment.service';
import { TicketAssignmentController } from './ticket-assignment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketAssignment, Ticket, User]),
  ],
  providers: [TicketAssignmentService],
  controllers: [TicketAssignmentController],
  exports: [TicketAssignmentService],
})
export class TicketAssignmentModule {}
