import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { Department } from '../department/entities/department.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { encodePassword } from 'src/utils/bcrypt';
import { MailService } from 'src/mail/mail.service';
import { generateRandomPassword } from 'src/utils/password.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,

    private readonly mailService: MailService,
  ) { }


  async create(createUserDto: CreateUserDto): Promise<User> {
    const role = await this.roleRepository.findOne({
      where: { role_id: createUserDto.role_id },
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${createUserDto.role_id} not found`);
    }

    const department = await this.departmentRepository.findOne({
      where: { department_id: createUserDto.department_id },
    });
    if (!department) {
      throw new NotFoundException(`Department with ID ${createUserDto.department_id} not found`);
    }
    // Hash the password before saving
    const passwd = generateRandomPassword();
    const hashedPassword = await encodePassword(passwd);
    createUserDto.password = hashedPassword;

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role,
      department,
    });

   const savedUser = await this.userRepository.save(user);

    // Send welcome email with password
    try {
      await this.mailService.sendingUserCreated(
        savedUser.email,
        `${savedUser.name} ${savedUser.surname}`,
        passwd,
      );
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't throw error - user was created successfully
    }

    return savedUser;
  }
 

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['role', 'department'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id: id },
      relations: ['role', 'department'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      user_id: id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }


    if (updateUserDto.password) {
      user.password = await encodePassword(updateUserDto.password);
    }

    if (updateUserDto.role_id) {
      const role = await this.roleRepository.findOne({
        where: { role_id: updateUserDto.role_id },
      });
      if (!role) {
        throw new NotFoundException(`Role with ID ${updateUserDto.role_id} not found`);
      }
      user.role = role;
    }

    if (updateUserDto.department_id) {
      const department = await this.departmentRepository.findOne({
        where: { department_id: updateUserDto.department_id },
      });
      if (!department) {
        throw new NotFoundException(`Department with ID ${updateUserDto.department_id} not found`);
      }
      user.department = department;
    }

    return this.userRepository.save(user);
  }


  async remove(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id: id },
      relations: ['role', 'department'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.remove(user);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role', 'department'],
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findByDepartmentId(departmentId: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { department: { department_id: departmentId } },
      relations: ['role', 'department'],
    });

    if (!users || users.length === 0) {
      throw new NotFoundException(`No users found for department ID ${departmentId}`);
    }

    return users;
  }

 async findUsersByDepartmentName(departmentName: string): Promise<User[]> {
  const department = await this.departmentRepository.findOne({
    where: { department_name: departmentName },
  });

  if (!department) {
    throw new NotFoundException(`Department with name ${departmentName} not found`);
  }

  const users = await this.userRepository.find({
    where: { department: { department_id: department.department_id } },
    relations: ['role', 'department'],
  });

  if (!users.length) {
    throw new NotFoundException(`No users found for department ${departmentName}`);
  }

  return users;
}



}