// src/components/shop/ShopFilters.jsx
import React from 'react';
import Slider from "../ui/slider/Slider";

const ShopFilters = ({ priceRange, setPriceRange }) => (
    <div className="shop-filters py-4">
        <h3 className="font-semibold mb-4">Price Range</h3>
        <Slider
            defaultValue={[0, 100]}
            max={100}
            step={1}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-2"
        />
        <div className="flex justify-between text-sm text-gray-500">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
        </div>
    </div>
);

export default ShopFilters;
