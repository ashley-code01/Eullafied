import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketCategory } from './entities/ticket-category.entity';
import { CreateTicketCategoryDto } from './dto/create-ticket-category.dto';
import { UpdateTicketCategoryDto } from './dto/update-ticket-category.dto';

@Injectable()
export class TicketCategoryService {
  constructor(
    @InjectRepository(TicketCategory)
    private readonly ticketCategoryRepository: Repository<TicketCategory>,
  ) {}  

  async create(createTicketCategoryDto: CreateTicketCategoryDto): Promise<TicketCategory> {
     const category = this.ticketCategoryRepository.create(createTicketCategoryDto);
    return this.ticketCategoryRepository.save(category);
  }

  async findAll(): Promise<TicketCategory[]> {
    return this.ticketCategoryRepository.find({
      relations: ['tickets'], // eager load tickets if needed
    });
  }

  async findOne(id: string): Promise<TicketCategory> {
    const category = await this.ticketCategoryRepository.findOne({
      where: { category_id: id },
      relations: ['tickets'],
    });

    if (!category) {
      throw new NotFoundException(`Ticket Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateTicketCategoryDto: UpdateTicketCategoryDto,
  ): Promise<TicketCategory> {
    const category = await this.findOne(id);
    Object.assign(category, updateTicketCategoryDto);
    return this.ticketCategoryRepository.save(category);
  }

  async remove(id: string): Promise<TicketCategory> {
    const category = await this.findOne(id);
    await this.ticketCategoryRepository.remove(category);
    return category;
  }
}
