import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity()
export class TicketPriority {
  @PrimaryGeneratedColumn('uuid')
  priority_id: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @OneToMany(() => Ticket, (ticket) => ticket.priority)
  tickets: Ticket[];
}
