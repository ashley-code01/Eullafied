// // import { Module } from '@nestjs/common';
// // import { AuthController } from './auth.controller';
// // import { UserModule } from 'src/user/user.module';
// // import { AuthService } from './auth.service';
// // import { LocalStrategy } from './local.strategy';
// // import { PassportModule } from '@nestjs/passport';
// // import { JwtModule } from '@nestjs/jwt';
// // import { jwtConstants } from './auth.constant';
// // import { JwtStrategy } from './jwt.strategy';

// // @Module({

// //     controllers:[AuthController],
// //     imports:[UserModule,PassportModule,JwtModule.register({
// //         global: true,
// //         secret: jwtConstants.secret,
// //         signOptions: { expiresIn: '3600s' },
// //     })],
// //     providers: [AuthService, LocalStrategy,JwtStrategy],

// // })
// // export class AuthModule {}

// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { UserModule } from 'src/user/user.module';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { jwtConstants } from './auth.constant';
// import { JwtStrategy } from './jwt.strategy';

// @Module({
//   imports: [
//     UserModule,
//     PassportModule,
//     JwtModule.register({
//       secret: jwtConstants.secret,
//       signOptions: { expiresIn: jwtConstants.expiresIn },
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, JwtStrategy],
//   exports: [AuthService],
// })
// export class AuthModule {}
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './auth.constant';
import { JwtStrategy } from './jwt.strategy';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    UserModule,
    MailModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}