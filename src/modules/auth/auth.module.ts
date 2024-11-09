import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module'; // Подключение UserModule для работы с пользователями
import { JwtStrategy } from './jwt/jwt.strategy';
import { LocalStrategy } from './local/local.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule, // Импорт модуля пользователей
    PassportModule.register({ defaultStrategy: 'jwt' }), // Указание стратегии по умолчанию
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'defaultSecret', // Замените 'defaultSecret' в продакшене на более сложный ключ
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
