import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'staff_performance_counters' })
@Index(['user_id', 'metric_date'], { unique: true })
export class StaffPerformanceCounter {
  @PrimaryGeneratedColumn('increment')
  id: number; // Auto-generated primary key

  @Column('uuid')
  user_id: string;

  @Column({ type: 'date' })
  metric_date: Date;

  @Column({ type: 'int', unsigned: true, default: 0 })
  tickets_resolved: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  avg_resolution_seconds: number | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.staff_performance_counters, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Computed property for better readability
  get avg_resolution_minutes(): number | null {
    return this.avg_resolution_seconds
      ? Math.round(this.avg_resolution_seconds / 60)
      : null;
  }

  get avg_resolution_hours(): number | null {
    return this.avg_resolution_seconds
      ? Math.round((this.avg_resolution_seconds / 3600) * 100) / 100
      : null;
  }
}