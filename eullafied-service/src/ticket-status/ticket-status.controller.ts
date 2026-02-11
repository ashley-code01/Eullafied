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
import { TicketStatus } from './entities/ticket-status.entity';
import { CreateTicketStatusDto } from './dto/create-ticket-status.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { TicketStatusService } from './ticket-status.service';


@ApiTags('Ticket Statuses')
@ApiBearerAuth('access-token')
@Controller('api/ticket-status')
export class TicketStatusController {
  constructor(private readonly ticketStatusService: TicketStatusService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new TicketStatus' })
  @ApiBody({ type: CreateTicketStatusDto })
  @ApiOkResponse({ type: TicketStatus })
  async create(@Body() createTicketStatusDto: CreateTicketStatusDto): Promise<TicketStatus> {
    return this.ticketStatusService.create(createTicketStatusDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all TicketStatuses' })
  @ApiOkResponse({ type: [TicketStatus] })
  async findAll(): Promise<TicketStatus[]> {
    return this.ticketStatusService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Ticket Status by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the Ticket Status to retrieve',
  })
  @ApiOkResponse({ type: TicketStatus })
  async findOne(@Param('id') id: string): Promise<TicketStatus> {
    return this.ticketStatusService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Ticket Status by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the Ticket Status to update',
  })
  @ApiBody({ type: UpdateTicketStatusDto })
  @ApiOkResponse({ type: TicketStatus })
  async update(
    @Param('id') id: string,
    @Body() updateTicketStatusDto: UpdateTicketStatusDto,
  ): Promise<TicketStatus> {
    return this.ticketStatusService.update(id, updateTicketStatusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Ticket Status by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the Ticket Status to delete',
  })
  @ApiResponse({ status: 200, description: 'Ticket Status deleted', type: TicketStatus })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Ticket Status not found' })
  async remove(@Param('id') id: string): Promise<TicketStatus> {
    const ticketStatus = await this.ticketStatusService.findOne(id);
    if (!ticketStatus) {
      throw new NotFoundException('Ticket Status not found');
    }
    await this.ticketStatusService.remove(id);
    return ticketStatus;
  }

  @Get('name/:statusName')
  @ApiOperation({ summary: 'Get a Ticket Status by name' })
  @ApiParam({
    name: 'statusName',
    required: true,
    description: 'The name of the Ticket Status to retrieve (e.g., Approved)',
  })
  @ApiOkResponse({ type: TicketStatus })
  async findByStatusName(@Param('statusName') statusName: string): Promise<TicketStatus> {
    return this.ticketStatusService.findByStatusName(statusName);
  }

}
