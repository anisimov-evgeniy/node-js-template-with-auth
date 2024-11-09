import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'defaultSecret', // Используйте переменную окружения для безопасности
    });
  }

  async validate(payload: any) {
    // Здесь вы можете добавить дополнительные проверки, например, проверку, существует ли пользователь в базе данных
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid JWT token');
    }

    // Верните нужную информацию о пользователе для дальнейшего использования
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
