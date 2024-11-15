const express = require('express');
const router = express.Router();
const {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    deleteAllBooks,
    filterBooks,
    searchBookTitles,
    getAuthors,
    getOrders,
    getPublisherOrders,
    getPublishers,
    createAuthor,
    updateAuthor,
    getGenres,
    createGenre,
    updateGenre,
    deleteGenre,
    createPublisher,
    updatePublisher,
    deletePublisher,
    createBookGenre,
    createOrder,
    createOrderPublisher,
    getOrder,
    deleteAuthor,

} = require('../controllers/book.controllers');
router.get('/', getBooks);
router.get('/filter', filterBooks);
router.get('/authors', getAuthors);
router.get('/genres', getGenres);
router.get('/publishers', getPublishers);
router.get('/:book_id', getBook);
router.get('/search', searchBookTitles);


// TODO:
router.get('/orders', getOrders);
// dùng để employee xem tất cả orders của user
// employee dashboard
router.get('/order/:username', getOrder);
// dung de user xem các order của mình
// user dashboard
router.get('/order_publisher', getPublisherOrders);
// dùng để employee xem tất cả orders đến publisher
// employee dashboard

router.post('/', createBook);
// dùng để admin tạo book mới
// khi tạo book mới, admin cần nhập title, price, author_id, pu_id, imageURL
// nếu author_id và pu_id chưa có trong db, admin cần tạo author và publisher mới trước
// HOẶC admin có thể nhập author_name và pu_name để tạo author và publisher mới trong form tạo book, và
// db sẽ tự động thêm vào author và publisher table, tuy nhiên, phần description của các trường này có 
// thể bị trống, admin cân nhắc nhập thêm thông tin sau khi tạo book
// tạo một droplist để chọn genre cho book, sau đó, db sẽ tự động thêm vào book_genre table (POST /book_genre)
// employee dashboard
// TODO:
router.post('/author', createAuthor);
// dùng để admin tạo author mới
// employee dashboard
router.put('/author/:author_id', updateAuthor);
// dùng để admin sửa author mới
// employee dashboard
router.delete('/author/:author_id', deleteAuthor);
// dùng để admin xóa author
// employee dashboard
router.post('/genre', createGenre);
// dùng để admin tạo genre mới
// employee dashboard
router.put('/genre/:gen_id', updateGenre);
// dùng để admin sửa genre
// employee dashboard
router.delete('/genre/:gen_id', deleteGenre);
// dùng để admin xóa genre
// employee dashboard
router.post('/publisher', createPublisher);
// dùng để admin tạo publisher mới
// employee dashboard
router.put('/publisher/:pu_id', updatePublisher);
// dùng để admin sửa publisher mới
// employee dashboard
router.delete('/publisher/:pu_id', deletePublisher);
// dùng để admin xóa publisher
// employee dashboard
router.post('/book_genre', createBookGenre);
// dùng để admin tạo book_genre mới
// hỗ trợ cho việc tạo book mới (POST /)
router.post('/order', createOrder);
// dùng để user tạo order mới
// sẽ update cho order_book table vì mỗi order sẽ có nhiều sách
// nút Purchase
router.post('/order_publisher', createOrderPublisher);
// dùng để employee tạo order đến publisher
// sẽ update cho order_publisher_book table vì mỗi order sẽ có nhiều sách
// employee dashboard

router.patch('/:book_id', updateBook);
// tạm thời chưa có update author và publisher cho đỡ phức tạp 👍
router.delete('/:book_id', deleteBook);
router.delete('/', deleteAllBooks);


module.exports = router;
