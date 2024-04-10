import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { Bookmark } from './bookmark.model';
import { createBookmark } from './dto/creatbookmark.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetBookmarkDto } from './dto/get-bookmark.dto';
@ApiTags('bookmark')
@Controller('bookmark')
export class BookmarkController {
  constructor(private Bookmarkservice: BookmarkService) {}
  @Get()
  find(@Query() getBookmarkDto: GetBookmarkDto): Bookmark[] {
    if (Object.keys(getBookmarkDto).length) {
      return this.Bookmarkservice.find(getBookmarkDto);
    }
    return this.Bookmarkservice.findAll();
  }

  @Get('/:id')
  findbyId(@Param('id') id: string) {
    return this.Bookmarkservice.findbyId(id);
  }

  @Post()
  createBookMark(@Body() createBookmark: createBookmark): Bookmark {
    return this.Bookmarkservice.createBookmark(createBookmark);
  }
}
