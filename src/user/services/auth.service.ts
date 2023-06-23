import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../models/user.model';

@Injectable()
export class AuthService {
  constructor(private jwtservice: JwtService) {}
  async login(user: User) {

    const payload = {
      email: user.email,
      username: user.username,
      id: user._id
    };

    const access_token = this.jwtservice.sign(payload);
    return access_token ;
  }
}
