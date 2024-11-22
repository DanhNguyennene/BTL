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










DROP DATABASE IF EXISTS EBookstoreDB;
CREATE DATABASE EBookstoreDB;

USE EBookstoreDB;

CREATE TABLE USER (
    username VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100),
    phone_number VARCHAR(20),
    email VARCHAR(100),
    password VARCHAR(255) 
);

CREATE TABLE CUSTOMER (
    username VARCHAR(50) PRIMARY KEY,
    address VARCHAR(255),
    bank_acc VARCHAR(50),
    FOREIGN KEY (username) REFERENCES USER(username)
    ON UPDATE CASCADE
 ON DELETE CASCADE
);

CREATE TABLE EMPLOYEE (
    username VARCHAR(50) PRIMARY KEY,
    employee_id INT,
    FOREIGN KEY (username) REFERENCES USER(username)
 ON UPDATE CASCADE
    ON DELETE CASCADE
); 

CREATE TABLE AUTHOR (
    author_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    dob DATE,
    biography TEXT
);

CREATE TABLE PUBLISHER (
    pu_id INT PRIMARY KEY AUTO_INCREMENT,
    pu_name VARCHAR(100),
    pu_phone_number VARCHAR(50),
    pu_address VARCHAR(255)
);

CREATE TABLE BOOK (
    book_id INT PRIMARY KEY auto_increment,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL, 
    author_id INT,
    pu_id INT,
    imageURL varchar(255),
    quantity INT NOT NULL DEFAULT 0,
    FOREIGN KEY (author_id) REFERENCES AUTHOR(author_id)
	ON UPDATE CASCADE
    ON DELETE SET NULL,
    FOREIGN KEY (pu_id) REFERENCES PUBLISHER(pu_id)
 ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE TABLE GENRE (
    gen_id INT PRIMARY KEY,
    genre_name VARCHAR(100),
    description TEXT
);

CREATE TABLE BOOK_GENRE (
    book_id INT,
    gen_id INT,
    PRIMARY KEY (book_id, gen_id),
    FOREIGN KEY (book_id) REFERENCES BOOK(book_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
    FOREIGN KEY (gen_id) REFERENCES GENRE(gen_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);

CREATE TABLE `ORDER` (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    order_time DATETIME,
    order_status ENUM('Pending', 'Processing', 'Completed', 'Cancelled', 'Failed'),
    username VARCHAR(50),
    FOREIGN KEY (username) REFERENCES CUSTOMER(username)
	ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE ORDER_BOOK (
    order_id INT,
    book_id INT,
    quantity INT,
    PRIMARY KEY (order_id, book_id),
    FOREIGN KEY (order_id) REFERENCES `ORDER`(order_id)
 ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES BOOK(book_id)
 ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE ORDER_PUBLISHER (
    pu_order_id INT PRIMARY KEY AUTO_INCREMENT,
    pu_order_status ENUM('Success', 'Pending', 'Failed'),
    pu_order_time DATETIME,
    username VARCHAR(50),
    pu_id INT,
    FOREIGN KEY (username) REFERENCES EMPLOYEE(username)
 ON UPDATE CASCADE
 ON DELETE CASCADE,
    FOREIGN KEY (pu_id) REFERENCES PUBLISHER(pu_id)
 ON UPDATE CASCADE
 ON DELETE CASCADE
);

CREATE TABLE ORDER_PUBLISHER_BOOK (
    book_id INT,
    pu_order_id INT,
    quantity INT,
    PRIMARY KEY (book_id, pu_order_id),
    FOREIGN KEY (book_id) REFERENCES BOOK(book_id)
 ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (pu_order_id) REFERENCES ORDER_PUBLISHER(pu_order_id)
 ON UPDATE CASCADE
    ON DELETE CASCADE
);



-- 1. Trigger to update book quantity when a publisher order is completed
-- So if the order is set to Success, adjust the front end, so that It cannot be modified back to any status
DELIMITER //
CREATE TRIGGER after_publisher_order_success
BEFORE UPDATE ON ORDER_PUBLISHER
FOR EACH ROW
BEGIN
	IF NEW.pu_order_status = 'Success' AND OLD.pu_order_status != 'Sucess' THEN
		UPDATE BOOK b 
        INNER JOIN ORDER_PUBLISHER_BOOK opb ON b.book_id = opb.book_id
        SET b.quantity  = b.quantity + opb.quantity
        WHERE opb.pu_order_id = NEW.pu_order_id;
    END IF;
END
// DELIMITER;



-- 2. Trigger to check and update book quantity when customer order is completed
DELIMITER //
CREATE TRIGGER after_customer_order_complete 
BEFORE UPDATE ON `ORDER`
FOR EACH ROW
BEGIN
	DECLARE sufficient_stock BOOLEAN default TRUE;
    
    -- Check if there's enough stock for all books in the order
    IF NEW.order_status = 'Completed' AND OLD.order_status != 'Completed' THEN
		-- We have to check if there are any book left in the stock
		SELECT coalesce(MIN(b.quantity >= ob.quantity), TRUE) INTO sufficient_stock
        FROM  ORDER_BOOk ob
        JOIN BOOK b ON ob.book_id = b.book_id
        WHERE ob.order_id = NEW.order_id;
        
        IF NOT sufficient_stock THEN
			SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Insufficient stock for one or more books in the order';
		ELSE
			UPDATE BOOK b
            INNER JOIN ORDER_BOOK ob ON b.book_id = ob.book_id
            SET b.quantity = b.quantity - ob.quantity
            WHERE ob.order_id = NEW.order_id;
		END IF;
	END IF;
END
//DELIMITER ;



-- -- 3. Function to calculate total order value
-- DELIMITER //
-- CREATE FUNCTION calculate_order_total(p_order_id INT) 
-- RETURNS DECIMAL(10,2)
-- DETERMINISTIC -- the function will always return the same results for the same input 
-- READS SQL DATA
-- BEGIN
--     DECLARE total DECIMAL(10,2);
--     
--     SELECT SUM(b.price * ob.quantity) INTO total
--     FROM ORDER_BOOK ob
--     JOIN BOOK b ON ob.book_id = b.book_id
--     WHERE ob.order_id = p_order_id;
--     
--     RETURN COALESCE(total, 0);
-- END//
-- DELIMITER ;


-- -- 4. Function to check if book is low on stock
-- -- Adding a marking field for this one in the book management
-- DELIMITER //
-- CREATE FUNCTION is_low_stock(p_book_id INT, p_threshold INT) 
-- RETURNS BOOLEAN
-- DETERMINISTIC
-- BEGIN
-- 	DECLARE current_quantity INT;
--     SELECT quantity INTO current_quantity
--     FROM BOOK 
--     WHERE book_id = p_book_id;
--     
--     RETURN current_quantity <= p_threshold;
-- END//
-- DELIMITER ;





