import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity()
export class Role {
    @PrimaryGeneratedColumn('uuid')
    role_id: string;

    @Column()
    role_name: string;

    // One role has many users
    @OneToMany(() => User, (user) => user.role)
    users: User[];
}
