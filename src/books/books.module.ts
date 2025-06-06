import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { DatabaseService } from 'src/database/connection.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService, DatabaseService],
})
export class BooksModule {}
