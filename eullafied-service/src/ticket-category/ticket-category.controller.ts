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
import { TicketCategoryService } from './ticket-category.service';
import { CreateTicketCategoryDto } from './dto/create-ticket-category.dto';
import { TicketCategory } from './entities/ticket-category.entity';
import { UpdateTicketCategoryDto } from './dto/update-ticket-category.dto';


@ApiTags('Ticket Categories')
@ApiBearerAuth('access-token')
@Controller('api/ticket-category')
export class TicketCategoryController {
  constructor(private readonly ticketCategoryService: TicketCategoryService) {}

  @Post()
  @Post()
    @ApiOperation({ summary: 'Create a new Ticket Category' })
    @ApiBody({ type: CreateTicketCategoryDto })
    @ApiOkResponse({ type: TicketCategory })
  create(@Body() createTicketCategoryDto: CreateTicketCategoryDto) {
    return this.ticketCategoryService.create(createTicketCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Ticket Categories' })
  @ApiOkResponse({ type: [TicketCategory] })
  async findAll(): Promise<TicketCategory[]> {
    return this.ticketCategoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Ticket Category by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the Ticket Category to retrieve',
  })
  @ApiOkResponse({ type: TicketCategory })
  async findOne(@Param('id') id: string): Promise<TicketCategory> {
    return this.ticketCategoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Ticket Category by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the Ticket Category to update',
  })
  @ApiBody({ type: UpdateTicketCategoryDto })
  @ApiOkResponse({ type: TicketCategory })
  async update(
    @Param('id') id: string,
    @Body() updateTicketCategoryDto: UpdateTicketCategoryDto,
  ): Promise<TicketCategory> {
    return this.ticketCategoryService.update(id, UpdateTicketCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Ticket Category by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the Ticket Category to delete',
  })
  @ApiResponse({ status: 200, description: 'Ticket Category deleted', type: TicketCategory })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Ticket Category not found' })
  async remove(@Param('id') id: string): Promise<TicketCategory> {
    const ticketCategory = await this.ticketCategoryService.findOne(id);
    if (!ticketCategory) {
      throw new NotFoundException('Ticket Category not found');
    }
    await this.ticketCategoryService.remove(id);
    return ticketCategory;
  }
  
}
