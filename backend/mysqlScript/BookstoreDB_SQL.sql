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


CREATE TABLE NOTIFICATION (
	notification_id int primary key auto_increment,
    notification_type ENUM('LowStock', 'NoStock', 'NewOrder', 'StockWarning') not null,
    message TEXT not null,
    create_at datetime default current_timestamp ,
    is_read boolean default false,
    reference_id int,-- This could be from the book_id or from the order_id depending on the notification type
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium'
);

CREATE TABLE ORDER_ACTION_LOG(
	log_id int primary key auto_increment,
    order_id int,
    action_type ENUM('Created', 'StatusChanged', 'Cancelled') not null,
    old_status ENUM('Pending', 'Processing', 'Completed', 'Cancelled', 'Failed'),
    new_status ENUM('Pending', 'Processing', 'Completed', 'Cancelled', 'Failed'),
    action_note TEXT,
    action_by VARCHAR(50),
    action_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) references `ORDER`(order_id)
		ON UPDATE CASCADE
        ON DELETE CASCADE,
	FOREIGN KEY (action_by) REFERENCES USER(username)
      ON UPDATE CASCADE
      ON DELETE SET NULL
        
);

DELIMITER //

CREATE TRIGGER after_book_quantity_update
AFTER UPDATE ON BOOK
FOR EACH ROW
BEGIN
	IF NEW.quantity < 10 and NEW.quantity > 0 THEN
		INSERT INTO NOTIFICATION (notification_type, message, reference_id, priority) VALUES (
			'LowStock',
            CONCAT('Low stock alert: "', NEW.title, '" has only ', NEW.quantity, ' copies remaining.'),
            NEW.book_id,
            'High'
        );
    END IF;
    IF NEW.quantity = 0 THEN
		INSERT INTO NOTIFICATION (notification_type, message, reference_id, priority) VALUES(
			'NoStock',
            CONCAT('Stock depleted: "', NEW.title, '" is out of stock!'),
            NEW.book_id,
            'High');
    END IF;
END //
DELIMITER ;


DELIMITER //
CREATE TRIGGER after_book_insert
AFTER INSERT ON BOOK
FOR EACH ROW 
BEGIN
	IF NEW.quantity = 0 THEN
		INSERT INTO NOTIFICATION (notification_type, message, reference_id, priority) VALUES(
			'NoStock',
            CONCAT('New book added: "', NEW.title, '" needs stock!'),
            NEW.book_id,
			'Medium'
        );
    END IF;
END //
DELIMITER ;


DELIMITER //
CREATE TRIGGER after_order_status_change
AFTER UPDATE ON `ORDER`
FOR EACH ROW 
BEGIN
	-- adding some status change into the log
    INSERT INTO ORDER_ACTION_LOG(
		order_id,
		old_status,
		new_status,
		action_by,
		action_type
	) VALUES(
		NEW.order_id,
		OLD.order_status,
		NEW.order_status,
		NEW.username,
		'StatusChanged'
	);
END //
DELIMITER ;
SET SESSION group_concat_max_len = 100000;

DELIMITER //
CREATE TRIGGER after_order_insert
AFTER INSERT ON `ORDER`
FOR EACH ROW
BEGIN
	DECLARE insufficient_stock BOOLEAN DEFAULT FALSE;
    DECLARE stock_warning BOOLEAN DEFAULT FALSE;
    
    -- Check for any items with insufficient stock
    SELECT GROUP_CONCAT(
      CONCAT(b.title, ' (Ordered: ', ob.quantity, ', Available: ', b.quantity, ')')
      SEPARATOR ', '
	) INTO stock_warning
    FROM ORDER_BOOK ob
    JOIN BOOK b ON ob.book_id = b.book_id
    WHERE ob.order_id = NEW.order_id
    AND ob.quantity > b.quantity;
    
    INSERT INTO NOTIFICATION (
		notification_type, 
		message,
		reference_id,
		priority 
	) VALUES(
		'NewOrder',
		CONCAT('New order received: Order #', NEW.order_id),
		NEW.order_id,
		'Medium'
	);
	  
    
    IF stock_warning is not null and stock_warning != '' THEN
		INSERT INTO NOTIFICATION (
			notification_type, 
			message,
			reference_id,
			priority 
		) VALUES(
			'StockWarning',
			CONCAT('Stock warning for Order #', NEW.order_id, ': ', stock_warning),
			NEW.order_id,
			'High'
		);
	END IF;
    
    INSERT INTO ORDER_ACTION_LOG (
		order_id,
		action_type,
		new_status,
		action_by,
		action_note
	)
    VALUES (
      NEW.order_id,
      'Created',
      NEW.order_status,
      NEW.username,
      'Order created'
  );
    
END //
DELIMITER ;


DELIMITER //
CREATE TRIGGER after_order_completion_stock_check
AFTER UPDATE ON `ORDER`
FOR EACH ROW
BEGIN
	IF NEW.order_status = 'Completed' AND OLD.order_status != 'Completed' THEN
		CREATE TEMPORARY TABLE temp_stock_warnings AS
		SELECT
			ob.book_id,
            b.title,
            ob.quantity as order_quantity,
            b.quantity as book_quantity,
            o.order_id,
            o.username
		FROM ORDER_BOOK  ob
        JOIN BOOK b ON ob.book_id = b.book_id
        JOIN `ORDER` o ON ob.order_id = o.order_id
        WHERE 	
			o.order_status IN ('Pending', 'Processing')
            AND ob.quantity > b.quantity;
		
        INSERT INTO NOTIFICATION (
            notification_type, 
            message,
            reference_id,
            priority 
        )
        SELECT 
            'StockWarning',
            CONCAT('Stock warning for Order #', order_id, ': ', title, 
                   ' (Ordered: ', ordered_quantity, 
                   ', Available: ', current_stock, ')'),
            order_id,
            'High'
        FROM temp_stock_warnings;
        DROP TEMPORARY TABLE IF EXISTS temp_stock_warnings;
	END IF ;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER after_publisher_order_success
BEFORE UPDATE ON ORDER_PUBLISHER
FOR EACH ROW
BEGIN
	IF NEW.pu_order_status = 'Success' AND OLD.pu_order_status != 'Success' THEN
		UPDATE BOOK b 
        INNER JOIN ORDER_PUBLISHER_BOOK opb ON b.book_id = opb.book_id
        SET b.quantity  = b.quantity + opb.quantity
        WHERE opb.pu_order_id = NEW.pu_order_id;
    END IF;
END
// DELIMITER ;



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
            SET MESSAGE_TEXT = 'Insufficient stock for one or more books in the order';
		ELSE
			UPDATE BOOK b
            INNER JOIN ORDER_BOOK ob ON b.book_id = ob.book_id
            SET b.quantity = b.quantity - ob.quantity
            WHERE ob.order_id = NEW.order_id;
		END IF;
	END IF;
END
//DELIMITER ;



DELIMITER //
CREATE FUNCTION calculate_order_total(p_order_id INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
	DECLARE total DECIMAL(10,2);
    SELECT SUM(b.price * ob.quantity) INTO total
    FROM ORDER_BOOK as ob
    JOIN BOOK as b ON ob.book_id = b.book_id
    where ob.order_id = p_order_id;
    
    RETURN COALESCE(total, 0);
END //
DELIMITER ;


DELIMITER //
CREATE FUNCTION is_book_availability(p_book_id INT, p_quantity INT)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE available_quantity INT DEFAULT 0;
    SELECT COALESCE(quantity, 0) INTO available_quantity
    FROM BOOK
    WHERE book_id = p_book_id;
    RETURN available_quantity >= p_quantity;
END //
DELIMITER ;


DELIMITER //
CREATE FUNCTION get_author_book_count(p_author_id INT)
RETURNS INT
DETERMINISTIC
BEGIN

	DECLARE book_count INT;
    SELECT COUNT(*) INTO book_count
    FROM BOOK
    WHERE author_id = p_author_id;
    RETURN book_count;
END //
DELIMITER ;



DELIMITER //
CREATE FUNCTION get_customer_order_count(p_username VARCHAR(50))
RETURNS INT
DETERMINISTIC
BEGIN
	DECLARE order_count INT;
    SELECT COUNT(*) INTO order_count
    FROM `ORDER`
    WHERE username = p_username;
    RETURN order_count;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE generate_sales_report(
    OUT total_orders INT,
    OUT total_revenue DECIMAL(10,2),
    OUT avg_order_value DECIMAL(10,2),
    OUT top_book VARCHAR(255),
    OUT top_book_sales INT,
    OUT top_customer VARCHAR(100),
    OUT top_customer_orders INT
)
BEGIN
    SELECT 
        COUNT(DISTINCT o.order_id),
        COALESCE(SUM(b.price * ob.quantity), 0),
        COALESCE(AVG(b.price * ob.quantity), 0)
    INTO 
        total_orders, 
        total_revenue, 
        avg_order_value
    FROM `ORDER` o
    JOIN ORDER_BOOK ob ON o.order_id = ob.order_id
    JOIN BOOK b ON ob.book_id = b.book_id
    WHERE o.order_status = 'Completed';
    
    -- Find the best-selling book
    SELECT
        b.title,
        SUM(ob.quantity)
    INTO 
        top_book,
        top_book_sales
    FROM BOOK b
    JOIN ORDER_BOOK ob ON ob.book_id = b.book_id
    JOIN `ORDER` o ON ob.order_id = o.order_id
    WHERE o.order_status = 'Completed'
    GROUP BY b.book_id, b.title
    ORDER BY SUM(ob.quantity) DESC 
    LIMIT 1;
    
    -- Find the top customer
    SELECT 
        u.name,
        COUNT(o.order_id)
    INTO
        top_customer,
        top_customer_orders
    FROM USER u
    JOIN `ORDER` o ON o.username = u.username
    WHERE o.order_status = 'Completed'
    GROUP BY u.username, u.name
    ORDER BY COUNT(o.order_id) DESC
    LIMIT 1;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER before_book_delete
BEFORE DELETE ON BOOK
FOR EACH ROW 
BEGIN
	IF EXISTS(
		SELECT 1 FROM ORDER_BOOK ob 
        JOIN `ORDER` o ON ob.order_id = o.order_id
        WHERE ob.book_id = OLD.book_id
        AND o.order_status IN ('Pending', 'Processing')
    ) THEN 
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete book with pending orders';
	END IF;
END //
DELIMITER ;



