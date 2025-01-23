const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const fs = require('fs');
const { log } = require('console');

const app = express();
app.use(bodyParser.json());

const books = JSON.parse(fs.readFileSync('./data.json','utf-8'))
// console.log(bookData);

// Create a new book
app.post('/books', (req, res) => {
  const { book_id, title, author, genre, year, copies } = req.body;

  if (!book_id || !title || !author || !genre || !year || !copies) {
      return res.status(400).json({ error: 'All book fields are required.' });
  }

  if (books.some(book => book.book_id === book_id)) {
      return res.status(400).json({ error: 'Book with this ID already exists.' });
  }

  const newBook = { book_id, title, author, genre, year, copies };
  books.push(newBook);
  res.status(201).json(newBook);
});

// Retrieve all books
app.get('/books', (req, res) => {
  res.status(200).json(books);
});

// Retrieve a specific book by ID
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.book_id === req.params.id);

  if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
  }

  res.status(200).json(book);
});

// Update a book
app.put('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.book_id === req.params.id);

  if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found.' });
  }

  const updatedBook = { ...books[bookIndex], ...req.body };
  books[bookIndex] = updatedBook;

  res.status(200).json(updatedBook);
});

// Delete a book
app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.book_id === req.params.id);

  if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found.' });
  }

  books.splice(bookIndex, 1);
  res.status(200).json({ message: 'Book deleted successfully.' });
});


const PORT = process.env.PORT|| 8888 ;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
