import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { generateRandomPassword } from 'src/utils/password.util';

// @Injectable()
// export class AuthService {
//   constructor(
//     private readonly userService: UserService,
//     private readonly jwtService: JwtService,
//   ) {}

//   async login(email: string, password: string) {
//     const user = await this.userService.findByEmail(email);
//     if (!user) throw new UnauthorizedException('Invalid credentials');
//     if (!password || !user.password) {
//       throw new UnauthorizedException('Inserted password: ' + password + ' | Fetched Compare to password: ' + user.password);
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) throw new UnauthorizedException('Invalid Password');
//     const payload = { sub: user.user_id, email: user.email };
//     return {
//       access_token: this.jwtService.sign(payload),
//       user,
//     };
//   }

//   async validateUserById(userId: string) {
//     return this.userService.findOne(userId);
//   }

  
// }
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!password || !user.password) {
      throw new UnauthorizedException('Inserted password: ' + password + ' | Fetched Compare to password: ' + user.password);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid Password');
    const payload = { sub: user.user_id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async validateUserById(userId: string) {
    return this.userService.findOne(userId);
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    // Generate random password
    const newPassword = generateRandomPassword();

    // Update user password
    await this.userService.update(user.user_id, { password: newPassword });

    // Send email with new password
    await this.mailService.sendingPasswordReset(
      user.email,
      `${user.name} ${user.surname}`,
      newPassword,
    );

    return {
      message: 'A new password has been sent to your email',
    };
  }
}