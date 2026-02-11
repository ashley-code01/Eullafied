import { Department } from 'src/department/entities/department.entity';
import { Role } from 'src/role/entities/role.entity';
import { StaffPerformanceCounter } from 'src/staff-performance/entities/staff-performance.entity';
import { TicketAssignment } from 'src/ticket-assignment/entities/ticket-assignment.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column()
    password: string;

    @Column({ unique: true })
    email: string;

    // Many users belong to one role
    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    // Many users belong to one department
    @ManyToOne(() => Department, (department) => department.users, { eager: true })
    @JoinColumn({ name: 'department_id' })
    department: Department;

    @CreateDateColumn({ type: 'timestamp' })
    assigned_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    // Tickets created by this user
    @OneToMany(() => Ticket, (ticket) => ticket.requester)
    ticket_requests: Ticket[];

    // Tickets managed by this user
    @OneToMany(() => Ticket, (ticket) => ticket.manager)
    managed_tickets: Ticket[];

    // Tickets assigned to this user
    @OneToMany(() => TicketAssignment, (assignment) => assignment.assigned_to)
    assigned_tickets: TicketAssignment[];

    // Staff performance counters
    @OneToMany(() => StaffPerformanceCounter, (counter) => counter.user)
    staff_performance_counters: StaffPerformanceCounter[];

}
