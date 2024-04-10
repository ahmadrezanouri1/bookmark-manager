import { Injectable } from '@nestjs/common';
import { Bookmark } from './bookmark.model';
import { v4 as uuid } from 'uuid';
import { GetBookmarkDto } from './dto/get-bookmark.dto';

@Injectable()
export class BookmarkService {
  private bookmarks: Bookmark[] = [
    {
      id: uuid(),
      description: 'string',
      link: 'string',
    },
  ];

  findAll(): Bookmark[] {
    return this.bookmarks;
  }

  find(getBookmarkDto: GetBookmarkDto): Bookmark[] {
    let bookmarks = this.findAll();
    const { link, description } = getBookmarkDto;

    if (link) {
      bookmarks = bookmarks.filter((bookmark) =>
        bookmark.link.toLowerCase().includes(link),
      );
    }

    if (description) {
      bookmarks = bookmarks.filter((bookmark) =>
        bookmark.description.toLowerCase().includes(description),
      );
    }

    return bookmarks;
  }

  createBookmark(creatbookmark): Bookmark {
    const { description, link } = creatbookmark;
    const bookamrk = {
      id: uuid(),
      description,
      link,
    };

    this.bookmarks.push(bookamrk);

    return bookamrk;
  }

  findbyId(id: string) {
    return this.bookmarks.find((item) => {
      return item.id == id;
    });
  }
}
