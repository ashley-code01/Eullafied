
// import { Controller, Post, Body } from '@nestjs/common';
// import { ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
// import { AuthService } from './auth.service';
// import { LoginDto } from './dto/login.dto';
// import { Public } from './public.decorator';

// @ApiTags('Auth')
// @Controller('api/auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('login')
//   @Public()
//   @ApiOperation({ summary: 'Login to access the system' })
//   @ApiBody({ type: LoginDto })
//   async login(@Body() loginDto: LoginDto) {
//     console.log('Login DTO:', loginDto);
//     const { email, password } = loginDto;
//     return this.authService.login(email, password);
//   }
// }
// auth/auth.controller.ts


import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';
import { ForgotPasswordDto } from './dto/forget-password.dto';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login to access the system' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    console.log('Login DTO:', loginDto);
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  @Post('forgot-password')
  @Public()
  @ApiOperation({ summary: 'Reset password and send new password via email' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ 
    status: 200, 
    description: 'New password sent to email',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }
}