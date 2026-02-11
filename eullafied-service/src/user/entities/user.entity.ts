import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
    Index,
  } from 'typeorm';
  import { Exclude } from 'class-transformer';
  import { Role } from '../../role/entities/role.entity';
  import { Department } from '../../department/entities/department.entity';
  import { Ticket } from '../../ticket/entities/ticket.entity';
  import { TicketAssignment } from '../../ticket-assignment/entities/ticket-assignment.entity';
  import { StaffPerformance } from '../../staff-performance/entities/staff-performance.entity';

  @Entity('user')
  @Index(['email'])
  @Index(['role_id'])
  @Index(['is_active'])
  export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;
  
    @Column({ type: 'varchar', length: 255, unique: true })
    @Index()
    email: string;
  
    @Column({ type: 'varchar', length: 255, name: 'password_hash' })
    @Exclude() // Never expose password hash in responses
    password_hash: string;
  
    @Column({ type: 'varchar', length: 100 })
    name: string;
  
    @Column({ type: 'varchar', length: 100 })
    surname: string;
  
    @Column({ type: 'char', length: 36 })
    role_id: string;
  
    @Column({ type: 'char', length: 36 })
    department_id: string;
  
    @Column({ type: 'boolean', default: true })
    is_active: boolean;
  
    @Column({ type: 'boolean', default: false })
    email_verified: boolean;
  
    @Column({ type: 'timestamp', nullable: true })
    last_login: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    password_changed_at: Date;
  
    @Column({ type: 'int', default: 0 })
    @Exclude()
    failed_login_attempts: number;
  
    @Column({ type: 'timestamp', nullable: true })
    @Exclude()
    locked_until: Date;
  
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
  
    // Relationships
    @ManyToOne(() => Role, { eager: true })
    @JoinColumn({ name: 'role_id' })
    role: Role;
  
    @ManyToOne(() => Department, { eager: true })
    @JoinColumn({ name: 'department_id' })
    department: Department;
  
    @OneToMany(() => Ticket, (ticket) => ticket.requester)
    tickets_created: Ticket[];
  
    @OneToMany(() => Ticket, (ticket) => ticket.manager)
    tickets_managed: Ticket[];
  
    @OneToMany(() => TicketAssignment, (assignment) => assignment.assigned_to_user)
    ticket_assignments: TicketAssignment[];
  
    @OneToMany(() => StaffPerformance, (performance) => performance.user)
    performance_records: StaffPerformance[];
  
    // Helper method to get full name
    get fullName(): string {
      return `${this.name} ${this.surname}`;
    }
  
    // Check if account is locked
    isLocked(): boolean {
      if (!this.locked_until) return false;
      return new Date() < this.locked_until;
    }
  }
  