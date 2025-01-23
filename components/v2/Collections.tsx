"use client";
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import { TbSortAscendingNumbers, TbSortDescendingNumbers } from 'react-icons/tb';
import { MdClear } from 'react-icons/md';

interface CollectionsProps {
    data: {
        campaign_title: string;
        description: string;
        price: {
            offerPrice: { value: string; prefix: string };
            originalPrice: { value: string; prefix: string };
            discount: string;
        };
        meta_description: {
            image: { url: string };
        };
        product_handle?: string;
        offer_id?: string;
        variant: Array<{
            _id: string;
            campaign_title: string;
            description: string;
            price: {
                offerPrice: { value: string; prefix: string };
                originalPrice: { value: string; prefix: string };
                discount: string;
            };
            meta_description: {
                image: { url: string };
            };
            product_handle?: string;
            variant_id?: string;
            offer_id?: string;
        }>;
        config: {
            font_family: string;
            primary_color: string;
            secondary_color: string;
            header_text: string;
            footer_text: string;
            button_text: string;
        };
    };
}

const Collections: React.FC<CollectionsProps> = ({ data }) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'none' | 'low-to-high' | 'high-to-low'>('none');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleCardClick = (variant: typeof data.variant[0]) => {
        if (variant.product_handle) {
            router.push(`/products/${variant.product_handle}?variant_id=${variant.variant_id}`);
        } else if (variant.offer_id) {
            router.push(`/${variant.offer_id}`);
        }
    };

    const filteredAndSortedVariants = useMemo(() => {
        let filtered = data.variant.filter(variant =>
            variant.campaign_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            variant.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortOrder !== 'none') {
            filtered.sort((a, b) => {
                const priceA = parseFloat(a.price.offerPrice.value);
                const priceB = parseFloat(b.price.offerPrice.value);
                return sortOrder === 'low-to-high' ? priceA - priceB : priceB - priceA;
            });
        }

        return filtered;
    }, [data.variant, searchTerm, sortOrder]);

    const getSortLabel = () => {
        switch (sortOrder) {
            case 'low-to-high':
                return 'Price: Low to High';
            case 'high-to-low':
                return 'Price: High to Low';
            default:
                return 'Sort by';
        }
    };

    const handleSortChange = (value: typeof sortOrder) => {
        setSortOrder(value);
        setIsDropdownOpen(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <div className="sticky top-0 h-auto z-50">
                <p
                    style={{
                        backgroundColor: "#073e0a",
                        color: 'white',
                    }}
                    className="text-[12px] text-center p-2 px-6"
                >
                    Buy 2 Get 1 FREE
                </p>
                <div className="flex flex-col items-center justify-center py-2 bg-white -z-50">
                    <Image
                        alt={"upload a logo"}
                        src={"https://res.cloudinary.com/duslrhgcq/image/upload/v1732677222/lbjwkpakjmxeos1cpedq.png"}
                        className="h-[60px] py-2 height-auto object-contain"
                        width={310}
                        height={310}
                    />
                </div>
            </div>
            <Image src={"https://saptamveda.com/cdn/shop/files/Group-02_70c7f1fa-78c4-4612-a668-c831e60a8221.jpg?v=1642836797"}
                alt="hero banner image"
                width={1500}
                height={1000}
                className='w-full'
            />
            <main className="flex-grow p-6 mb-4">
                <div className="mt-2 mb-6 text-gray-700 text-center">
                    <p className="text-2xl font-medium">
                        Discover our exclusive collection of products
                    </p>
                    <p className="mt-2 text-sm">
                        <span className="font-semibold">{filteredAndSortedVariants.length} Products</span>
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Search Bar */}
                    <div className="relative w-full sm:w-96">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <MdClear size={20} />
                            </button>
                        )}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative min-w-[190px]">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                        >
                            <div className="flex items-center gap-2">
                                {sortOrder === 'low-to-high' && <TbSortAscendingNumbers size={20} className="text-green-600" />}
                                {sortOrder === 'high-to-low' && <TbSortDescendingNumbers size={20} className="text-green-600" />}
                                <span className={`${sortOrder !== 'none' ? 'text-green-600 font-medium text-sm' : 'text-gray-700 text-sm'}`}>
                                    {getSortLabel()}
                                </span>
                            </div>
                            <svg
                                className={`w-4 h-4 ml-2 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsDropdownOpen(false)}
                                />
                                <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 animate-fadeIn">
                                    <button
                                        onClick={() => handleSortChange('none')}
                                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${sortOrder === 'none' ? 'text-green-600 bg-gray-50' : 'text-gray-700'
                                            }`}
                                    >
                                        <span className="w-5" />
                                        Sort by
                                    </button>
                                    <button
                                        onClick={() => handleSortChange('low-to-high')}
                                        className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2 ${sortOrder === 'low-to-high' ? 'text-green-600 bg-gray-50' : 'text-gray-700'
                                            }`}
                                    >
                                        <TbSortAscendingNumbers size={20} />
                                        Price: Low to High
                                    </button>
                                    <button
                                        onClick={() => handleSortChange('high-to-low')}
                                        className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2 ${sortOrder === 'high-to-low' ? 'text-green-600 bg-gray-50' : 'text-gray-700'
                                            }`}
                                    >
                                        <TbSortDescendingNumbers size={20} />
                                        Price: High to Low
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAndSortedVariants.length > 0 ? (
                        filteredAndSortedVariants.map((variant) => (
                            <div
                                key={variant._id}
                                className="relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                onClick={() => handleCardClick(variant)}
                            >
                                {variant.price.discount !== '0.00' && variant.price.discount !== '0' && (
                                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
                                        {variant.price.discount}% OFF
                                    </div>
                                )}

                                <Image src={variant.meta_description.image.url}
                                    alt="Image"
                                    height={340}
                                    width={340}
                                    className='rounded-t-lg'
                                />

                                <div className="p-4 ">
                                    <h2 className="text-lg font-semibold text-gray-800">{variant.campaign_title}</h2>
                                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{variant.description}</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        {/* Offer Price */}
                                        <span className="text-green-600 font-bold text-lg">
                                            {variant.price.offerPrice.prefix}
                                            {variant.price.offerPrice.value}
                                        </span>
                                        {/* Original Price */}
                                        {variant.price.discount !== '0.00' && variant.price.discount !== '0' && (
                                            <span className="text-gray-400 line-through text-sm">
                                                {variant.price.originalPrice.prefix}
                                                {variant.price.originalPrice.value}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10">
                            <p className="text-gray-500 text-sm">No products found matching your search.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Collections;