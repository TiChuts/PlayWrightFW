import { BookService } from "../../service/book-service";
import { LoginService } from "../../service/login-service";
import { BOOK_DATA } from "../../test-data/book-data";
import {
  testMain as test,
  requestMain as request,
  expectMain as expect,
} from "../../fixtures/main-fixture";
import { BookPage } from "../../page-object/book-page";

test.describe("Add Book", () => {
  test("Add Book Name Learning JavaScript Design Patterns", async ({
    bookService,
  }) => {
    const book = BOOK_DATA["valid_book_1"];
    const response = await bookService.addBooks(book.isbn);
    console.log(response);
  });
});
