import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ChildModule } from './modules/child/child.module';
import { User } from './modules/user/user.entity';
import { Child } from './modules/child/child.entity';
import { ActivityRecordModule } from './modules/activityRecord/activity-record.module';
import { ActivityRecord } from './modules/activityRecord/activity-record.entity';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
import { JwtAuthGuard } from './modules/auth/jwt/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, AuthModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Child, ActivityRecord],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    TerminusModule,
    AuthModule,
    UserModule,
    ChildModule,
    ActivityRecordModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Применение глобального JwtAuthGuard
    },
  ],
})
export class AppModule {}
