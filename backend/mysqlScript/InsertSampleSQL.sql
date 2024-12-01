USE ebookstoredb;

INSERT INTO USER(username, name, phone_number, email, password) VALUES
('johnDoe', 'John Doe', '+43 1 716130', 'john.doe@gmail.com', 'Aa@12345'),
('janeSmith', 'Jane Smith', '+43 1 123456', 'jane.smith@gmail.com', 'Aa@12345'),
('robertBrown', 'Robert Brown', '+32 2 287 62 11', 'james.bon@gmail.com', 'Aa@12345'),
('lisaJones', 'Lisa Jones', '+15559870123', 'lisa.blue@gmail.com', 'Aa@12345'),
('employee1', 'David Lee', '+15551112222', 'david.lee@ebookstore.com', 'Aa@12345'),
('employee2', 'Maria Garcia', '+15554445555', 'maria.garcia@ebookstore.com', 'Aa@12345'),
('employee3', 'TinhAnhAdmin', '+15554445555', 'maria.garcia@ebookstore.com', 'Aa@12345'),
('TinhAnhNeNe', 'TinhAnhAdmin', '+15554445555', 'maria.garcia@ebookstore.com', 'Aa@12345');


INSERT INTO CUSTOMER (username, address, bank_acc) VALUES
('johnDoe', '123 Main St, Anytown, USA', 'ACC1234567890'),
('janeSmith', '456 Oak Ave, Anycity, USA', 'ACC9876543210'),
('robertBrown', '789 Pine St, Anytown, USA', 'ACC4567890123'),
('lisaJones', '101 Elm Ave, Anycity, USA', 'ACC7890123456'),
('TinhAnhNeNe', '101 Elm Ave, Anycity, USA', '+ACC7890123456');


INSERT INTO EMPLOYEE (username, employee_id) VALUES
('employee1', 1),
('employee2', 2),
('employee3', 3);



-- Inserting authors with different birth dates and biographies

INSERT INTO AUTHOR (name, dob, biography) VALUES
('Stephen King', '1947-09-21', 'A prolific author of horror and suspense.'),
('Jane Austen', '1775-12-16', 'Known for her social commentary and wit.'),
('Agatha Christie', '1890-09-15', 'Queen of mystery novels.'),
('J.R.R. Tolkien', '1892-01-03', 'Author of The Lord of the Rings.');

	
-- Inserting publishers with varied information
INSERT INTO PUBLISHER (pu_name, pu_phone_number, pu_address) VALUES
('Penguin Random House', '+15551112233', 'New York, NY'),
('Hachette Book Group', '+15551112244', 'New York, NY'),
('HarperCollins', '+15551112255', 'New York, NY'),
('Simon & Schuster', '+15551112266', 'New York, NY');


-- BOOKS 
INSERT INTO BOOK (title, price, author_id, pu_id, imageURL) VALUES
('RESTful Web APIs', 19.99, 1, 1, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTAW9HJ-EKngdkH1nC3HWIK8UyePu9R-j4OcAWCDIokFBujrM6hSwFDTxg6mzkH0YDPHX7qHIcoh6hVdmaNPYBlH9U9BIk_fZAfyYu99Ru092Qea3o9YzBM&usqp=CAE'),
('Designing Web APIs', 9.99, 2, 2, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcScHOfsYKZNbXmqqqskPefa_9ykRCg2Qet9Si7gFNefNMAtPsFUTqpaArKLLhsZC61Oka6BAM1fsY-p8-Gl5GdtYdbJptA166kaBP6MtM0&usqp=CAE'), 
('And Then There Were None', 12.99, 3, 3, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR36_Z7ph6JLPYLJWAAJN0wiIQo59nQKchQa8PTBFepEVgV4-MnlNYAUL_Idt3bdKRXG0LCn-lIYdBmetBxQ0w5L8fpW8kTZA3xkJu45Zc6&usqp=CAE'),
('The Hobbit', 14.99, 4, 4, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRIINvNK1TnoK0Im2hbEIJ1-6or47SvAbAJdP0lwKkJZ1XVpC-KTyCKVyfIw7w9cHGPYWLoTX-fzosT06FQs7bKQpn2JcuRb0hkqYcYm5vmYEEwCPPcrWeE&usqp=CAE');


INSERT INTO GENRE (gen_id, genre_name, description) VALUES
(1, 'Horror', 'Fiction with scary themes.'),
(2, 'Romance', 'Stories about love and relationships.'),
(3, 'Mystery', 'Stories with puzzling crimes.'),
(4, 'Fantasy', 'Imaginative worlds and creatures.');


INSERT INTO BOOK_GENRE (book_id, gen_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4);


INSERT INTO `ORDER` (order_time, order_status, username) VALUES
('2024-10-05 10:00:00', 'Pending', 'johnDoe'),
('2024-10-06 12:30:00', 'Pending', 'janeSmith'),
('2024-10-05 14:00:00', 'Pending', 'robertBrown'),
('2024-10-06 16:30:00', 'Pending', 'lisaJones');

INSERT INTO ORDER_BOOK (order_id, book_id, quantity,in_cart) VALUES
(1, 1, 1,true),
(1,2,3,true), 
(1,3,3,true),
(1,4,3,true),
(2, 2, 2,true),
(3, 3, 1,true),
(4, 4, 1,true);

INSERT INTO ORDER_PUBLISHER (pu_order_status, pu_order_time, username, pu_id) VALUES
('Pending', '2024-10-01', 'employee1', 1),
('Pending', '2024-10-02', 'employee2', 2);

INSERT INTO ORDER_PUBLISHER_BOOK (book_id, pu_order_id, quantity) VALUES
(1, 1, 100),
(2, 2, 50);

SELECT * FROM `order`;
