import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
// Import TypeORM to the application
import { TypeOrmModule } from '@nestjs/typeorm';
const cookieSession = require('cookie-session');

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { TypeOrmConfigService } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Import configmodule in global
      isGlobal: true,
      // Decide what .env file is read
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       type: 'sqlite',
    //       database: config.get<string>('DB_NAME'),
    //       entities: [User, Report],
    //       synchronize: true, // synchronize the database with entity (when entity add/remove a key, the database will be synced with)
    //     };
    //   },
    // }),
    // TypeOrmModule.forRoot({
    // type: 'sqlite', // Type of the database will be created
    // database: 'db.sqlite', // The file where store data
    // entities: [User, Report], // Connect entities to the root module
    // synchronize: true, // Run in development inviroment
    // }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // Whenever the request come to the app (APP_PIPE), apply validation pipe
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // Make sure don't have any extra properties in data (remove it)
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  // Whenever the app listen the request, configure function is called
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')], // random string to encrypt plain object into cookie
        }),
      )
      .forRoutes('*');
  }
}
