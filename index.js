const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const fs = require('fs');
const { log } = require('console');

const app = express();
app.use(bodyParser.json());

const books = JSON.parse(fs.readFileSync('./data.json','utf-8'))
// console.log(bookData);


app.post('/books', (req, res) => {
  const { book_id, title, author, genre, year, copies } = req.body;

  if (!book_id || !title || !author || !genre || !year || !copies) {
      res.send({ error: 'All book fields are required.' });
  }

  if (books.some(book => book.book_id === book_id)) {
      res.send({ error: 'Book with this ID already exists.' });
  }

  const newBook = { book_id, title, author, genre, year, copies };
  books.push(newBook);
  res.send(newBook);
});


app.get('/books', (req, res) => {
  res.send(books);
});


app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.book_id === req.params.id);

  if (!book) {
      res.send({ error: 'Book not found.' });
  }

  res.send(book);
});


app.put('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.book_id === req.params.id);

  if (bookIndex === -1) {
      res.send({ error: 'Book not found.' });
  }

  const updatedBook = { ...books[bookIndex], ...req.body };
  books[bookIndex] = updatedBook;

  res.send(updatedBook);
});


app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.book_id === req.params.id);

  if (bookIndex === -1) {
    res.send({ error: 'Book not found.' });
  }

  books.splice(bookIndex, 1);
  res.send({ message: 'Book deleted successfully.' });
});


const PORT = process.env.PORT|| 8888 ;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
