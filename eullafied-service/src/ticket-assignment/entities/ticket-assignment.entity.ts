import { Ticket } from 'src/ticket/entities/ticket.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity({ name: 'ticket_assignments' })
export class TicketAssignment {
  @PrimaryGeneratedColumn('uuid')
  assignment_id: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.assignments, { nullable: false })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'assigned_to' })
  assigned_to: User;

  @CreateDateColumn({ type: 'timestamp' })
  assigned_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  unassigned_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ length: 255, nullable: true })
  assignment_reason: string;
}

