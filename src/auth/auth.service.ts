import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './auth.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import * as bcrypt from 'bcrypt';
import { UnprocessableEntityException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForbiddenException } from '../common/forbidden-exception';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModal: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let user = await this.userModal.findOne({email: createUserDto.email});
    if(user){
      throw new ForbiddenException();
      // throw new UnprocessableEntityException('User Already Exists');
    }
    user = new this.userModal(createUserDto);
    // let user1 = createUserDto;
    const res = await user.save();
    return res;
  }

  async login(userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto;
    const user = await this.userModal.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User does not exists');
    }
    const isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnprocessableEntityException('Wrong Password');
    }
    if (user && isPasswordValid) {
      const payload = user.toJSON();
      const accessToken = this.jwtService.sign(payload);
      return accessToken;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let user = await this.userModal.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException('User does not exists');
    }
    user.name = updateUserDto.name;
    user.email = updateUserDto.email;
    let res = user.save();
    return res;
  }
}
