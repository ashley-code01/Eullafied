import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/department/entities/department.entity';
import { TicketCategory } from 'src/ticket-category/entities/ticket-category.entity';
import { TicketPriority } from 'src/ticket-priority/entities/ticket-priority.entity';
import { TicketStatus } from 'src/ticket-status/entities/ticket-status.entity';
import { User } from 'src/user/entities/user.entity';
import { Ticket } from './entities/ticket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      User,
      Department,
      TicketCategory,
      TicketPriority,
      TicketStatus,
    ]),
  ],
  providers: [TicketService],
  controllers: [TicketController],
  exports: [TicketService],
})
export class TicketModule {}