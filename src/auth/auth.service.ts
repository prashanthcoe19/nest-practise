import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './auth.model';
import { RefreshToken } from './token.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import * as bcrypt from 'bcrypt';
import { UnprocessableEntityException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForbiddenException } from '../common/forbidden-exception';
import { UserWithId } from './user.interface';
import { jwtConstants } from './constants';

import * as moment from "moment";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModal: Model<User>,
    @InjectModel('RefreshToken') private readonly refreshToken: Model<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserWithId> {
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

  async login(userLoginDto: UserLoginDto): Promise<Object> {
    try{
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
      await this.refreshToken.deleteMany({userId: user._id});
      const payload = {_id: user._id, email: user.email}
      const accessToken = this.jwtService.sign(payload);
      const token = new this.refreshToken({
        expiresAt: moment().add(10,'minutes'),
        userId: user._id
      });
      const savedToken = await token.save();
      const opts = {
        subject: String(user._id),
        jwtid: String(savedToken._id)
      }
      console.log(opts);
      const refreshToken = await this.jwtService.signAsync({...opts},{
        expiresIn: '10min'
      })
      console.log(refreshToken);
      const tokenId = savedToken._id;
      return {accessToken, refreshToken,tokenId, accessTokenExpiresIn:120};
    }
    }catch(err){
      console.log(err);
    }
  }

  async getProfile(id: string): Promise<UserWithId>{
     const user = await this.userModal.findById(id).select('-password');
     return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserWithId> {
    let user = await this.userModal.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException('User does not exists');
    }
    user.name = updateUserDto.name;
    user.email = updateUserDto.email;
    let res = user.save();
    return res;
  }

  private async generateTokens(payload: any, tokenId: string): Promise<Object> {
    const {password,iat,exp, ...newPayload} = payload;
    const  accessToken  = this.jwtService.sign(newPayload);

    const refreshToken = await this.jwtService.signAsync(newPayload,{
      secret: jwtConstants.refreshSecret,
      expiresIn: '10min'
    })

    await this.refreshToken.findByIdAndUpdate(tokenId,{
      refreshToken: refreshToken,
    })

    return {
      accessToken,
      refreshToken,
      tokenId: tokenId,
      accessTokenExpires: 120,
    };
  }

  async checkIfRefreshTokenMatches(refreshToken: string, tokenId: string, payload: any){
    const decoded = await this.jwtService.verifyAsync(refreshToken);
    const token = await this.refreshToken.findOne({_id: decoded.jwtid});
    if(!token){
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    console.log(token.expiresAt, new Date());
    if(token.expiresAt < new Date()){
      await this.refreshToken.deleteMany({userId: payload._id});
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return await this.generateTokens(payload, tokenId);
  }

  async revokeRefreshToken(refreshToken: string){
    const decoded = await this.jwtService.verifyAsync(refreshToken);
    await this.refreshToken.findByIdAndRemove({_id: decoded.jwtid});  
  }

}
