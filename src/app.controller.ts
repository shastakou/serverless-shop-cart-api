import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { LocalAuthGuard, AuthService, BasicAuthGuard } from './auth';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Get(['', 'ping'])
  healthCheck() {
    return { message: "It's alive!" };
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user, 'basic');
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
