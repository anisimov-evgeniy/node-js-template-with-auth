import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Partial<User>) {
    const payload = {
      username: user.email,
      sub: user.id,
      roles: user?.roles ?? [],
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' }); // Access token на 1 час
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // Refresh token на 7 дней
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // todo: edit для чилдов, активностей + регистрация (с возможностью зайти через соц сети)

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken); // Проверяем refresh token
      const user = await this.userService.findOne(decoded.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const payload = { username: user.email, sub: user.id, roles: user.roles };
      const newAccessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
      return {
        access_token: newAccessToken,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
