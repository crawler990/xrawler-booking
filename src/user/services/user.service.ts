import { HttpException, HttpStatus, Injectable, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AuthService } from 'src/user/services/auth.service';
import { User } from '../../models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private authService: AuthService,
  ) {}

  async login(credentials: {emailorusername: string, password: string}){
    if (!credentials.emailorusername || !credentials.password) {
      throw new HttpException('Please provide a username or email, and a password to continue', HttpStatus.BAD_REQUEST);
    }
    const userFromDb = await this.userModel.findOne({$or: [
      { email: credentials.emailorusername },
      { username: credentials.emailorusername }
    ]});
    
    if(!userFromDb) throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    const result = await bcrypt.compare(credentials.password, userFromDb.password);
    if (result) return await this.authService.login(userFromDb);
    else throw new HttpException('Please check the credentials provided.', HttpStatus.UNAUTHORIZED);
  }

  async createUserAccount(user: { email: string; password: string, username: string }){
    if (!user.email || !user.password || !user.username) {
      throw new HttpException('Please provide a username, email, and a password to create an account', HttpStatus.BAD_REQUEST);
    }
    if (!(user.password.length >= 6)) throw new HttpException('Please provide a strong password, minimum of six (6) charachters.', HttpStatus.BAD_REQUEST);

    const userFromDb = await this.userModel.findOne({$or: [
      { email: user.email },
      { username: user.username }
    ]});

    if (userFromDb) {
      const field = userFromDb.email === user.email? 'email' : 'username';
      throw new HttpException( `User with given ${field} already exists`, HttpStatus.BAD_REQUEST);
    }
    else {    
    const newUser = await new this.userModel({
      username: user.username,
      email: user.email,
      password: await bcrypt.hash(user.password, 12),
    }).save();

    return await this.authService.login(newUser);
    }
  }

  async getUserProfile(userId){
    return await this.userModel.findById(userId);
  }

  async updateProfile(userId, update){
    return await this.userModel.findByIdAndUpdate(userId, update, {new: true})
  }

}