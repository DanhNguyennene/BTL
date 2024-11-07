import React from 'react';

const ShopFilters = ({ priceRange, setPriceRange }) => {
    return (
        <div className="shop-filters mb-4">
            <label>Price Range</label>
            <input
                type="range"
                min={0}
                max={100}
                value={priceRange}
                onChange={(e) => setPriceRange([0, e.target.value])}
                className="w-full mt-2"
            />
            <div className="flex justify-between text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
            </div>
        </div>
    );
};

export default ShopFilters;
