// user.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

    return { message: 'OTP has been sent to the provided phone number' };
  }

  @Post('verify-otp')
  async verifyOTP(
    @Body('phoneNumber') phoneNumber: string,
    @Body('otp') otp: string,
  ): Promise<{ token: string }> {
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
    const token = 'your_generated_jwt_token';
    return { token };
  }

  private async retrieveOTPFromDatabase(phoneNumber: string): Promise<string> {
    // در اینجا باید کد OTP را از پایگاه داده با استفاده از شماره تلفن به دست آورید
    // برای مثال، از TypeORM یا هر ORM دیگری برای این کار استفاده کنید
    // در این مثال، این متد تابع مجازی است که کد OTP را برمی‌گرداند
    return '123456'; // باید از پایگاه داده خوانده شود
  }
}
