import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTicketPriorityDto } from 'src/ticket-priority/dto/create-ticket-priority.dto';
import { UpdateTicketPriorityDto } from 'src/ticket-priority/dto/update-ticket-priority.dto';
import { TicketPriority } from 'src/ticket-priority/entities/ticket-priority.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketPriorityService {
  constructor(
    @InjectRepository(TicketPriority)
    private readonly ticketPriorityRepository: Repository<TicketPriority>,
  ) {}

  async create(
    createTicketPriorityDto: CreateTicketPriorityDto,
  ): Promise<TicketPriority> {
    const priority = this.ticketPriorityRepository.create(
      createTicketPriorityDto,
    );
    return this.ticketPriorityRepository.save(priority);
  }

  async findAll(): Promise<TicketPriority[]> {
    return this.ticketPriorityRepository.find();
  }

  async findOne(id: string): Promise<TicketPriority> {
    const priority = await this.ticketPriorityRepository.findOne({
      where: { priority_id: id },
    });
    if (!priority) {
      throw new NotFoundException(`Ticket Priority with ID ${id} not found`);
    }
    return priority;
  }

  async update(
    id: string,
    updateTicketPriorityDto: UpdateTicketPriorityDto,
  ): Promise<TicketPriority> {
    const priority = await this.findOne(id);
    Object.assign(priority, updateTicketPriorityDto);
    return this.ticketPriorityRepository.save(priority);
  }

  async remove(id: string): Promise<TicketPriority> {
    const priority = await this.findOne(id);
    await this.ticketPriorityRepository.remove(priority);
    return priority;
  }
}
