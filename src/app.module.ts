import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'gkjfslgkl;dskfs', // Replace with your secret key
      signOptions: { expiresIn: '1h' }, // Set expiration time for the token
    }),
    MongooseModule.forRoot('mongodb://localhost/boomarks'),
  ],
})
export class AppModule {}
