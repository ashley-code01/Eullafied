
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketStatusDto } from './dto/create-ticket-status.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { TicketStatus } from './entities/ticket-status.entity';

@Injectable()
export class TicketStatusService {
  constructor(
    @InjectRepository(TicketStatus)
    private readonly ticketStatusRepository: Repository<TicketStatus>,
  ) {}

  async create(createTicketStatusDto: CreateTicketStatusDto): Promise<TicketStatus> {
    const ticketStatus = this.ticketStatusRepository.create(createTicketStatusDto);
    return this.ticketStatusRepository.save(ticketStatus);
  }

  async findAll(): Promise<TicketStatus[]> {
    return this.ticketStatusRepository.find();
  }

  async findOne(id: string): Promise<TicketStatus> {
    const ticketStatus = await this.ticketStatusRepository.findOne({ where: { status_id: id } });
    if (!ticketStatus) {
      throw new NotFoundException(`TicketStatus with ID ${id} not found`);
    }
    return ticketStatus;
  }

  async update(id: string, updateTicketStatusDto: UpdateTicketStatusDto): Promise<TicketStatus> {
    const ticketStatus = await this.findOne(id);
    Object.assign(TicketStatus, updateTicketStatusDto);
    return this.ticketStatusRepository.save(ticketStatus);
  }

  async remove(id: string): Promise<TicketStatus> {
    const ticketStatus = await this.findOne(id);
    await this.ticketStatusRepository.remove(ticketStatus);
    return ticketStatus;
  }

  async findByStatusName(statusName: string): Promise<TicketStatus> {
    const ticketStatus = await this.ticketStatusRepository.findOne({ 
      where: { status_name: statusName } 
    });
    if (!ticketStatus) {
      throw new NotFoundException(`Status with name '${statusName}' not found`);
    }
    return ticketStatus;
  }

  
}
