import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { Book } from './interfaces/books.interfaces';
import { UpdateBookDto } from './dtos/update-books.dtos';
import { CreateBookDto } from './dtos/create-books.dtos';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateBookDto) {
    try {
      const book = await this.booksService.create(data);
      return {
        success: true,
        message: 'Book registered successfully',
        data: book,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to register book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get()
  async findAll(@Query('active') active?: string) {
    try {
      let books: Book[];
      if (active === 'active') {
        books = await this.booksService.findAllActive();
      } else {
        books = await this.booksService.findAll();
      }
      return {
        success: true,
        message: `Retrieved ${books.length} books`,
        data: books,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve books',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const book = await this.booksService.findOne(id);
      return {
        success: true,
        message: 'Book retrieved successfully',
        data: book,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get('title/:title')
  async findByTitle(@Param('title') title: string) {
    try {
      const book = await this.booksService.findByTitle(title);
      return {
        success: true,
        message: 'Book retrieved successfully',
        data: book,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get('isbn/:isbn')
  async findByIsbn(@Param('isbn') isbn: string) {
    try {
      const book = await this.booksService.findByIsbn(isbn);
      return {
        success: true,
        message: 'Book retrieved successfully',
        data: book,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateBookDto,
  ) {
    try {
      const book = await this.booksService.update(id, data);
      return {
        success: true,
        message: 'Book updated successfully',
        data: book,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      const book = await this.booksService.softDelete(id);
      return {
        success: true,
        message: book.message,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Delete(':id/permanent')
  async hardDelete(@Param('id', ParseIntPipe) id: number) {
    try {
      const book = await this.booksService.hardDelete(id);
      return {
        success: true,
        message: book.message,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to permanently delete book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
