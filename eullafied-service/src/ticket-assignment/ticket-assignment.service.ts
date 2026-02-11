import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketAssignment } from './entities/ticket-assignment.entity';
import { User } from 'src/user/entities/user.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { CreateTicketAssignmentDto } from './dto/create-ticket-assignment.dto';
import { UpdateTicketAssignmentDto } from './dto/update-ticket-assignment.dto';

@Injectable()
export class TicketAssignmentService {
  constructor(
    @InjectRepository(TicketAssignment)
    private readonly assignmentRepository: Repository<TicketAssignment>,

    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createDto: CreateTicketAssignmentDto): Promise<TicketAssignment> {
    const ticket = await this.ticketRepository.findOne({
      where: { ticket_id: createDto.ticket_id },
    });
    if (!ticket) throw new NotFoundException(`Ticket ${createDto.ticket_id} not found`);

    const assigned_to = await this.userRepository.findOne({
      where: { user_id: createDto.assigned_to },
    });
    if (!assigned_to)
      throw new NotFoundException(`User ${createDto.assigned_to} not found`);

    const assignment = this.assignmentRepository.create({
      ticket,
      assigned_to,
      assignment_reason: createDto.assignment_reason,
    });

    return this.assignmentRepository.save(assignment);
  }

  async findAll(): Promise<TicketAssignment[]> {
    return this.assignmentRepository.find({
      relations: {
        assigned_to: true,
        ticket: true,
      },
    });
  }

  async findOne(id: string): Promise<TicketAssignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { assignment_id: id },
      relations: {
        assigned_to: true,
        ticket: true,
      },
    });
    if (!assignment) throw new NotFoundException(`Assignment ${id} not found`);
    return assignment;
  }


  async update(id: string, updateDto: UpdateTicketAssignmentDto): Promise<TicketAssignment> {
    const assignment = await this.assignmentRepository.findOne({ where: { assignment_id: id } });
    if (!assignment) throw new NotFoundException(`Assignment ${id} not found`);

    // Update ticket if provided
    if (updateDto.ticket_id) {
      const ticket = await this.ticketRepository.findOne({
        where: { ticket_id: updateDto.ticket_id },
      });
      if (!ticket) throw new NotFoundException(`Ticket ${updateDto.ticket_id} not found`);
      assignment.ticket = ticket;
    }

    // Update assigned_to if provided
    if (updateDto.assigned_to) {
      const user = await this.userRepository.findOne({
        where: { user_id: updateDto.assigned_to },
      });
      if (!user) throw new NotFoundException(`User ${updateDto.assigned_to} not found`);
      assignment.assigned_to = user;
    }

    // Update optional reason
    if (updateDto.assignment_reason !== undefined) {
      assignment.assignment_reason = updateDto.assignment_reason;
    }

    // Save will automatically update `updated_at`
    return this.assignmentRepository.save(assignment);
  }

  // Soft remove (mark unassigned)
  async remove(id: string): Promise<TicketAssignment> {
    const assignment = await this.assignmentRepository.findOne({ where: { assignment_id: id } });
    if (!assignment) throw new NotFoundException(`Assignment ${id} not found`);

    assignment.unassigned_at = new Date();

    // Save will automatically update `updated_at`
    return this.assignmentRepository.save(assignment);
  }

  // async findByUserId(user_id: string): Promise<TicketAssignment[]> {
  //   const user = await this.userRepository.findOne({ where: { user_id } });
  //   if (!user) throw new NotFoundException(`User ${user_id} not found`);

  //   return this.assignmentRepository.find({
  //     where: { assigned_to: { user_id } },
  //     relations: ['ticket', 'assigned_to'],
  //   });
  // }

  async findByUserId(user_id: string): Promise<TicketAssignment[]> {
    const user = await this.userRepository.findOne({ where: { user_id } });
    if (!user) throw new NotFoundException(`User ${user_id} not found`);

    return this.assignmentRepository.find({
      where: { assigned_to: { user_id } },
      relations: {
        assigned_to: true,
        ticket: {
          requester: true,
          department: true,
          category: true,
          priority: true,
          status: true,
          manager: true,
          assignments: true,
        },
      },
    });
  }

  // add full service method that finds assignments by assignment id and has string parameter of message unassigned  and  sets the unassigned_at to current date and reason to unassigned message
  async unassignTicket(assignment_id: string, message: string): Promise<TicketAssignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { assignment_id },
      relations: {
        assigned_to: true,
        ticket: true,
      },
    });
    if (!assignment) throw new NotFoundException(`Assignment ${assignment_id} not found`);

    assignment.unassigned_at = new Date();
    assignment.assignment_reason = message;

    return this.assignmentRepository.save(assignment);
  }
}