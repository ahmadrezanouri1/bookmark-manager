// user.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Get,
  Request,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Bookmark } from './schemas/bookmark.schema';
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @Post('generate-otp')
  async generateOTP(
    @Body('phoneNumber') phoneNumber: string,
  ): Promise<{ message: string }> {
    // بررسی صحت شماره تلفن (مثلاً بررسی طول و فرمت مناسب شماره تلفن)
    if (!phoneNumber || !phoneNumber.match(/^\d{11}$/)) {
      throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);
    }

    // ایجاد کد OTP و ارسال آن به کاربر
    const otp = await this.userService.generateOTP(phoneNumber);

    return { message: `Sending OTP ${otp} to ${phoneNumber}` };
  }

  @Post('verify-otp')
  async verifyOTP(
    @Body('phoneNumber') phoneNumber: string,
    @Body('otp') otp: string,
  ) {
    // بررسی صحت شماره تلفن (مثلاً بررسی طول و فرمت مناسب شماره تلفن)
    if (!phoneNumber || !phoneNumber.match(/^\d{11}$/)) {
      throw new HttpException('Invalid phone number', HttpStatus.BAD_REQUEST);
    }

    // اینجا باید کد OTP را از پایگاه داده بخوانید و با کد ارسال شده توسط کاربر مقایسه کنید
    const savedOTP = await this.retrieveOTPFromDatabase(phoneNumber);

    if (savedOTP !== otp) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    // در اینجا توکن JWT برای کاربر ایجاد می‌شود و برگشت داده می‌شود
    const token = this.userService.generateAccessToken(phoneNumber);
    return token;
  }

  async retrieveOTPFromDatabase(phoneNumber: string): Promise<string> {
    const user = await this.userModel.findOne({ phoneNumber });
    if (user) {
      return user.otp;
    }
  }

  @UseGuards(JwtAuthGuard) // Secure the route with JWTAuthGuard
  @Post('follow/:userId')
  async followUser(@Request() req, @Param('userId') userId: string) {
    const loggedInUserId = req.user.userId; // Get the user ID from the request
    return this.userService.followUser(loggedInUserId, userId);
  }

  @UseGuards(JwtAuthGuard) // Secure the route with JwtAuthGuard
  @Post('unfollow/:userId')
  async unfollowUser(@Request() req, @Param('userId') userId: string) {
    const loggedInUserId = req.user.userId; // Get the user ID from the request
    return this.userService.unfollowUser(loggedInUserId, userId);
  }

  @UseGuards(JwtAuthGuard) // Secure the route with JWTAuthGuard
  @Get('followers')
  async getFollowers(@Request() req) {
    const loggedInUserId = req.user.userId; // Get the user ID from the request
    return this.userService.getFollowers(loggedInUserId);
  }

  @UseGuards(JwtAuthGuard) // Secure the route with JWTAuthGuard
  @Get('following')
  async getFollowing(@Request() req) {
    const loggedInUserId = req.user.userId; // Get the user ID from the request
    return this.userService.getFollowing(loggedInUserId);
  }

  @UseGuards(JwtAuthGuard) // Secure the route with JwtAuthGuard
  @Post('bookmarks')
  async createBookmark(@Request() req, @Body() bookmark: Bookmark) {
    const loggedInUserId = req.user.userId; // Get the user ID from the request
    return this.userService.createBookmark(loggedInUserId, bookmark);
  }

  @UseGuards(JwtAuthGuard) // Secure the route with JwtAuthGuard
  @Get('bookmarks')
  async getUserBookmarks(@Request() req) {
    const loggedInUserId = req.user.userId; // Get the user ID from the request
    return this.userService.getUserBookmarks(loggedInUserId);
  }

  @UseGuards(JwtAuthGuard) // Secure the route with JwtAuthGuard
  @Get('bookmarks/:id')
  async getBookmarkDetail(@Request() req, @Param('id') id: string) {
    const loggedInUserId = req.user.userId; // Get the user ID from the request
    return this.userService.getBookmarkDetail(loggedInUserId, id);
  }

  @UseGuards(JwtAuthGuard) // Secure the route with JwtAuthGuard
  @Delete('bookmarks/:id')
  async deleteBookmark(@Request() req, @Param('id') id: string) {
    const loggedInUserId = req.user.userId; // Get the user ID from the request
    return this.userService.deleteBookmark(loggedInUserId, id);
  }
}
