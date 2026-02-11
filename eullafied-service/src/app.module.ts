import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { DepartmentModule } from './department/department.module';
import { TicketCategoryModule } from './ticket-category/ticket-category.module';
import { TicketPriorityModule } from './ticket-priority/ticket-priority.module';
import { TicketStatusModule } from './ticket-status/ticket-status.module';
import { TicketModule } from './ticket/ticket.module';
import { TicketAssignmentModule } from './ticket-assignment/ticket-assignment.module';
import { StaffPerformanceModule } from './staff-performance/staff-performance.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AuthModule,
    UserModule,
    RoleModule,
    DepartmentModule,
    TicketCategoryModule,
    TicketPriorityModule,
    TicketStatusModule,
    TicketModule,
    TicketAssignmentModule,
    StaffPerformanceModule
  ],
})
export class AppModule {}
