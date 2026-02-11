import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateStaffPerformanceDto } from './dto/create-staff-performance.dto';
import { UpdateStaffPerformanceDto } from './dto/update-staff-performance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Between, Repository } from 'typeorm';
import { StaffPerformanceCounter } from './entities/staff-performance.entity';

// @Injectable()
// export class StaffPerformanceService {
//   constructor(
//     @InjectRepository(StaffPerformanceCounter)
//     private readonly counterRepository: Repository<StaffPerformanceCounter>,

//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   async create(dto: CreateStaffPerformanceDto): Promise<StaffPerformanceCounter> {
//     const user = await this.userRepository.findOne({ where: { user_id: dto.user_id } });
//     if (!user) throw new NotFoundException(`User ${dto.user_id} not found`);

//     const counter = this.counterRepository.create({
//       ...dto,
//       user,
//       metric_date: new Date(dto.metric_date),
//     });

//     return this.counterRepository.save(counter);
//   }

//   async findAll(): Promise<StaffPerformanceCounter[]> {
//     return this.counterRepository.find({ relations: ['user'] });
//   }

//   async findOne(user_id: string, metric_date: string): Promise<StaffPerformanceCounter> {
//     const counter = await this.counterRepository.findOne({
//       where: { user_id, metric_date: new Date(metric_date) },
//       relations: ['user'],
//     });
//     if (!counter) throw new NotFoundException(`Counter for user ${user_id} on ${metric_date} not found`);
//     return counter;
//   }

//   async update(
//     user_id: string,
//     metric_date: string,
//     dto: UpdateStaffPerformanceDto,
//   ): Promise<StaffPerformanceCounter> {
//     const counter = await this.findOne(user_id, metric_date);
//     Object.assign(counter, dto);
//     return this.counterRepository.save(counter);
//   }

//   async remove(user_id: string, metric_date: string): Promise<StaffPerformanceCounter> {
//     const counter = await this.findOne(user_id, metric_date);
//     await this.counterRepository.remove(counter);
//     return counter;
//   }

//   async findByUserId(user_id: string): Promise<StaffPerformanceCounter[]> {
//   const user = await this.userRepository.findOne({ where: { user_id } });
//   if (!user) throw new NotFoundException(`User ${user_id} not found`);

//   return this.counterRepository.find({
//     where: { user_id },
//     relations: ['user'],
//     order: { metric_date: 'DESC' },
//   });
// }

import { Cron, CronExpression } from '@nestjs/schedule';
import { Ticket } from '../ticket/entities/ticket.entity';
import { TicketAssignment } from '../ticket-assignment/entities/ticket-assignment.entity';

@Injectable()
export class StaffPerformanceService {
  private readonly logger = new Logger(StaffPerformanceService.name);

  constructor(
    @InjectRepository(StaffPerformanceCounter)
    private readonly performanceRepo: Repository<StaffPerformanceCounter>,
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(TicketAssignment)
    private readonly assignmentRepo: Repository<TicketAssignment>,
  ) { }

  /**
   * Runs every minute to update staff performance metrics
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async updatePerformanceMetrics(): Promise<void> {
    this.logger.debug('Running performance metrics update...');

    try {
      const today = this.getToday();
      const startOfWeek = this.getStartOfWeek(today);

      // Get all active staff members with assignments
      const activeStaff = await this.getActiveStaffMembers();

      for (const userId of activeStaff) {
        await this.updateStaffMetrics(userId, startOfWeek);
      }

      this.logger.debug('Performance metrics update completed');
    } catch (error) {
      this.logger.error('Error updating performance metrics', error.stack);
    }
  }

  /**
   * Update metrics for a specific staff member
   */
  private async updateStaffMetrics(userId: string, metricDate: Date): Promise<void> {
    try {
      // Get resolved tickets for this week
      const resolvedTickets = await this.getResolvedTicketsForWeek(userId, metricDate);

      if (resolvedTickets.length === 0) {
        // No tickets resolved yet, but create record if needed
        await this.ensurePerformanceRecord(userId, metricDate, 0, null);
        return;
      }

      // Calculate metrics
      const ticketsResolved = resolvedTickets.length;
      const avgResolutionSeconds = this.calculateAverageResolution(resolvedTickets);

      // Create or update the performance record
      await this.upsertPerformanceRecord(
        userId,
        metricDate,
        ticketsResolved,
        avgResolutionSeconds,
      );
    } catch (error) {
      this.logger.error(
        `Error updating metrics for user ${userId}`,
        error.stack,
      );
    }
  }

  /**
   * Get all staff members who have active or recent ticket assignments
   */
  private async getActiveStaffMembers(): Promise<string[]> {
    const startOfWeek = this.getStartOfWeek(this.getToday());

    const assignments = await this.assignmentRepo
      .createQueryBuilder('assignment')
      .select('DISTINCT assignment.assigned_to', 'user_id')
      .where('assignment.assigned_at >= :startOfWeek', { startOfWeek })
      .getRawMany();

    return assignments.map(a => a.user_id);
  }

  /**
   * Get resolved tickets for a staff member within the current week
   */
  private async getResolvedTicketsForWeek(
    userId: string,
    startOfWeek: Date,
  ): Promise<Ticket[]> {
    const endOfWeek = this.getEndOfWeek(startOfWeek);

    return await this.ticketRepo
      .createQueryBuilder('ticket')
      .innerJoin('ticket.assignments', 'assignment')
      .innerJoin('ticket.status', 'status')
      .where('assignment.assigned_to = :userId', { userId })
      .andWhere('status.status_name IN (:...resolvedStatuses)', {
        resolvedStatuses: ['Resolved', 'Closed', 'Completed'],
      })
      .andWhere('ticket.closed_at BETWEEN :startOfWeek AND :endOfWeek', {
        startOfWeek,
        endOfWeek,
      })
      .getMany();
  }

  /**
   * Calculate average resolution time in seconds
   */
  private calculateAverageResolution(tickets: Ticket[]): number | null {
    if (tickets.length === 0) return null;

    const totalSeconds = tickets.reduce((sum, ticket) => {
      if (!ticket.created_at || !ticket.closed_at) return sum;

      const resolutionTime =
        ticket.closed_at.getTime() - ticket.created_at.getTime();
      return sum + Math.floor(resolutionTime / 1000); // Convert to seconds
    }, 0);

    return Math.floor(totalSeconds / tickets.length);
  }

  /**
   * Create or update performance record
   */
  private async upsertPerformanceRecord(
    userId: string,
    metricDate: Date,
    ticketsResolved: number,
    avgResolutionSeconds: number | null,
  ): Promise<void> {
    const existing = await this.performanceRepo.findOne({
      where: {
        user_id: userId,
        metric_date: metricDate,
      },
    });

    if (existing) {
      existing.tickets_resolved = ticketsResolved;
      existing.avg_resolution_seconds = avgResolutionSeconds ?? null;
      await this.performanceRepo.save(existing);
      this.logger.debug(
        `Updated metrics for user ${userId}: ${ticketsResolved} tickets, avg ${avgResolutionSeconds}s`,
      );
    } else {
      const newRecord = new StaffPerformanceCounter();
      newRecord.user_id = userId;
      newRecord.metric_date = metricDate;
      newRecord.tickets_resolved = ticketsResolved;
      newRecord.avg_resolution_seconds = avgResolutionSeconds ?? null;

      await this.performanceRepo.save(newRecord);
      this.logger.debug(
        `Created metrics for user ${userId}: ${ticketsResolved} tickets, avg ${avgResolutionSeconds}s`,
      );
    }
  }


  /**
   * Ensure a performance record exists (even with zero values)
   */
 private async ensurePerformanceRecord(
  userId: string,
  metricDate: Date,
  ticketsResolved: number,
  avgResolutionSeconds: number | null,
): Promise<void> {
  const existing = await this.performanceRepo.findOne({
    where: {
      user_id: userId,
      metric_date: metricDate,
    },
  });

  if (!existing) {
    const newRecord = new StaffPerformanceCounter();
    newRecord.user_id = userId;
    newRecord.metric_date = metricDate;
    newRecord.tickets_resolved = ticketsResolved;
    newRecord.avg_resolution_seconds = avgResolutionSeconds ?? null; 

    await this.performanceRepo.save(newRecord);
  }
}


  /**
   * Get today's date at midnight
   */
  private getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  /**
   * Get the start of the week (Monday)
   */
  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Get the end of the week (Sunday)
   */
  private getEndOfWeek(startOfWeek: Date): Date {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  // ========== PUBLIC API METHODS ==========

  /**
   * Manually create a performance record
   */
  async create(createDto: any): Promise<StaffPerformanceCounter> {
    const newRecord = new StaffPerformanceCounter();
    newRecord.user_id = createDto.user_id;
    newRecord.metric_date = new Date(createDto.metric_date);
    newRecord.tickets_resolved = createDto.tickets_resolved || 0;
    newRecord.avg_resolution_seconds = createDto.avg_resolution_seconds ?? undefined;

    return await this.performanceRepo.save(newRecord);
  }

  /**
   * Update a performance record
   */
  async update(
    userId: string,
    metricDate: string,
    updateDto: any,
  ): Promise<StaffPerformanceCounter> {
    const date = new Date(metricDate);
    const record = await this.performanceRepo.findOne({
      where: {
        user_id: userId,
        metric_date: date,
      },
    });

    if (!record) {
      throw new Error('Performance record not found');
    }

    if (updateDto.tickets_resolved !== undefined) {
      record.tickets_resolved = updateDto.tickets_resolved;
    }
    if (updateDto.avg_resolution_seconds !== undefined) {
      record.avg_resolution_seconds = updateDto.avg_resolution_seconds ?? undefined;
    }

    return await this.performanceRepo.save(record);
  }

  /**
   * Delete a performance record
   */
  async remove(userId: string, metricDate: string): Promise<StaffPerformanceCounter> {
    const date = new Date(metricDate);
    const record = await this.performanceRepo.findOne({
      where: {
        user_id: userId,
        metric_date: date,
      },
    });

    if (!record) {
      throw new Error('Performance record not found');
    }

    await this.performanceRepo.remove(record);
    return record;
  }

  /**
   * Get performance metrics for a specific user
   */
  async findByUser(userId: string): Promise<StaffPerformanceCounter[]> {
    return await this.performanceRepo.find({
      where: { user_id: userId },
      order: { metric_date: 'DESC' },
    });
  }

  /**
   * Get current week performance for a user
   */
  async getCurrentWeekPerformance(
    userId: string,
  ): Promise<StaffPerformanceCounter | null> {
    const startOfWeek = this.getStartOfWeek(this.getToday());

    return await this.performanceRepo.findOne({
      where: {
        user_id: userId,
        metric_date: startOfWeek,
      },
    });
  }

  /**
   * Get performance metrics within a date range
   */
  async findByUserAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<StaffPerformanceCounter[]> {
    return await this.performanceRepo.find({
      where: {
        user_id: userId,
        metric_date: Between(startDate, endDate),
      },
      order: { metric_date: 'ASC' },
    });
  }

  /**
   * Get top performers for the current week
   */
  async getTopPerformers(limit: number = 10): Promise<StaffPerformanceCounter[]> {
    const startOfWeek = this.getStartOfWeek(this.getToday());

    return await this.performanceRepo.find({
      where: { metric_date: startOfWeek },
      order: {
        tickets_resolved: 'DESC',
        avg_resolution_seconds: 'ASC',
      },
      take: limit,
      relations: ['user'],
    });
  }

  /**
   * Get all performance metrics for all users
   */
  async findAll(): Promise<StaffPerformanceCounter[]> {
    return await this.performanceRepo.find({
      order: { metric_date: 'DESC' },
      relations: ['user'],
    });
  }

  /**
   * Get performance metrics by composite key
   */
  async findOne(userId: string, metricDate: string): Promise<StaffPerformanceCounter> {
    const date = new Date(metricDate);
    const record = await this.performanceRepo.findOne({
      where: {
        user_id: userId,
        metric_date: date,
      },
      relations: ['user'],
    });
    if (!record) {
      throw new NotFoundException(`Performance record for user ${userId} on ${metricDate} not found`);
    }
    return record;
  }

  /**
   * Manual trigger to recalculate all metrics for current week
   */
  async recalculateCurrentWeek(): Promise<void> {
    this.logger.log('Manual recalculation triggered for current week');
    await this.updatePerformanceMetrics();
  }
}