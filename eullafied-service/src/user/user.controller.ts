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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { Public } from 'src/auth/public.decorator';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Post()
  @ApiOperation({ summary: 'Create a new User' })
  @ApiOkResponse({ type: User })
  @Public()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Users' })
  @ApiOkResponse({ type: [User] })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a User by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the User to retrieve',
  })
  @ApiOkResponse({ type: User })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a User by ID' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the User to update' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: User })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a User by ID' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the User to delete' })
  @ApiResponse({ status: 200, description: 'User deleted', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userService.remove(id);
    return user;
  }

  @Get('department/:id')
  @ApiOperation({ summary: 'Find Users by Department ID' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the Department' })
  @ApiResponse({ status: 200, description: 'List of users in the department', type: [User] })
  @ApiResponse({ status: 404, description: 'No users found for the given department ID' })
  async findByDepartment(@Param('id') departmentId: string): Promise<User[]> {
    return await this.userService.findByDepartmentId(departmentId);
  }

  @Get('department/name/:name')
  @ApiOperation({ summary: 'Find Users by Department Name' })
  @ApiParam({ name: 'name', required: true, description: 'The name of the Department' })
  @ApiResponse({ status: 200, description: 'List of users in the department', type: [User] })
  @ApiResponse({ status: 404, description: 'No users found for the given department name' })
  async findByDepartmentName(@Param('name') departmentName: string): Promise<User[]> {
    return await this.userService.findUsersByDepartmentName(departmentName);
  }


}
