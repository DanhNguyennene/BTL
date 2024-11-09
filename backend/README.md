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
JWT_SECRET= 
```

4. CREATE JWT_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

4. Start the server:

```bash
npm start
```

## Project Structure
```bash
backend/
├── .env
├── .gitignore
├── README.md
├── config
│   ├── database.js
│   └── viewEngine.js
├── controllers
│   └── book.controllers.js
├── index.js
├── middleware
│   ├── auth.js
│   └── error.middleware.js
├── models
│   └── book.model.js
├── package-lock.json
├── package.json
└── routes
    ├── book.routes.js
    └── user.routes.js              
```

## API Endpoints
### book.model:

#### Functions for Books Management
| Function          | Descriptions                                      | Parameters                                                | Returns                                                             | Throw                                |
|-------------------|--------------------------------------------------|-----------------------------------------------------------|---------------------------------------------------------------------|--------------------------------------|
| getBookTitles     | Fetches book titles matching a search term      | searchItem (string): The search term to match titles       | An array of book titles matching the search term                    | Database error if query execution fails |
| getAllBooks       | Retrieves details of all books, including author, publisher, and genre information | None                                                      | An array of books with details about author, publisher, and genre   | Database error if query execution fails |
| filterBook        | Filters books based on title, price range, author ID, author name, or publisher ID | title (string, optional), minPrice (number, optional), maxPrice (number, optional), author_id (number, optional), author_name (string, optional), pu_id (number, optional) | An array of books matching the filter criteria                       | Database error if query execution fails |
| getBookByID       | Fetches detailed information about a specific book by its ID | book_id (number): The ID of the book                       | Book details object or `null` if not found                           | Database error if query execution fails |
| createABook       | Inserts a new book into the database             | title (string), price (number), author_id (number), pu_id (number) | None                                                                | Database error if query execution fails |
| updateABook       | Updates an existing book’s details by its ID     | book_id (number), title (string), price (number), author_id (number), pu_id (number) | `true` if update successful, `false` otherwise                       | Database error if query execution fails |
| deleteABook       | Deletes a book by its ID                         | book_id (number): The ID of the book to delete             | `true` if deletion successful, `false` otherwise                     | Database error if query execution fails |
| deleteAllofBooks  | Deletes all books from the database              | None                                                      | None                                                                | Database error if query execution fails |


#### User Management
| Function          | Descriptions                                      | Parameters                                                | Returns                                                             | Throw                                |
|-------------------|--------------------------------------------------|-----------------------------------------------------------|---------------------------------------------------------------------|--------------------------------------|
| createUserCustomer| Registers a new user as a customer with transaction support | userData (object): Contains username (string), name (string), phone_number (string), email (string), password (string), address (string), bank_acc (string) | The user data of the newly created customer                         | `Error` if username already exists or database error occurs |
| validUser         | Verifies user credentials and identifies user type (customer or employee) | username (string), password (string)                        | User details object including user type if valid, `null` otherwise   | Database error if query execution fails |


### Routes
#### **Book routes**
| Function             | Descriptions                                                              | Parameters                          | Returns                        | Throws           |
|----------------------|---------------------------------------------------------------------------|-------------------------------------|-------------------------------|------------------|
| `GET /`              | Fetches all books from the database.                                       | None                                | List of books                  | None             |
| `GET /filter`        | Filters books based on query parameters like title, price, etc.            | Query parameters (e.g., title, minPrice, maxPrice, author_id) | Filtered list of books         | None             |
| `GET /:book_id`      | Fetches a single book by its `book_id`.                                    | `book_id` (in URL)                  | Single book details            | Book not found   |
| `GET /search`        | Searches books by title based on the `searchItem` query parameter.        | `searchItem` (query parameter)      | List of books matching search  | None             |
| `POST /`             | Creates a new book in the database.                                        | Body parameters (e.g., title, author, price) | Confirmation of book creation  | Validation error|
| `PATCH /:book_id`    | Updates a book by its `book_id` with new details.                          | `book_id` (in URL), body parameters (e.g., title, price) | Confirmation of book update     | Book not found, Validation error |
| `DELETE /:book_id`   | Deletes a specific book by its `book_id`.                                  | `book_id` (in URL)                  | Confirmation of book deletion  | Book not found   |
| `DELETE /`           | Deletes all books from the database.                                      | None                                | Confirmation of deletion       | None             |

#### **User routes**
| Function           | Descriptions                                         | Parameters              | Returns                             | Throws                |
|--------------------|------------------------------------------------------|-------------------------|------------------------------------|-----------------------|
| `POST /signin`     | Authenticates a user by signing them in with credentials. | Body parameters (e.g., username, password) | Authentication token or error message | Invalid credentials, Missing fields |
| `POST /signup`     | Registers a new user with the provided information.   | Body parameters (e.g., username, password, email, etc.) | Confirmation message or error | User already exists, Validation error |




