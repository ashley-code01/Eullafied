import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Delete,
  NotFoundException,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';

@ApiTags('Tickets')
@ApiBearerAuth('access-token')
@Controller('api/tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new Ticket' })
  @ApiBody({ type: CreateTicketDto })
  @ApiOkResponse({ type: Ticket })
  async create(@Body() createTicketDto: CreateTicketDto): Promise<Ticket> {
    return this.ticketService.create(createTicketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Tickets' })
  @ApiOkResponse({ type: [Ticket] })
  async findAll(): Promise<Ticket[]> {
    return this.ticketService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Ticket by ID' })
  @ApiParam({ name: 'id', required: true, description: 'The Ticket ID to retrieve' })
  @ApiOkResponse({ type: Ticket })
  async findOne(@Param('id') id: string): Promise<Ticket> {
    return this.ticketService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a Ticket by ID (PUT alternative)' })
  @ApiBody({ type: UpdateTicketDto })
  async putUpdate(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(id, updateTicketDto);
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Ticket by ID' })
  @ApiParam({ name: 'id', required: true, description: 'The Ticket ID to delete' })
  @ApiResponse({ status: 200, description: 'Ticket deleted', type: Ticket })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async remove(@Param('id') id: string): Promise<Ticket> {
    const ticket = await this.ticketService.findOne(id);
    if (!ticket) {
      throw new NotFoundException(`Ticket ${id} not found`);
    }
    await this.ticketService.remove(id);
    return ticket;
  }

  @Get('requester/:requester_id')//for employee dashboard
  @ApiOperation({ summary: 'Get all Tickets by Requester ID' })
  @ApiParam({ name: 'requester_id', required: true, description: 'The requester ID to filter tickets' })
  @ApiOkResponse({ type: [Ticket] })
  async findByRequester(@Param('requester_id') requester_id: string): Promise<Ticket[]> {
    return this.ticketService.findByRequester(requester_id);
  }

  @Get('department/:department_id')//for manger dashboard views tickets for approval
  @ApiOperation({ summary: 'Get all Tickets by Department ID' })
  @ApiParam({ name: 'department_id', required: true, description: 'The department ID to filter tickets' })
  @ApiOkResponse({ type: [Ticket] })
  async findByDepartment(@Param('department_id') department_id: string): Promise<Ticket[]> {
    return this.ticketService.findByDepartment(department_id);
  }

  @Get('department/:department_id/status/:status_id')//for manager dashboard filter tickets by status
  @ApiOperation({ summary: 'Get all Tickets by Department ID and Status ID' })
  @ApiParam({ name: 'department_id', required: true, description: 'The department ID to filter tickets' })
  @ApiParam({ name: 'status_id', required: true, description: 'The status ID to filter tickets' })
  @ApiOkResponse({ type: [Ticket] })
  async findByDepartmentAndStatus(
    @Param('department_id') department_id: string,
    @Param('status_id') status_id: string,
  ): Promise<Ticket[]> {
    return this.ticketService.findByDepartmentAndStatus(department_id, status_id);
  }

  @Get('status/:status_id')
  @ApiOperation({ summary: 'Get all Tickets by Status ID' })
  @ApiParam({ name: 'status_id', required: true, description: 'The status ID to filter tickets' })
  @ApiOkResponse({ type: [Ticket] })
  async findByStatus(@Param('status_id') status_id: string): Promise<Ticket[]> {
    return this.ticketService.findByStatus(status_id);
  }

  @Get('count')//for admin dashboard and IT dashboard
  @ApiOperation({ summary: 'Count all Tickets' })
  @ApiOkResponse({ type: Number })
  async countAll(): Promise<number> {
    return this.ticketService.countAll();
  }

  @Get('count/status/:status_id')//for admin dashboard and IT dashboard
  @ApiOperation({ summary: 'Count all Tickets by Status ID' })
  @ApiParam({ name: 'status_id', required: true, description: 'The status ID to filter tickets' })
  @ApiOkResponse({ type: Number })
  async countByStatus(@Param('status_id') status_id: string): Promise<number> {
    return this.ticketService.countByStatus(status_id);
  }

  @Get('count/department/:department_id/status/:status_name')//for manager dashboard
  @ApiOperation({ summary: 'Count Tickets by Department ID and Status ID' })
  @ApiParam({ name: 'department_id', required: true, description: 'The department ID to filter tickets' })
  @ApiParam({ name: 'status_name', required: true, description: 'The status name to filter tickets' })
  @ApiOkResponse({ type: Number })
  async countByDepartmentAndStatus(
    @Param('department_id') department_id: string,
    @Param('status_name') status_name: string,
  ): Promise<number> {
    return this.ticketService.countByDepartmentAndStatus(department_id, status_name);
  }



}
