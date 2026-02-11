import { Module } from '@nestjs/common';
import { TicketStatusService } from './ticket-status.service';
import { TicketStatusController } from './ticket-status.controller';
import { TicketStatus } from './entities/ticket-status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TicketStatus])],
  controllers: [TicketStatusController], 
  providers: [TicketStatusService],
  exports: [TicketStatusService],
})
export class TicketStatusModule {}