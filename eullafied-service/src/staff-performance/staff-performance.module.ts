import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { StaffPerformanceService } from './staff-performance.service';
import { StaffPerformanceController } from './staff-performance.controller';
import { Ticket } from '../ticket/entities/ticket.entity';
import { TicketAssignment } from '../ticket-assignment/entities/ticket-assignment.entity';
import { User } from '../user/entities/user.entity';
import { StaffPerformanceCounter } from './entities/staff-performance.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Enable cron jobs
    TypeOrmModule.forFeature([
      StaffPerformanceCounter,
      Ticket,
      TicketAssignment,
      User,
    ]),
  ],
  controllers: [StaffPerformanceController],
  providers: [StaffPerformanceService],
  exports: [StaffPerformanceService],
})
export class StaffPerformanceModule {}