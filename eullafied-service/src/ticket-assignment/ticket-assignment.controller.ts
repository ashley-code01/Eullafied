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
import { TicketAssignmentService } from './ticket-assignment.service';
import { CreateTicketAssignmentDto } from './dto/create-ticket-assignment.dto';
import { UpdateTicketAssignmentDto } from './dto/update-ticket-assignment.dto';
import { TicketAssignment } from './entities/ticket-assignment.entity';

@ApiTags('Ticket Assignments')
@ApiBearerAuth('access-token')
@Controller('api/ticket-assignment')
export class TicketAssignmentController {
  constructor(private readonly assignmentService: TicketAssignmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Ticket Assignment' })
  @ApiBody({ type: CreateTicketAssignmentDto })
  @ApiOkResponse({ type: TicketAssignment })
  async create(
    @Body() createDto: CreateTicketAssignmentDto,
  ): Promise<TicketAssignment> {
    return this.assignmentService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Ticket Assignments' })
  @ApiOkResponse({ type: [TicketAssignment] })
  async findAll(): Promise<TicketAssignment[]> {
    return this.assignmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Ticket Assignment by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the Ticket Assignment to retrieve',
  })
  @ApiOkResponse({ type: TicketAssignment })
  async findOne(@Param('id') id: string): Promise<TicketAssignment> {
    return this.assignmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Ticket Assignment by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the Ticket Assignment to update',
  })
  @ApiBody({ type: UpdateTicketAssignmentDto })
  @ApiOkResponse({ type: TicketAssignment })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTicketAssignmentDto,
  ): Promise<TicketAssignment> {
    return this.assignmentService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft remove (unassign) a Ticket Assignment by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the Ticket Assignment to remove',
  })
  @ApiResponse({ status: 200, description: 'Assignment unassigned', type: TicketAssignment })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  async remove(@Param('id') id: string): Promise<TicketAssignment> {
    const assignment = await this.assignmentService.findOne(id);
    if (!assignment) throw new NotFoundException('Assignment not found');
    return this.assignmentService.remove(id);
  }

  @Get('user/:user_id')
  @ApiOperation({ summary: 'Get all ticket assignments for a specific user' })
  @ApiParam({ name: 'user_id', description: 'User ID to filter assignments' })
  @ApiResponse({
    status: 200,
    description: 'List of ticket assignments for the specified user',
    type: [TicketAssignment],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByUser(@Param('user_id') user_id: string): Promise<TicketAssignment[]> {
    return this.assignmentService.findByUserId(user_id);
  }

  @Post('unassign/:assignment_id')
  @ApiOperation({ summary: 'Unassign a ticket with a reason' })
  @ApiParam({ name: 'assignment_id', description: 'The ID of the assignment to unassign' })
  @ApiBody({ type: String, description: 'Reason for unassignment' })
  @ApiOkResponse({ type: TicketAssignment })
  async unassignTicket(
    @Param('assignment_id') assignment_id: string,
    @Body() message: string,
  ): Promise<TicketAssignment> {
    return this.assignmentService.unassignTicket(assignment_id, message);
  }
}