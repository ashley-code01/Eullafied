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
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@ApiTags('Departments')
@ApiBearerAuth('access-token')
@Controller('api/department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Department' })
  @ApiBody({ type: CreateDepartmentDto })
  @ApiOkResponse({ type: Department })
  async create(@Body() createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    return this.departmentService.create(createDepartmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Departments' })
  @ApiOkResponse({ type: [Department] })
  async findAll(): Promise<Department[]> {
    return this.departmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Department by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the Department to retrieve',
  })
  @ApiOkResponse({ type: Department })
  async findOne(@Param('id') id: string): Promise<Department> {
    return this.departmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Department by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the Department to update',
  })
  @ApiBody({ type: UpdateDepartmentDto })
  @ApiOkResponse({ type: Department })
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Department by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the Department to delete',
  })
  
  @ApiResponse({ status: 200, description: 'Department deleted', type: Department })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async remove(@Param('id') id: string): Promise<Department> {
    const department = await this.departmentService.findOne(id);
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    await this.departmentService.remove(id);
    return department;
  }
  
}
