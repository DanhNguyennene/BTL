use ebookstoredb;


USE EBookstoreDB;

-- SELECT b.*, a.name as authorName, p.pu_name as publisherName, g.genre_name as genreName
-- FROM book b
-- LEFT JOIN author a ON b.author_id = a.author_id
-- LEFT JOIN publisher p ON b.pu_id = p.pu_id
-- LEFT JOIN BOOK_GENRE bg ON b.book_id = bg.book_id
-- LEFT JOIN GENRE g ON bg.gen_id = g.gen_id
-- WHERE 1=1  ;
SELECT *
FROM EMPLOYEE  AS e
JOIN USER AS u ON u.username = e.username;


SELECT *
FROM book_genre;



SELECT
	b.*,
	a.name AS authorName,
	p.pu_name AS publisherName,
	GROUP_CONCAT(g.gen_id) AS genreID,
	GROUP_CONCAT(g.genre_name) AS genreName
FROM 
	BOOK b
LEFT JOIN 
	AUTHOR a ON b.author_id = a.author_id
LEFT JOIN 
	PUBLISHER p ON b.pu_id = p.pu_id
LEFT JOIN 
	BOOK_GENRE bg ON b.book_id = bg.book_id
LEFT JOIN 
	GENRE g ON bg.gen_id = g.gen_id
GROUP BY
	b.book_id, a.name, p.pu_name;
                  
                  
                  

-- UPDATE book SET title = "To Kill a Mockingbird", price = "9.99", author_id = 1, pu_id = 1 WHERE book_id = ?



-- SELECT 
-- 	u.*,
-- 	CASE 
-- 		WHEN c.username IS NOT NULL THEN 'customer'
-- 		WHEN e.username IS NOT NULL THEN 'employee'
-- 		ELSE NULL
-- 	END as user_type
-- FROM USER u
-- LEFT JOIN CUSTOMER c ON u.username = c.username
-- LEFT JOIN EMPLOYEE e ON u.username = e.username
-- WHERE u.username = 'janeSmith';

SELECT 
	`order`.*,
	order_book.*,
	book.book_id,
	book.title,
	book.price, 
	book.author_id,
	book.pu_id,
	book.imageURL
FROM 
	`order`
JOIN 
	order_book ON `order`.order_id = order_book.order_id
JOIN 
	book ON order_book.book_id = book.book_id
WHERE 
	`order`.username = 'johnDoe'
AND
	order_book.in_cart = TRUE;
    
    
SELECT * FROM order WHERE username = 'johnDoe';