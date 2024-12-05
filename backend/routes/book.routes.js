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
    getGenres,
    getOrders,
    showAllBookInCart,
    updateOrderBookQuantity,
    deleteOrderBook,
    deleteOrder,
    insertNotAlreadyInCart,
    clearCart,
    getPublisherOrders,
    getPublishers,
    createAuthor,
    updateAuthor,
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
    getPublisherOrder,
    updateOrderStatus,
    updatePublisherOrderStatus,
    getAllOrderLogs,
    getOrderLogs,
    getCustomerOrderLogs,
    getOrderStatusHistory,
    getEmployeeNotifications,
    getEmployeeUnreadNotifications,
    getCustomerNotifications,
    getCustomerUnreadNotifications,
    markNotificationAsRead,
    deleteNotification

} = require('../controllers/book.controllers');
router.get('/', getBooks);
router.get('/filter', filterBooks);
router.get('/authors', getAuthors);

router.get('/genres', getGenres);
router.get('/publishers', getPublishers);
router.get('/orders', getOrders);
router.get('/order_publisher', getPublisherOrders);
router.get('/search', searchBookTitles);
router.get('/order_publisher/:employeeUsername/:pu_order_id', getPublisherOrder);


router.get('/order/:username', getOrder); // xong




// dung de user xem các order của mình
// user dashboard
router.get('/order_publishers/:employeeUsername', getPublisherOrders);

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
router.post('/author', createAuthor); //xong
// dùng để admin tạo author mới
// employee dashboard
router.put('/author/:author_id', updateAuthor); //xong
// dùng để admin sửa author mới
// employee dashboard
router.delete('/author/:author_id', deleteAuthor); //xong
// dùng để admin xóa author
        

router.patch('/order/:username/:order_id/status', updateOrderStatus);
router.patch('/pubisher-order/:pu_order_id/status',updatePublisherOrderStatus)



// employee dashboard
router.post('/genre', createGenre);//xong
// dùng để admin tạo genre mới
// employee dashboard
router.put('/genre/:gen_id', updateGenre);//xong
// dùng để admin sửa genre
// employee dashboard
router.delete('/genre/:gen_id', deleteGenre); //xong
// dùng để admin xóa genre



// employee dashboard
router.post('/publisher', createPublisher); //xong
// dùng để admin tạo publisher mới
// employee dashboard
router.put('/publisher/:pu_id', updatePublisher);//xong
// dùng để admin sửa publisher mới
// employee dashboard
router.delete('/publisher/:pu_id', deletePublisher);//xong
// dùng để admin xóa publisher
// employee dashboard



router.post('/book_genre', createBookGenre);
// dùng để admin tạo book_genre mới
// hỗ trợ cho việc tạo book mới (POST /)



router.post('/cart/:username/create', createOrder);
// dùng để user tạo order mới
// sẽ update cho order_book table vì mỗi order sẽ có nhiều sách
// nút Purchase
router.get('/cart/:username', showAllBookInCart);
// dùng để user xem các sách trong giỏ hàng của mình
// user dashboard
// nút View Cart
router.put('/cart/:username', updateOrderBookQuantity);
// dùng để user cập nhật số lượng sách trong giỏ hàng
// user dashboard
// nút Update Cart
router.post('/cart/:username/remove', deleteOrderBook);
// dùng để user xóa sách trong giỏ hàng
// user dashboard
// nút Remove
router.post('/cart/:username/removeCart', deleteOrder);
// dùng để user xóa  giỏ hàng
// user dashboard
// nút Remove
router.post('/cart/:username/insert', insertNotAlreadyInCart);
// dùng để user thêm sách vào giỏ hàng
// user dashboard
// nút Add to Cart
router.patch('/cart/:username/clearCart', clearCart);
// dùng để user xóa toàn bộ giỏ hàng
// user dashboard
// nút Clear Cart

router.post('/order_publishers', createOrderPublisher);
// dùng để employee tạo order đến publisher
// sẽ update cho order_publisher_book table vì mỗi order sẽ có nhiều sách
// employee dashboard

router.patch('/:book_id', updateBook);
router.delete('/:book_id', deleteBook);
router.delete('/', deleteAllBooks);



router.get('/order-logs', getAllOrderLogs);
router.get('/order-logs/order/:order_id', getOrderLogs);
router.get('/order-logs/customer/:username', getCustomerOrderLogs);
router.get('/order-logs/status-history/:order_id', getOrderStatusHistory);


// employee notification route
router.get('/notifications/employee', getEmployeeNotifications);
router.get('/notifications/employee/unread', getEmployeeUnreadNotifications);

// customer notification route
router.get('/notifications/customer/:username', getCustomerNotifications);
router.get('/notifications/customer/:username/unread', getCustomerUnreadNotifications);


// common routes
router.patch('/notifications/:notification_id/read', markNotificationAsRead);
router.delete('/notifications/:notification_id', deleteNotification);




router.get('/:book_id', getBook);
module.exports = router;



