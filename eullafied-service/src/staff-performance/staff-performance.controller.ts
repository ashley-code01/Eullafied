// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   NotFoundException,
// } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiBody, ApiOkResponse, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
// import { CreateStaffPerformanceDto } from './dto/create-staff-performance.dto';
// import { StaffPerformanceCounter } from './entities/staff-performance.entity';
// import { UpdateStaffPerformanceDto } from './dto/update-staff-performance.dto';
// import { StaffPerformanceService } from './staff-performance.service';

// @ApiTags('Staff Performance Counter')
// @ApiBearerAuth('access-token')
// @Controller('api/staff-performance-counter')
// export class StaffPerformanceController {
//   constructor(private readonly counterService: StaffPerformanceService) {}

//   @Post()
//   @ApiOperation({ summary: 'Create a new Staff Performance Counter' })
//   @ApiBody({ type: CreateStaffPerformanceDto })
//   @ApiOkResponse({ type: StaffPerformanceCounter })
//   async create(
//     @Body() createDto: CreateStaffPerformanceDto,
//   ): Promise<StaffPerformanceCounter> {
//     return this.counterService.create(createDto);
//   }

//   @Get()
//   @ApiOperation({ summary: 'Get all Staff Performance Counters' })
//   @ApiOkResponse({ type: [StaffPerformanceCounter] })
//   async findAll(): Promise<StaffPerformanceCounter[]> {
//     return this.counterService.findAll();
//   }

//   @Get(':user_id/:metric_date')
//   @ApiOperation({ summary: 'Get a Staff Performance Counter by user and date' })
//   @ApiParam({ name: 'user_id', description: 'UUID of the user' })
//   @ApiParam({ name: 'metric_date', description: 'Metric date in YYYY-MM-DD format' })
//   @ApiOkResponse({ type: StaffPerformanceCounter })
//   async findOne(
//     @Param('user_id') user_id: string,
//     @Param('metric_date') metric_date: string,
//   ): Promise<StaffPerformanceCounter> {
//     return this.counterService.findOne(user_id, metric_date);
//   }

//   @Patch(':user_id/:metric_date')
//   @ApiOperation({ summary: 'Update a Staff Performance Counter by user and date' })
//   @ApiParam({ name: 'user_id', description: 'UUID of the user' })
//   @ApiParam({ name: 'metric_date', description: 'Metric date in YYYY-MM-DD format' })
//   @ApiBody({ type: UpdateStaffPerformanceDto })
//   @ApiOkResponse({ type: StaffPerformanceCounter })
//   async update(
//     @Param('user_id') user_id: string,
//     @Param('metric_date') metric_date: string,
//     @Body() updateDto: UpdateStaffPerformanceDto,
//   ): Promise<StaffPerformanceCounter> {
//     return this.counterService.update(user_id, metric_date, updateDto);
//   }

//   @Delete(':user_id/:metric_date')
//   @ApiOperation({ summary: 'Delete a Staff Performance Counter by user and date' })
//   @ApiParam({ name: 'user_id', description: 'UUID of the user' })
//   @ApiParam({ name: 'metric_date', description: 'Metric date in YYYY-MM-DD format' })
//   @ApiResponse({ status: 200, description: 'Counter deleted', type: StaffPerformanceCounter })
//   @ApiResponse({ status: 404, description: 'Counter not found' })
//   async remove(
//     @Param('user_id') user_id: string,
//     @Param('metric_date') metric_date: string,
//   ): Promise<StaffPerformanceCounter> {
//     const counter = await this.counterService.findOne(user_id, metric_date);
//     if (!counter) {
//       throw new NotFoundException(`Counter for user ${user_id} on ${metric_date} not found`);
//     }
//     await this.counterService.remove(user_id, metric_date);
//     return counter;
//   }

//   @Get('user/:user_id')
//   @ApiOperation({ summary: 'Find Staff Performance Counters by User ID' })
//   @ApiParam({ name: 'user_id', required: true, description: 'The ID of the User' })
//   @ApiResponse({ status: 200, description: 'List of performance counters for the user', type: [StaffPerformanceCounter] })
//   @ApiResponse({ status: 404, description: 'No performance counters found for the given user ID' })
//   async findByUser(@Param('user_id') userId: string): Promise<StaffPerformanceCounter[]> {
//     return await this.counterService.findByUserId(userId);
//   }
// }
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { StaffPerformanceService } from './staff-performance.service';
import { CreateStaffPerformanceDto } from './dto/create-staff-performance.dto';
import { UpdateStaffPerformanceDto } from './dto/update-staff-performance.dto';

@ApiTags('Staff Performance Counter')
@ApiBearerAuth('access-token')
@Controller('api/staff-performance-counter')
export class StaffPerformanceController {
  constructor(private readonly staffPerformanceService: StaffPerformanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Staff Performance Counter' })
  @ApiResponse({ status: 200, description: 'Performance counter created successfully' })
  create(@Body() createStaffPerformanceDto: CreateStaffPerformanceDto) {
    // This would typically not be used since metrics are auto-generated
    // But keeping for manual entry if needed
    return this.staffPerformanceService.create(createStaffPerformanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Staff Performance Counters' })
  @ApiResponse({ status: 200, description: 'List of all performance counters' })
  findAll() {
    return this.staffPerformanceService.findAll();
  }

  @Get('user/:user_id')
  @ApiOperation({ summary: 'Get all performance metrics for a specific user' })
  @ApiParam({ name: 'user_id', description: 'UUID of the user' })
  @ApiResponse({
    status: 200,
    description: 'List of performance counters for the user',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findByUser(@Param('user_id') userId: string) {
    return this.staffPerformanceService.findByUser(userId);
  }

  @Get('user/:user_id/current-week')
  @ApiOperation({ summary: 'Get current week performance for a specific user' })
  @ApiParam({ name: 'user_id', description: 'UUID of the user' })
  @ApiResponse({
    status: 200,
    description: 'Current week performance metrics',
  })
  @ApiResponse({ status: 404, description: 'No data found for current week' })
  getCurrentWeekPerformance(@Param('user_id') userId: string) {
    return this.staffPerformanceService.getCurrentWeekPerformance(userId);
  }

  @Get('user/:user_id/date-range')
  @ApiOperation({ summary: 'Get performance metrics within a date range' })
  @ApiParam({ name: 'user_id', description: 'UUID of the user' })
  @ApiQuery({
    name: 'start_date',
    description: 'Start date in YYYY-MM-DD format',
    required: true,
  })
  @ApiQuery({
    name: 'end_date',
    description: 'End date in YYYY-MM-DD format',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of performance counters within date range',
  })
  findByUserAndDateRange(
    @Param('user_id') userId: string,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ) {
    return this.staffPerformanceService.findByUserAndDateRange(
      userId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('top-performers')
  @ApiOperation({ summary: 'Get top performing staff for current week' })
  @ApiQuery({
    name: 'limit',
    description: 'Number of top performers to return',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'List of top performing staff members',
  })
  getTopPerformers(@Query('limit') limit?: number) {
    return this.staffPerformanceService.getTopPerformers(limit || 10);
  }

  @Get(':user_id/:metric_date')
  @ApiOperation({ summary: 'Get a Staff Performance Counter by user and date' })
  @ApiParam({ name: 'user_id', description: 'UUID of the user' })
  @ApiParam({
    name: 'metric_date',
    description: 'Metric date in YYYY-MM-DD format',
  })
  @ApiResponse({
    status: 200,
    description: 'Performance counter retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Performance counter not found' })
  findOne(
    @Param('user_id') userId: string,
    @Param('metric_date') metricDate: string,
  ) {
    return this.staffPerformanceService.findOne(userId, metricDate);
  }

  @Patch(':user_id/:metric_date')
  @ApiOperation({ summary: 'Update a Staff Performance Counter by user and date' })
  @ApiParam({ name: 'user_id', description: 'UUID of the user' })
  @ApiParam({
    name: 'metric_date',
    description: 'Metric date in YYYY-MM-DD format',
  })
  @ApiResponse({
    status: 200,
    description: 'Performance counter updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Performance counter not found' })
  update(
    @Param('user_id') userId: string,
    @Param('metric_date') metricDate: string,
    @Body() updateStaffPerformanceDto: UpdateStaffPerformanceDto,
  ) {
    return this.staffPerformanceService.update(
      userId,
      metricDate,
      updateStaffPerformanceDto,
    );
  }

  @Delete(':user_id/:metric_date')
  @ApiOperation({ summary: 'Delete a Staff Performance Counter by user and date' })
  @ApiParam({ name: 'user_id', description: 'UUID of the user' })
  @ApiParam({
    name: 'metric_date',
    description: 'Metric date in YYYY-MM-DD format',
  })
  @ApiResponse({ status: 200, description: 'Counter deleted' })
  @ApiResponse({ status: 404, description: 'Counter not found' })
  remove(
    @Param('user_id') userId: string,
    @Param('metric_date') metricDate: string,
  ) {
    return this.staffPerformanceService.remove(userId, metricDate);
  }

  @Post('recalculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Manually trigger recalculation of current week metrics',
  })
  @ApiResponse({
    status: 200,
    description: 'Recalculation triggered successfully',
  })
  async recalculateCurrentWeek() {
    await this.staffPerformanceService.recalculateCurrentWeek();
    return {
      message: 'Current week metrics recalculated successfully',
      timestamp: new Date().toISOString(),
    };
  }
}