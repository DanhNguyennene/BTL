// src/components/shop/ShopBookCard.jsx
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card/Card";

const ShopBookCard = ({ book }) => (
    <Card className="book-card hover:shadow-lg transition-shadow">
        <CardHeader>
            <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4">
                <img
                    src={book.image_url || "/api/placeholder/240/320"}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>
            <CardTitle className="line-clamp-2">{book.title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-gray-500">Author ID: {book.author_id}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
            <span className="text-xl font-bold">${book.price}</span>
            <button className="add-to-cart-button px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Add to Cart
            </button>
        </CardFooter>
    </Card>
);

export default ShopBookCard;
