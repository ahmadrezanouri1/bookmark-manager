import { Module } from '@nestjs/common';
import { BookmarkModule } from './bookmark/bookmark.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [BookmarkModule, UserModule],
})
export class AppModule {}
