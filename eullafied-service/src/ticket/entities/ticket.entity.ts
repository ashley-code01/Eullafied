import { Department } from 'src/department/entities/department.entity';
import { TicketAssignment } from 'src/ticket-assignment/entities/ticket-assignment.entity';
import { TicketCategory } from 'src/ticket-category/entities/ticket-category.entity';
import { TicketPriority } from 'src/ticket-priority/entities/ticket-priority.entity';
import { TicketStatus } from 'src/ticket-status/entities/ticket-status.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tickets' })
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  ticket_id: string;

  @Column({ length: 40 })
  ticket_number: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relations
  @ManyToOne(() => User, (user) => user.ticket_requests, { nullable: false })
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @ManyToOne(() => Department, (department) => department.tickets, { nullable: true })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => TicketCategory, (category) => category.tickets, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: TicketCategory;

  @ManyToOne(() => TicketPriority, (priority) => priority.tickets, { nullable: false })
  @JoinColumn({ name: 'priority_id' })
  priority: TicketPriority;

  @ManyToOne(() => TicketStatus, (status) => status.tickets, { nullable: false })
  @JoinColumn({ name: 'status_id' })
  status: TicketStatus;

  @ManyToOne(() => User, (user) => user.managed_tickets, { nullable: true })
  @JoinColumn({ name: 'manager_id' })
  manager: User;

  @Column({ type: 'timestamp', nullable: true })
  manager_approved_at: Date;

  @Column({ type: 'text', nullable: true })
  manager_comment: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  closed_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at: Date;

  @Column({ type: 'text', nullable: true })
  resolution_summary: string;

  @OneToMany(() => TicketAssignment, (assignment) => assignment.ticket)
  assignments: TicketAssignment[];
}
