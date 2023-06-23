import { Body, Controller, Post } from '@nestjs/common';
import { User } from '../../models/user.model';
import { UserService } from '../services/user.service';

@Controller('user')
export class LoginController {
  constructor(private userservice: UserService) {}

  @Post('signup')
  async createAccount(@Body() user: User){
    return await this.userservice.createUserAccount(user);
  }

  @Post('login')
  async login(@Body() credentials: {emailorusername: string, password: string}){
    return await this.userservice.login(credentials);
  }
}

