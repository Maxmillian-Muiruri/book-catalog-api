/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dtos/create-books.dtos';
import { UpdateBookDto } from './dtos/update-books.dtos';
import { Book } from './interfaces/books.interfaces';
import { DatabaseService } from '../database/connection.service';

interface QueryResult<T> {
  rows: T[];
}

@Injectable()
export class BooksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: CreateBookDto): Promise<Book> {
    const existing: QueryResult<Book> = await this.databaseService.query(
      'SELECT * FROM books WHERE title = $1',
      [data.title],
    );
    if (existing.rows.length > 0) {
      throw new ConflictException(
        `Book with title ${data.title} already exists`,
      );
    }

    const result: QueryResult<Book> = await this.databaseService.query(
      `INSERT INTO books (title, author_name, published_year, isbn, available_copies, is_available)
       VALUES ($1, $2, $3, $4, $5, true) RETURNING *`,
      [
        data.title,
        data.authorName,
        data.publishedYear,
        data.isbn,
        data.availableCopies,
      ],
    );
    return result.rows[0];
  }

  async findAll(): Promise<Book[]> {
    const result: QueryResult<Book> = await this.databaseService.query(
      'SELECT * FROM books WHERE is_available = true',
    );
    return result.rows;
  }

  async findAllActive(): Promise<Book[]> {
    const result: QueryResult<Book> = await this.databaseService.query(
      'SELECT * FROM books WHERE is_available = true',
    );
    return result.rows;
  }

  async findOne(id: number): Promise<Book> {
    const result: QueryResult<Book> = await this.databaseService.query(
      'SELECT * FROM books WHERE id = $1',
      [id],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return result.rows[0];
  }

  async findByTitle(title: string): Promise<Book> {
    const result: QueryResult<Book> = await this.databaseService.query(
      'SELECT * FROM books WHERE title = $1',
      [title],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException(`Book with title ${title} not found`);
    }
    return result.rows[0];
  }

  async findByIsbn(isbn: string): Promise<Book> {
    const result: QueryResult<Book> = await this.databaseService.query(
      'SELECT * FROM books WHERE isbn = $1',
      [isbn],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException(`Book with ISBN ${isbn} not found`);
    }
    return result.rows[0];
  }

  async update(id: number, data: UpdateBookDto): Promise<Book> {
    const existing: QueryResult<Book> = await this.databaseService.query(
      'SELECT * FROM books WHERE id = $1',
      [id],
    );
    if (existing.rows.length === 0) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    if (data.title && data.title !== existing.rows[0].title) {
      const duplicate: QueryResult<Book> = await this.databaseService.query(
        'SELECT * FROM books WHERE title = $1',
        [data.title],
      );
      if (duplicate.rows.length > 0) {
        throw new ConflictException(
          'Another book with the same title already exists',
        );
      }
    }

    const updatedBook = {
      ...existing.rows[0],
      ...data,
    };

    const result: QueryResult<Book> = await this.databaseService.query(
      `UPDATE books SET title = $1, author_name = $2, published_year = $3, isbn = $4, available_copies = $5, is_available = $6
       WHERE id = $7 RETURNING *`,
      [
        updatedBook.title,
        updatedBook.authorName || updatedBook.authorName,
        updatedBook.publishedYear || updatedBook.publishedYear,
        updatedBook.isbn,
        updatedBook.availableCopies || updatedBook.availableCopies,
        updatedBook.isAvailable || updatedBook.isAvailable,
        id,
      ],
    );
    return result.rows[0];
  }

  async softDelete(id: number): Promise<{ message: string }> {
    const existing: QueryResult<Book> = await this.databaseService.query(
      'SELECT * FROM books WHERE id = $1',
      [id],
    );
    if (existing.rows.length === 0) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    await this.databaseService.query(
      'UPDATE books SET is_available = false WHERE id = $1',
      [id],
    );

    return { message: `Book with id ${id} has been deactivated.` };
  }

  async hardDelete(id: number): Promise<{ message: string }> {
    const existing: QueryResult<Book> = await this.databaseService.query(
      'SELECT * FROM books WHERE id = $1',
      [id],
    );
    if (existing.rows.length === 0) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    await this.databaseService.query('DELETE FROM books WHERE id = $1', [id]);

    return { message: `Book with id ${id} has been permanently deleted.` };
  }
}
