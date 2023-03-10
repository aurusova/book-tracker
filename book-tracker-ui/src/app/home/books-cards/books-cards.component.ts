import {Component, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {Book} from "../../models/book";
import {BookService} from "../../services/book.service";
import {Observable, Observer} from "rxjs";
import {UserService} from "../../services/user.service";
import {StorageService} from "../../services/storage.service";
import {LanguageEntry, LANGUAGES} from "../../models/languages";

let BOOK_DATA: Book[] = [];

export interface CardRow {
  title: string;
  content: any;
}

@Component({
  selector: 'app-books-cards',
  templateUrl: './books-cards.component.html',
  styleUrls: ['./books-cards.component.scss'],
  providers: [BookService, UserService]
})
export class BooksCardsComponent implements OnInit, OnDestroy {

  asyncRows!: Observable<CardRow[]>;
  dataSourceCardOne: Book[] = []
  dataSourceCardTwo: Book[] = []
  dataSourceCardThree: Book[] = []
  prefLang = LANGUAGES[0];
  constructor(
    private sanitization: DomSanitizer,
    private bookService: BookService,
    private userService: UserService,
    private storageService: StorageService) {
      this.prefLang = this.storageService.getLang();
  }

  ngOnInit(): void {
    this.bookService.getBooksByAuthor('Shakespeare', this.prefLang.code, '40')
      .subscribe({
        next: books => this.extractBooks(books, 1),
        error: error => console.log(error)
      });

    this.bookService.getBooksByQuery('javascript', this.prefLang.code, '20')
      .subscribe({
        next: books => this.extractBooks(books, 2),
        error: error => console.log(error)
      });

    this.bookService.getBooksByQueryAndAuthor(' the lord of the rings', 'tolkien', this.prefLang.code, '20')
      .subscribe({
        next: books => this.extractBooks(books, 3),
        error: error => console.log(error)
      });

    this.asyncRows = new Observable((observer: Observer<CardRow[]>) => {
      setTimeout(() => {
        observer.next([
          {title: 'Selected Shakespeare Works', content: this.dataSourceCardOne},
          {title: 'Selected Books About Coding', content: this.dataSourceCardTwo},
          {title: 'The Lord of the Rings Books', content: this.dataSourceCardThree}
        ]);
      }, 1000);
    })
  }

  ngOnDestroy(): void {
    BOOK_DATA = []
    this.dataSourceCardOne = []
    this.dataSourceCardTwo = []
    this.dataSourceCardThree = []
  }

  extractBooks(books: any, cardRow: number): void {
    for (let book of books) {
      let newBook = {
        author: book.author,
        cover: book.cover,
        description: book.description,
        isbn: book.isbn,
        noofpages: book.noofpages,
        title: book.title,
        year: book.year,
        language: book.language,
        genre: book.genre
      }
      BOOK_DATA.push(newBook)
    }

    switch (cardRow) {
      case 1: {
        this.dataSourceCardOne = BOOK_DATA
        break;
      }
      case 2: {
        this.dataSourceCardTwo = BOOK_DATA
        break;
      }
      case 3: {
        this.dataSourceCardThree = BOOK_DATA;
        break;
      }
    }
    BOOK_DATA = []
  }

  getCoverUrl(book: Book) {
    return this.sanitization.bypassSecurityTrustStyle('url(\'' + book.cover + '\')');
  }

  getFirstAuthor(book: Book): string {
    if (book.author !== undefined) {
      return book.author[0];
    } else {
      return "";
    }
  }
}
