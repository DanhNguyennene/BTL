# Book Inventory API

A RESTful API built with Node.js, Express, and MySQL2 for managing a book inventory system. This API provides endpoints for creating, reading, updating, and deleting book records.


# Table of Content

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)

## Prerequisites
- Node.js (v14 or higher)
- MySQL2/promise
- npm or yarn package manager

## Installation 
1. Clone the repo:
```bash
git clone https://github.com/TinhAnhGitHub/BTL.git
cd book-inventory-api
```
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
đọc env.example là biết
```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=<pass của cái mysql>
DB_NAME=ebookstoredb
```

4. Start the server:

```bash
nodemon
```

## Project Structure
```bash
backend/
├── config/
│   └── database.js         # MongoDB connection configuration
├── controllers/
│   └── book.controllers.js  # Book-related business logic
├── middleware/
│   └── error.middleware.js  # Error handling middleware
├── models/
│   └── book.model.js       # Book collection access
├── routes/
│   └── book.route.js       # Book route definitions
├── .env                    # Environment variables
└── index.js               # Application entry point
```

## API Endpoints
### Books
| Method | Endpoint          | Description                                   |
|--------|-------------------|-----------------------------------------------|
| GET    | /api/books         | Retrieve all books                            |
| GET    | /api/books/:id     | Retrieve a specific book                      |
| POST   | /api/books         | Create a new book (single or multiple)        |
| PUT    | /api/books/:id     | Update a specific book                        |
| DELETE | /api/books/:id     | Delete a specific book                        |
| DELETE | /api/books         | Delete all books                              |

### Request/Response Examples
Create a Book
```http
httpCopyPOST /api/books
Content-Type: application/json
```

Create Multiple Books

```http
httpCopyPOST /api/books
Content-Type: application/json

[
  {
    "bookTitle": "Book 1"
  },
  {
    "bookTitle": "Book 2"
  }
]
```
## Database schema 

The application uses MongoDB with the following structure:

- Database Name: `ebookstoredb`
- Collection Name: `book`

