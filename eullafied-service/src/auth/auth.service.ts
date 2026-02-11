import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role', 'department'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.isLocked()) {
      const minutesLeft = Math.ceil(
        (user.locked_until.getTime() - Date.now()) / 60000,
      );
      throw new UnauthorizedException(
        `Account locked. Try again in ${minutesLeft} minutes`,
      );
    }

    // Check if account is active
    if (!user.is_active) {
      throw new UnauthorizedException('Account is disabled');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      // Increment failed login attempts
      await this.handleFailedLogin(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed attempts on successful login
    await this.handleSuccessfulLogin(user);

    const { password_hash, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = {
      sub: user.user_id,
      email: user.email,
      role: user.role.role_name,
      department: user.department.department_name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        role: user.role.role_name,
        department: user.department.department_name,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
    );

    // Create user
    const user = this.userRepository.create({
      email: registerDto.email,
      password_hash: hashedPassword,
      name: registerDto.name,
      surname: registerDto.surname,
      role_id: registerDto.role_id,
      department_id: registerDto.department_id,
      is_active: true,
      email_verified: false,
    });

    await this.userRepository.save(user);

    const { password_hash, ...result } = user;
    return result;
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      parseInt(process.env.BCRYPT_ROUNDS, 10) || 12, // issue to be resolved
    );

    // Update password
    user.password_hash = hashedPassword;
    user.password_changed_at = new Date();

    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }

  private async handleFailedLogin(user: User) {
    user.failed_login_attempts += 1;

    const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS, 10) || 5;

    if (user.failed_login_attempts >= maxAttempts) {
      const lockTimeMinutes = parseInt(process.env.LOCK_TIME_MINUTES, 10) || 30;
      user.locked_until = new Date(Date.now() + lockTimeMinutes * 60000);
    }

    await this.userRepository.save(user);
  }

  private async handleSuccessfulLogin(user: User) {
    user.failed_login_attempts = 0;
    user.locked_until = null;
    user.last_login = new Date();
    await this.userRepository.save(user);
  }

  async validateToken(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: ['role', 'department'],
    });

    if (!user || !user.is_active) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }
}
