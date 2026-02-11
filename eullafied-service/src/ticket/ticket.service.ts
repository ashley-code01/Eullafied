import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { User } from 'src/user/entities/user.entity';
import { Department } from 'src/department/entities/department.entity';
import { TicketCategory } from 'src/ticket-category/entities/ticket-category.entity';
import { TicketPriority } from 'src/ticket-priority/entities/ticket-priority.entity';
import { TicketStatus } from 'src/ticket-status/entities/ticket-status.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,

    @InjectRepository(TicketCategory)
    private readonly categoryRepository: Repository<TicketCategory>,

    @InjectRepository(TicketPriority)
    private readonly priorityRepository: Repository<TicketPriority>,

    @InjectRepository(TicketStatus)
    private readonly statusRepository: Repository<TicketStatus>,
     private readonly dataSource: DataSource,
  ) { }

  async create(createDto: CreateTicketDto): Promise<Ticket> {
    const requester = await this.userRepository.findOne({ where: { user_id: createDto.requester_id } });
    if (!requester) throw new NotFoundException(`Requester ${createDto.requester_id} not found`);
    // Generate unique ticket number
    const ticket_number = await this.generateTicketNumber();

    const ticket = this.ticketRepository.create({
      ticket_number,
      description: createDto.description,
      requester,
    });

    if (createDto.department_id) {
      const department = await this.departmentRepository.findOne({ where: { department_id: createDto.department_id } });
      if (!department) throw new NotFoundException(`Department ${createDto.department_id} not found`);
      ticket.department = department;
    }

    if (createDto.category_id) {
      const category = await this.categoryRepository.findOne({ where: { category_id: createDto.category_id } });
      if (!category) throw new NotFoundException(`Category ${createDto.category_id} not found`);
      ticket.category = category;
    }

    const priority = await this.priorityRepository.findOne({ where: { priority_id: createDto.priority_id } });
    if (!priority) throw new NotFoundException(`Priority ${createDto.priority_id} not found`);
    ticket.priority = priority;

    const status = await this.statusRepository.findOne({ where: { status_id: createDto.status_id } });
    if (!status) throw new NotFoundException(`Status ${createDto.status_id} not found`);
    ticket.status = status;

    if (createDto.manager_id) {
      const manager = await this.userRepository.findOne({ where: { user_id: createDto.manager_id } });
      if (!manager) throw new NotFoundException(`Manager ${createDto.manager_id} not found`);
      ticket.manager = manager;
    }

    if (createDto.manager_comment) ticket.manager_comment = createDto.manager_comment;

    return this.ticketRepository.save(ticket);
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketRepository.find({
      relations: ['requester', 'department', 'category', 'priority', 'status', 'manager', 'assignments'],
    });
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { ticket_id: id },
      relations: ['requester', 'department', 'category', 'priority', 'status', 'manager', 'assignments'],
    });
    if (!ticket) throw new NotFoundException(`Ticket ${id} not found`);
    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);

    if (updateTicketDto.ticket_number !== undefined) ticket.ticket_number = updateTicketDto.ticket_number;
    if (updateTicketDto.description !== undefined) ticket.description = updateTicketDto.description;

    if (updateTicketDto.requester_id) {
      const requester = await this.userRepository.findOne({ where: { user_id: updateTicketDto.requester_id } });
      if (!requester) throw new NotFoundException(`Requester ${updateTicketDto.requester_id} not found`);
      ticket.requester = requester;
    }

    if (updateTicketDto.department_id) {
      const department = await this.departmentRepository.findOne({ where: { department_id: updateTicketDto.department_id } });
      if (!department) throw new NotFoundException(`Department ${updateTicketDto.department_id} not found`);
      ticket.department = department;
    }

    if (updateTicketDto.category_id) {
      const category = await this.categoryRepository.findOne({ where: { category_id: updateTicketDto.category_id } });
      if (!category) throw new NotFoundException(`Category ${updateTicketDto.category_id} not found`);
      ticket.category = category;
    }

    if (updateTicketDto.priority_id) {
      const priority = await this.priorityRepository.findOne({ where: { priority_id: updateTicketDto.priority_id } });
      if (!priority) throw new NotFoundException(`Priority ${updateTicketDto.priority_id} not found`);
      ticket.priority = priority;
    }

    if (updateTicketDto.status_id) {
      const status = await this.statusRepository.findOne({ where: { status_id: updateTicketDto.status_id } });
      if (!status) throw new NotFoundException(`Status ${updateTicketDto.status_id} not found`);
      ticket.status = status;
    }

    if (updateTicketDto.manager_id) {
      const manager = await this.userRepository.findOne({ where: { user_id: updateTicketDto.manager_id } });
      if (!manager) throw new NotFoundException(`Manager ${updateTicketDto.manager_id} not found`);
      ticket.manager = manager;
    }

    if (updateTicketDto.manager_comment !== undefined) ticket.manager_comment = updateTicketDto.manager_comment;
    if (updateTicketDto.closed_at !== undefined) ticket.closed_at = updateTicketDto.closed_at;
    if (updateTicketDto.cancelled_at !== undefined) ticket.cancelled_at = updateTicketDto.cancelled_at;
    if (updateTicketDto.resolution_summary !== undefined) ticket.resolution_summary = updateTicketDto.resolution_summary;

    return this.ticketRepository.save(ticket);
  }

  async remove(id: string): Promise<Ticket> {
    const ticket = await this.findOne(id);
    return this.ticketRepository.remove(ticket);
  }


 private async generateTicketNumber(): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Lock the table during read to prevent duplicate generation
      const lastTicket = await queryRunner.manager
        .getRepository(Ticket)
        .createQueryBuilder('ticket')
        .setLock('pessimistic_write') // ensures atomicity
        .orderBy('ticket.created_at', 'DESC')
        .limit(1)
        .getOne();

      let nextNumber = 1;
      if (lastTicket && lastTicket.ticket_number) {
        const lastNum = parseInt(
          lastTicket.ticket_number.replace('T-INC-', ''),
          10,
        );
        if (!isNaN(lastNum)) nextNumber = lastNum + 1;
      }

      const ticketNumber = `T-INC-${nextNumber.toString().padStart(4, '0')}`;

      await queryRunner.commitTransaction();
      return ticketNumber;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findByRequester(requester_id: string): Promise<Ticket[]> {
    const requester = await this.userRepository.findOne({ where: { user_id: requester_id } });
    if (!requester) throw new NotFoundException(`Requester ${requester_id} not found`);

    return this.ticketRepository.find({
      where: { requester: { user_id: requester_id } },
      relations: ['requester', 'department', 'category', 'priority', 'status', 'manager', 'assignments'],
    });
  }

  async findByDepartment(department_id: string): Promise<Ticket[]> {
    const department = await this.departmentRepository.findOne({ where: { department_id } });
    if (!department) throw new NotFoundException(`Department ${department_id} not found`);

    return this.ticketRepository.find({
      where: { department: { department_id } },
      relations: ['requester', 'department', 'category', 'priority', 'status', 'manager', 'assignments'],
    });
  }

  async findByDepartmentAndStatus(department_id: string, status_id: string): Promise<Ticket[]> {
    const department = await this.departmentRepository.findOne({ where: { department_id } });
    if (!department) throw new NotFoundException(`Department ${department_id} not found`);

    const status = await this.statusRepository.findOne({ where: { status_id } });
    if (!status) throw new NotFoundException(`Status ${status_id} not found`);

    return this.ticketRepository.find({
      where: {
        department: { department_id },
        status: { status_id },
      },
      relations: ['requester', 'department', 'category', 'priority', 'status', 'manager', 'assignments'],
    });
  }

  async findByStatus(status_id: string): Promise<Ticket[]> {
    const status = await this.statusRepository.findOne({ where: { status_id } });
    if (!status) throw new NotFoundException(`Status ${status_id} not found`);

    return this.ticketRepository.find({
      where: { status: { status_id } },
      relations: ['requester', 'department', 'category', 'priority', 'status', 'manager', 'assignments'],
    });
  }

  async countAll(): Promise<number> {
    return this.ticketRepository.count();
  }

  async countByStatus(status_id: string): Promise<number> {
    const status = await this.statusRepository.findOne({ where: { status_id } });
    if (!status) throw new NotFoundException(`Status ${status_id} not found`);

    return this.ticketRepository.count({ where: { status: { status_id } } });
  }

  async countByDepartmentAndStatus(department_id: string, statusName: string): Promise<number> {
  return this.ticketRepository
    .createQueryBuilder('ticket')
    .leftJoin('ticket.department', 'department')
    .leftJoin('ticket.status', 'status')
    .where('department.department_id = :departmentId', { departmentId: department_id })
    .andWhere('LOWER(status.status_name) = LOWER(:statusName)', { statusName })
    .getCount();
}



}
