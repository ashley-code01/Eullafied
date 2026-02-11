import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity()
export class TicketStatus {
  @PrimaryGeneratedColumn('uuid')
  status_id: string;

  @Column({ unique: true, length: 50 })
  status_name: string;

  @OneToMany(() => Ticket, (ticket) => ticket.status)
  tickets: Ticket[];
}
