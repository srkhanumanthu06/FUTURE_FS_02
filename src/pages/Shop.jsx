import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import { SlidersHorizontal, ArrowUpDown, ChevronDown, Check } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../components/ui/Button';

export const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');

    // --- State ---
    const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'All');
    const [sortBy, setSortBy] = useState('featured');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Sync state with URL if it changes externally
    useEffect(() => {
        if (urlCategory) {
            setSelectedCategory(urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1));
        } else {
            setSelectedCategory('All');
        }
    }, [urlCategory]);

    // Handle Category Change
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === 'All') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', category.toLowerCase());
        }
        setSearchParams(searchParams);
        setIsMobileFilterOpen(false); // Close mobile drawer
    };

    // --- Derived Data ---
    const uniqueCategories = ['All', ...new Set(products.map(p => p.category))];

    // Shuffle products once on mount for random "Featured" order in "All" category
    // We use useMemo to keep the order stable across re-renders until reload
    const shuffledProducts = useMemo(() => [...products].sort(() => 0.5 - Math.random()), []);

    // --- Filtering & Sorting Logic ---
    // Use shuffled products if Category is 'All' and Sort is 'Featured'
    const sourceProducts = (selectedCategory === 'All' && sortBy === 'featured') ? shuffledProducts : products;

    const filteredProducts = sourceProducts
        .filter(product => {
            // Category Filter
            const matchesCategory = selectedCategory === 'All' ||
                product.category.toLowerCase() === selectedCategory.toLowerCase();

            // Search Filter
            const matchesSearch = !urlSearch ||
                product.name.toLowerCase().includes(urlSearch.toLowerCase()) ||
                product.category.toLowerCase().includes(urlSearch.toLowerCase());

            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            return 0; // 'featured' order (preserves source order)
        });

    return (
        <div className="pt-8 pb-20 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">

                {/* --- Filters Sidebar (Desktop) --- */}
                <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8 sticky top-24 h-fit">
                    {/* Category Filter */}
                    <div>
                        <h3 className="font-serif font-bold text-xl mb-4">Categories</h3>
                        <div className="space-y-2">
                            {uniqueCategories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={clsx(
                                        "block w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors",
                                        selectedCategory === category
                                            ? "bg-primary text-white font-medium shadow-md"
                                            : "text-text-muted hover:bg-gray-100 hover:text-text"
                                    )}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>


                </aside>

                {/* --- Main Content --- */}
                <div className="flex-1">
                    {/* Top Bar for Mobile Filter Toggle & Sort */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-text">
                                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                            </h1>
                            <p className="text-text-muted text-sm mt-1">
                                Showing {filteredProducts.length} result{filteredProducts.length !== 1 && 's'}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Mobile Filter Button */}
                            <Button
                                variant="outline"
                                className="lg:hidden flex items-center gap-2"
                                onClick={() => setIsMobileFilterOpen(true)}
                            >
                                <SlidersHorizontal size={18} /> Filters
                            </Button>

                            {/* Sort Dropdown */}
                            <div className="relative group">
                                <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 bg-white cursor-pointer hover:border-gray-300">
                                    <span className="text-sm text-text-muted">Sort by:</span>
                                    <span className="text-sm font-medium min-w-[80px]">
                                        {sortBy === 'featured' && 'Featured'}
                                        {sortBy === 'price-low' && 'Price: Low'}
                                        {sortBy === 'price-high' && 'Price: High'}
                                        {sortBy === 'name' && 'Name'}
                                    </span>
                                    <ChevronDown size={14} className="text-text-muted" />
                                </div>
                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 shadow-xl rounded-md overflow-hidden hidden group-hover:block z-20">
                                    {[
                                        { label: 'Featured', value: 'featured' },
                                        { label: 'Price: Low to High', value: 'price-low' },
                                        { label: 'Price: High to Low', value: 'price-high' },
                                        { label: 'Name: A-Z', value: 'name' },
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => setSortBy(option.value)}
                                            className={clsx(
                                                "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between",
                                                sortBy === option.value ? "text-primary font-medium bg-primary/5" : "text-text"
                                            )}
                                        >
                                            {option.label}
                                            {sortBy === option.value && <Check size={14} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <p className="text-lg text-text-muted mb-2">No products found.</p>
                            <p className="text-sm text-text-muted">Try adjusting your price range or category.</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => {
                                    setSelectedCategory('All');
                                    setSearchParams({});
                                }}
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- Mobile Filter Drawer (Overlay) --- */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileFilterOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-serif font-bold">Filters</h2>
                            <button
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="p-2 -mr-2 text-text-muted hover:text-text"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Category Filter Mobile */}
                            <div>
                                <h3 className="font-bold text-lg mb-3">Categories</h3>
                                <div className="space-y-2">
                                    {uniqueCategories.map(category => (
                                        <button
                                            key={category}
                                            onClick={() => handleCategoryChange(category)}
                                            className={clsx(
                                                "block w-full text-left px-3 py-2 rounded-md text-sm transition-colors border",
                                                selectedCategory === category
                                                    ? "bg-primary text-white border-primary"
                                                    : "bg-white text-text border-gray-200"
                                            )}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>



                            {/* Apply Button Mobile */}
                            <Button
                                className="w-full py-3 mt-4"
                                onClick={() => setIsMobileFilterOpen(false)}
                            >
                                Show {filteredProducts.length} Results
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
