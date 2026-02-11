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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from './entities/role.entity';

@ApiTags('Roles')
@ApiBearerAuth('access-token')
@Controller('api/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Role' })
  @ApiBody({ type: CreateRoleDto })
  @ApiOkResponse({ type: Role })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Roles' })
  @ApiOkResponse({ type: [Role] })
  async findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Role by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the Role to retrieve',
  })
  @ApiOkResponse({ type: Role })
  async findOne(@Param('id') id: string): Promise<Role> {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Role by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the Role to update',
  })
  @ApiBody({ type: UpdateRoleDto })
  @ApiOkResponse({ type: Role })
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Role by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the Role to delete',
  })

  @ApiResponse({ status: 200, description: 'Role deleted', type: Role })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async remove(@Param('id') id: string): Promise<Role> {
    const role = await this.roleService.findOne(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    await this.roleService.remove(id);
    return role;
  }
  
}
