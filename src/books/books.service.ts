import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dtos/create-books.dtos';
import { UpdateBookDto } from './dtos/update-books.dtos';
import { Book } from './interfaces/books.interfaces';

@Injectable()
export class BooksService {
  private books: Book[] = [
    {
      id: 2,
      title: 'blossom',
      authorName: 'Joseph parmut',
      publishedYear: 2002,
      isbn: '1234567890',
      availableCopies: 2,
      isAvailable: true,
    },
  ];
  private nextId = 3;

  create(data: CreateBookDto): Book {
    const existingBook = this.books.find((book) => book.title === data.title);

    if (existingBook) {
      throw new ConflictException(
        `Book with title ${data.title} already exists`,
      );
    }

    const newBook: Book = {
      id: this.nextId++,
      ...data,
      isAvailable: true,
    };

    this.books.push(newBook);

    return newBook;
  }

  findAll(): Book[] {
    return this.books;
  }

  findAllActive(): Book[] {
    return this.books.filter((book) => book.isAvailable);
  }

  findOne(id: number): Book {
    const book = this.books.find((book) => book.id === id);
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return book;
  }

  findByTitle(title: string): Book {
    const book = this.books.find((book) => book.title === title);
    if (!book) {
      throw new NotFoundException(`Book with title ${title} not found`);
    }
    return book;
  }

  findByIsbn(isbn: string): Book {
    const book = this.books.find((book) => book.isbn === isbn);
    if (!book) {
      throw new NotFoundException(`Book with ISBN ${isbn} not found`);
    }
    return book;
  }

  update(id: number, data: UpdateBookDto): Book {
    const bookIndex = this.books.findIndex((book) => book.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    // Prevent duplicate title
    if (data.title && this.books[bookIndex].title !== data.title) {
      const existingBook = this.books.find((book) => book.title === data.title);
      if (existingBook) {
        throw new ConflictException(
          'Another book with the same title already exists',
        );
      }
    }

    const updatedBook: Book = {
      ...this.books[bookIndex],
      ...data,
    };

    this.books[bookIndex] = updatedBook;
    return updatedBook;
  }

  /**
   * Soft delete (sets isAvailable field to false)
   * @param id
   * @return message: string
   */
  softDelete(id: number): { message: string } {
    const bookIndex = this.books.findIndex((book) => book.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    this.books[bookIndex] = {
      ...this.books[bookIndex],
      isAvailable: false,
    };

    return { message: `Book with id ${id} has been deactivated.` };
  }

  /**
   * Hard delete (removes from array completely)
   * @param id number
   * @return message: string
   */
  hardDelete(id: number): { message: string } {
    const bookIndex = this.books.findIndex((book) => book.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    const deletedBook = this.books.splice(bookIndex, 1)[0];

    return {
      message: `Book ${deletedBook.title} has been permanently deleted`,
    };
  }
}
