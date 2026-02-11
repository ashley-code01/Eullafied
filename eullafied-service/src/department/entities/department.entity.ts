import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';

@Entity()
export class Department {
    @PrimaryGeneratedColumn('uuid')
    department_id: string;

    @Column()
    department_name: string;

    // One department has many users
    @OneToMany(() => User, (user) => user.department)
    users: User[];

    // Tickets associated with this department
    @OneToMany(() => Ticket, (ticket) => ticket.department)
    tickets: Ticket[];
}
