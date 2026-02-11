import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { AppController } from "src/app.controller";
import { AppService } from "src/app.service";
import { DepartmentModule } from "src/department/department.module";
import { RoleModule } from "src/role/role.module";
import { UserModule } from "src/user/user.module";



export default class TypeOrmConfig {

  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: configService.get<string>('DB_HOST'),      
      port: configService.get<number>('DB_PORT'),      
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      entities: ['dist/**/*.entity.js'],
      synchronize: true

    };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {

  imports: [ConfigModule],

  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),

  inject: [ConfigService]

};