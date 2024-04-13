import { Module } from '@nestjs/common';
import { BookmarkModule } from './bookmark/bookmark.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    BookmarkModule,
    UserModule,
    MongooseModule.forRoot('mongodb://localhost/boomarks'),
  ],
})
export class AppModule {}
