import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { GetUser } from 'src/common/user.decorator';
import { User } from 'src/models/user.model';

@Controller('user')
export class UserController {
  constructor(private userservice: UserService) {}

  @Get('profile')
  async getUserProfile(@GetUser() userId){
    return await this.userservice.getUserProfile(userId);
  }

  @Post('profile')
  async updateProfile(@GetUser()userId, @Body()update: Partial<User>){
    return await this.userservice.updateProfile(userId, update)
  }
}

