import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity()
export class TicketCategory {
    @PrimaryGeneratedColumn('uuid')
    category_id: string;
    
    @Column({ unique: true, length: 100 })
    name: string; 

    @OneToMany(() => Ticket, (ticket) => ticket.category)
    tickets: Ticket[];
}
