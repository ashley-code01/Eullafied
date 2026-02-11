import { Module } from '@nestjs/common';
import { TicketPriorityService } from './ticket-priority.service';
import { TicketPriorityController } from './ticket-priority.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketPriority } from './entities/ticket-priority.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketPriority])],
  controllers: [TicketPriorityController], 
  providers: [TicketPriorityService],
  exports: [TicketPriorityService],
})
export class TicketPriorityModule {}