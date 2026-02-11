import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTicketPriorityDto } from './dto/create-ticket-priority.dto';
import { UpdateTicketPriorityDto } from './dto/update-ticket-priority.dto';
import { TicketPriority } from './entities/ticket-priority.entity';
import { TicketPriorityService } from './ticket-priority.service';

@ApiTags('Ticket Priorities')
@ApiBearerAuth('access-token')
@Controller('api/ticket-priorities')
export class TicketPriorityController {
  constructor(private readonly ticketPriorityService: TicketPriorityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Ticket Priority' })
  @ApiBody({ type: CreateTicketPriorityDto })
  @ApiOkResponse({ type: TicketPriority })
  async create(
    @Body() createTicketPriorityDto: CreateTicketPriorityDto,
  ): Promise<TicketPriority> {
    return this.ticketPriorityService.create(createTicketPriorityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Ticket Priorities' })
  @ApiOkResponse({ type: [TicketPriority] })
  async findAll(): Promise<TicketPriority[]> {
    return this.ticketPriorityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Ticket Priority by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the Ticket Priority to retrieve',
  })
  @ApiOkResponse({ type: TicketPriority })
  async findOne(@Param('id') id: string): Promise<TicketPriority> {
    return this.ticketPriorityService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Ticket Priority by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the Ticket Priority to update',
  })
  @ApiBody({ type: UpdateTicketPriorityDto })
  @ApiOkResponse({ type: TicketPriority })
  async update(
    @Param('id') id: string,
    @Body() updateTicketPriorityDto: UpdateTicketPriorityDto,
  ): Promise<TicketPriority> {
    return this.ticketPriorityService.update(id, updateTicketPriorityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Ticket Priority by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the Ticket Priority to delete',
  })
  @ApiResponse({ status: 200, description: 'Ticket Priority deleted', type: TicketPriority })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Ticket Priority not found' })
  async remove(@Param('id') id: string): Promise<TicketPriority> {
    const priority = await this.ticketPriorityService.findOne(id);
    if (!priority) {
      throw new NotFoundException('Ticket Priority not found');
    }
    await this.ticketPriorityService.remove(id);
    return priority;
  }
}
