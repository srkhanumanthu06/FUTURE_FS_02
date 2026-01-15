import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/products';
import { Button } from '../components/ui/Button';
import { ShoppingBag, Star, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import clsx from 'clsx';

export const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return <div className="p-20 text-center">Product not found</div>;
    }

    // UI States for selections (Samsung specific)
    const [selectedColor, setSelectedColor] = useState('Titanium Gray');
    const colors = [
        { name: 'Titanium Gray', hex: '#878681', image: '/images/products/samsung-s25-ultra/titanium-gray.png' },
        { name: 'Titanium Black', hex: '#2C2C2C', image: '/images/products/samsung-s25-ultra/titanium-black.png' },
        { name: 'Titanium Silver', hex: '#E3E3E3', image: '/images/products/samsung-s25-ultra/titanium-silver.png' },
        { name: 'Titanium SilverBlue', hex: '#B8C4D6', image: '/images/products/samsung-s25-ultra/titanium-silverblue.png' },
    ];

    // State for main image selection
    const [selectedImage, setSelectedImage] = useState(null);

    // Reset selection logic when product changes
    useEffect(() => {
        if (product && product.id !== 9 && product.slides && product.slides.length > 0) {
            setSelectedImage(product.slides[0]);
        } else {
            setSelectedImage(null);
        }
    }, [product]);

    // Update selected image logic
    let displayImage = product.image;
    if (product.id === 9) {
        // Samsung S25 Hybrid Logic: Show slide if selected, else show color variant
        if (selectedImage) {
            displayImage = selectedImage;
        } else {
            displayImage = colors.find(c => c.name === selectedColor)?.image || product.image;
        }
    } else if (product.slides && product.slides.length > 0) {
        // Standard Slideshow Logic (Laptop/Aura)
        displayImage = selectedImage || product.slides[0];
    }

    return (
        <div className="pt-8 pb-20 px-4 max-w-7xl mx-auto">
            {/* MOBILE ONLY: Header & Price section (Show First) */}
            <div className="md:hidden mb-6 space-y-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-text mt-2">{product.name}</h1>
                    <div className="flex items-center space-x-4 mt-2">
                        <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <span className="text-text-muted text-sm border-l border-gray-300 pl-4">1,204 Ratings</span>
                    </div>
                </div>
                <div className="border-t border-b border-gray-100 py-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-medium text-text">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-sm text-text-muted mt-1">Inclusive of all taxes</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                {/* Product Image Section */}
                <div className="relative md:sticky md:top-24 h-fit flex flex-col gap-6">
                    {/* Main Image */}
                    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm w-full">
                        <img
                            src={displayImage}
                            alt={product.name}
                            className="w-full h-auto object-contain p-8 max-h-[500px]"
                        />
                    </div>

                    {/* Thumbnails (Bottom) - Only if slides exist */}
                    {product.slides && product.slides.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4">
                            {product.slides.map((slide, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(slide)}
                                    className={clsx(
                                        "w-20 h-20 rounded-md border overflow-hidden flex-shrink-0 bg-white p-1 transition-all",
                                        selectedImage === slide ? "border-primary ring-1 ring-primary scale-105" : "border-gray-200 hover:border-primary/50"
                                    )}
                                >
                                    <img src={slide} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info & Options */}
                <div className="flex flex-col space-y-8">
                    {/* Header (Desktop Only) */}
                    <div className="hidden md:block">
                        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-text mt-2">{product.name}</h1>
                        <div className="flex items-center space-x-4 mt-2">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
                            <span className="text-text-muted text-sm border-l border-gray-300 pl-4">1,204 Ratings</span>
                        </div>
                    </div>

                    {/* Price (Desktop Only) */}
                    <div className="hidden md:block border-t border-b border-gray-100 py-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-medium text-text">₹{product.price.toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-sm text-text-muted mt-1">Inclusive of all taxes</p>
                    </div>

                    {/* SAMSUNG SPECIFIC OPTIONS (ID 9) - Colour Only */}
                    {product.id === 9 && (
                        <div className="space-y-6">
                            {/* Colour Selection */}
                            <div>
                                <span className="text-sm font-medium text-text-muted mb-2 block">Colour: <span className="text-text font-bold">{selectedColor}</span></span>
                                <div className="flex flex-wrap gap-3">
                                    {colors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => {
                                                setSelectedColor(color.name);
                                                setSelectedImage(null); // Switch back to color view
                                            }}
                                            className={clsx(
                                                "w-fit min-w-[80px] p-2 border rounded-md flex flex-col items-center gap-2 transition-all hover:bg-gray-50",
                                                selectedColor === color.name
                                                    ? "border-primary ring-1 ring-primary bg-primary/5"
                                                    : "border-gray-200"
                                            )}
                                        >
                                            <div
                                                className="w-8 h-8 rounded-full shadow-sm border border-gray-100"
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            <span className="text-xs text-text">{color.name}</span>
                                            {/* Mock Delivery Text */}
                                            <div className="text-[10px] text-text-muted text-center leading-tight">
                                                FREE Delivery<br />Tomorrow
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ONEPLUS PAD 3 SPECIFIC OPTIONS (ID 4) - Tablet Style */}
                    {product.id === 4 && (
                        <div className="space-y-4">
                            <div>
                                <span className="text-sm font-medium text-text-muted mb-2 block">Style Name: <span className="text-text font-bold">12 GB RAM + 256 GB</span></span>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        className="px-4 py-2 border border-primary text-primary ring-1 ring-primary bg-primary/5 rounded-md text-sm font-medium transition-all"
                                    >
                                        12 GB RAM + 256 GB
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* UNIFIED MOBILE SIZE OPTION (All Mobiles) */}
                    {product.category === 'Mobiles' && (
                        <div className="space-y-4">
                            <div>
                                <span className="text-sm font-medium text-text-muted mb-2 block">
                                    Size
                                </span>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        className="px-4 py-2 border border-primary text-primary ring-1 ring-primary bg-primary/5 rounded-md text-sm font-medium transition-all"
                                    >
                                        {product.id === 12 ? '16GB + 512GB' :
                                            product.id === 13 ? '12GB+256GB' :
                                                product.id === 14 ? '12GB + 256GB' :
                                                    product.id === 9 ? '12GB + 512GB' :
                                                        product.id === 42 ? '12GB + 256GB' :
                                                            product.id === 11 ? '8GB + 256GB' :
                                                                product.id === 10 ? '16GB + 256GB' :
                                                                    '256 GB'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Specs Table */}
                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="font-bold text-lg mb-4">Product Details</h3>
                        {product.id === 9 ? (
                            // SAMSUNG SPECS
                            <div className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Samsung</span>

                                <span className="font-medium text-text">Operating System</span>
                                <span className="text-text-muted">Android 15.0</span>

                                <span className="font-medium text-text">RAM Memory</span>
                                <span className="text-text-muted">12 GB</span>

                                <span className="font-medium text-text">CPU Model</span>
                                <span className="text-text-muted">Snapdragon 8 Elite</span>

                                <span className="font-medium text-text">CPU Speed</span>
                                <span className="text-text-muted">4.47 GHz</span>
                            </div>
                        ) : product.id === 21 ? (
                            // XIAOMI PAD 7 SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">XIAOMI</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">Xiaomi Pad 7</span>

                                <span className="font-medium text-text">Memory Storage Capacity</span>
                                <span className="text-text-muted">256 GB</span>

                                <span className="font-medium text-text">Screen Size</span>
                                <span className="text-text-muted">11.2 Inches</span>

                                <span className="font-medium text-text">Display Resolution Maximum</span>
                                <span className="text-text-muted">3200 x 2136</span>
                            </div>
                        ) : product.id === 23 ? (
                            // IPAD AIR M3 SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Apple</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">13-inch iPad Air (M3, 2025)</span>

                                <span className="font-medium text-text">Memory Storage Capacity</span>
                                <span className="text-text-muted">128 GB</span>

                                <span className="font-medium text-text">Screen Size</span>
                                <span className="text-text-muted">13 Inches</span>

                                <span className="font-medium text-text">Display Resolution Maximum</span>
                                <span className="text-text-muted">2732x2048 Pixels</span>
                            </div>
                        ) : product.id === 24 ? (
                            // REDMI PAD 2 PRO SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Redmi</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">Redmi Pad 2 Pro</span>

                                <span className="font-medium text-text">Memory Storage Capacity</span>
                                <span className="text-text-muted">128 GB</span>

                                <span className="font-medium text-text">Screen Size</span>
                                <span className="text-text-muted">12.1 Inches</span>

                                <span className="font-medium text-text">Display Resolution Maximum</span>
                                <span className="text-text-muted">2560 x 1600 Pixels</span>
                            </div>
                        ) : product.id === 22 ? (
                            // GALAXY TAB S11 SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Samsung</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">Samsung Galaxy Tab S11</span>

                                <span className="font-medium text-text">Memory Storage Capacity</span>
                                <span className="text-text-muted">128 GB</span>

                                <span className="font-medium text-text">Screen Size</span>
                                <span className="text-text-muted">11 Inches</span>

                                <span className="font-medium text-text">Display Resolution Maximum</span>
                                <span className="text-text-muted">2560 x 1600 Pixels Per Inch</span>
                            </div>
                        ) : product.id === 25 ? (
                            // LENOVO IDEA TAB PRO SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Lenovo</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">IdeaTab Pro</span>

                                <span className="font-medium text-text">Memory Storage Capacity</span>
                                <span className="text-text-muted">256 GB</span>

                                <span className="font-medium text-text">Screen Size</span>
                                <span className="text-text-muted">12.7 Inches</span>

                                <span className="font-medium text-text">Display Resolution Maximum</span>
                                <span className="text-text-muted">2944x1840 Pixels</span>
                            </div>
                        ) : product.id === 4 ? (
                            // ONEPLUS PAD 3 SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">OnePlus</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">OnePlus Pad 3</span>

                                <span className="font-medium text-text">Memory Storage Capacity</span>
                                <span className="text-text-muted">256 GB</span>

                                <span className="font-medium text-text">Screen Size</span>
                                <span className="text-text-muted">13.2 Inches</span>

                                <span className="font-medium text-text">Display Resolution Maximum</span>
                                <span className="text-text-muted">3392*2400</span>
                            </div>
                        ) : product.id === 5 ? (
                            // JBL WAVE BUDS 2 SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">JBL</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">Wave Buds 2</span>

                                <span className="font-medium text-text">Colour</span>
                                <span className="text-text-muted">Black</span>

                                <span className="font-medium text-text">Ear Placement</span>
                                <span className="text-text-muted">In Ear</span>

                                <span className="font-medium text-text">Form Factor</span>
                                <span className="text-text-muted">True Wireless</span>
                            </div>
                        ) : product.id === 28 ? (
                            // SONY WH-1000XM5 SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Sony</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">WH-1000XM5</span>

                                <span className="font-medium text-text">Colour</span>
                                <span className="text-text-muted">Platinum Silver</span>

                                <span className="font-medium text-text">Form Factor</span>
                                <span className="text-text-muted">Over Ear</span>

                                <span className="font-medium text-text">Connectivity</span>
                                <span className="text-text-muted">Wireless</span>
                            </div>
                        ) : product.id === 29 ? (
                            // SAMSUNG GALAXY BUDS3 PRO SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Samsung</span>

                                <span className="font-medium text-text">Style</span>
                                <span className="text-text-muted">Buds3 Pro</span>

                                <span className="font-medium text-text">Colour</span>
                                <span className="text-text-muted">Silver</span>

                                <span className="font-medium text-text">Ear Placement</span>
                                <span className="text-text-muted">In Ear</span>

                                <span className="font-medium text-text">Form Factor</span>
                                <span className="text-text-muted">In Ear</span>
                            </div>
                        ) : product.id === 30 ? (
                            // CMF BY NOTHING BUDS PRO SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">CMF BY NOTHING</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">Buds Pro</span>

                                <span className="font-medium text-text">Colour</span>
                                <span className="text-text-muted">orange</span>

                                <span className="font-medium text-text">Ear Placement</span>
                                <span className="text-text-muted">In Ear</span>

                                <span className="font-medium text-text">Form Factor</span>
                                <span className="text-text-muted">In Ear</span>
                            </div>
                        ) : product.id === 31 ? (
                            // REALME BUDS T310 SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">realme</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">Buds T310</span>

                                <span className="font-medium text-text">Colour</span>
                                <span className="text-text-muted">Black</span>

                                <span className="font-medium text-text">Form Factor</span>
                                <span className="text-text-muted">In Ear</span>

                                <span className="font-medium text-text">Connectivity</span>
                                <span className="text-text-muted">Wireless</span>
                            </div>
                        ) : product.id === 32 ? (
                            // BOAT ROCKERZ 650 PRO SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">boAt</span>

                                <span className="font-medium text-text">Colour</span>
                                <span className="text-text-muted">Iris Black</span>

                                <span className="font-medium text-text">Ear Placement</span>
                                <span className="text-text-muted">Over Ear</span>

                                <span className="font-medium text-text">Form Factor</span>
                                <span className="text-text-muted">Over Ear</span>

                                <span className="font-medium text-text">Noise Control</span>
                                <span className="text-text-muted">None</span>
                            </div>
                        ) : product.id === 33 ? (
                            // BOAT AIRDOPES 141 ELITE ANC SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">boAt</span>

                                <span className="font-medium text-text">Noise Control</span>
                                <span className="text-text-muted">Active Noise Cancellation</span>

                                <span className="font-medium text-text">Included Components</span>
                                <span className="text-text-muted">Additional Earbuds, Cable, TWS Earbuds, User Manual</span>

                                <span className="font-medium text-text">Colour</span>
                                <span className="text-text-muted">Black</span>

                                <span className="font-medium text-text">Ear Placement</span>
                                <span className="text-text-muted">In Ear</span>
                            </div>
                        ) : product.id === 41 ? (
                            // NOISE BUDS N1 TWS SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Noise</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">Buds N1</span>

                                <span className="font-medium text-text">Colour</span>
                                <span className="text-text-muted">Beige</span>

                                <span className="font-medium text-text">Ear Placement</span>
                                <span className="text-text-muted">In Ear</span>

                                <span className="font-medium text-text">Form Factor</span>
                                <span className="text-text-muted">True Wireless</span>
                            </div>
                        ) : product.id === 3 ? (
                            // ONEPLUS BUDS SPECS
                            <div className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">OnePlus</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">OnePlus Buds 4</span>

                                <span className="font-medium text-text">Colour</span>
                                <span className="text-text-muted">Storm Gray</span>

                                <span className="font-medium text-text">Ear Placement</span>
                                <span className="text-text-muted">In Ear</span>

                                <span className="font-medium text-text">Form Factor</span>
                                <span className="text-text-muted">In Ear</span>
                            </div>
                        ) : product.id === 14 ? (
                            // SAMSUNG FOLD 7 SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Samsung</span>

                                <span className="font-medium text-text">Operating System</span>
                                <span className="text-text-muted">Android 16.0</span>

                                <span className="font-medium text-text">RAM Memory Installed Size</span>
                                <span className="text-text-muted">12 GB</span>

                                <span className="font-medium text-text">CPU Model</span>
                                <span className="text-text-muted">Snapdragon 8 Elite</span>

                                <span className="font-medium text-text">CPU Speed</span>
                                <span className="text-text-muted">4.47 GHz</span>

                                <span className="font-medium text-text">Memory Storage Capacity</span>
                                <span className="text-text-muted">256 GB</span>
                            </div>
                        ) : product.id === 42 ? (
                            // SAMSUNG A55 SPECS
                            <div className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Samsung</span>

                                <span className="font-medium text-text">Operating System</span>
                                <span className="text-text-muted">Android 14</span>

                                <span className="font-medium text-text">RAM Memory</span>
                                <span className="text-text-muted">12 GB</span>

                                <span className="font-medium text-text">CPU Model</span>
                                <span className="text-text-muted">Others (Exynos 1480)</span>

                                <span className="font-medium text-text">CPU Speed</span>
                                <span className="text-text-muted">2.75 GHz</span>
                            </div>
                        ) : product.id === 11 ? (
                            // SAMSUNG S24 SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Samsung</span>

                                <span className="font-medium text-text">Operating System</span>
                                <span className="text-text-muted">Android 14</span>

                                <span className="font-medium text-text">RAM Memory Installed Size</span>
                                <span className="text-text-muted">8 GB</span>

                                <span className="font-medium text-text">CPU Model</span>
                                <span className="text-text-muted">Cortex</span>

                                <span className="font-medium text-text">CPU Speed</span>
                                <span className="text-text-muted">2.4 GHz</span>
                            </div>
                        ) : product.id === 10 ? (
                            // PIXEL 10 PRO XL SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Google</span>

                                <span className="font-medium text-text">Operating System</span>
                                <span className="text-text-muted">Android 16</span>

                                <span className="font-medium text-text">RAM Memory Installed Size</span>
                                <span className="text-text-muted">16 GB</span>

                                <span className="font-medium text-text">CPU Model</span>
                                <span className="text-text-muted">G5</span>

                                <span className="font-medium text-text">CPU Speed</span>
                                <span className="text-text-muted">3.77 GHz</span>
                            </div>
                        ) : product.id === 12 ? (
                            // IQOO 15 SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">iQOO</span>

                                <span className="font-medium text-text">Operating System</span>
                                <span className="text-text-muted">Origin OS 6.0 based on Android 16.0</span>

                                <span className="font-medium text-text">RAM Memory Installed Size</span>
                                <span className="text-text-muted">16 GB</span>

                                <span className="font-medium text-text">CPU Model</span>
                                <span className="text-text-muted">Snapdragon</span>

                                <span className="font-medium text-text">CPU Speed</span>
                                <span className="text-text-muted">4.6 GHz</span>
                            </div>
                        ) : product.id === 6 ? (
                            // FASTRACK ASTOR FR2 PRO SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Fastrack</span>

                                <span className="font-medium text-text">Operating System</span>
                                <span className="text-text-muted">android</span>

                                <span className="font-medium text-text">Battery Capacity</span>
                                <span className="text-text-muted">5 Days</span>

                                <span className="font-medium text-text">Connectivity Technology</span>
                                <span className="text-text-muted">Bluetooth</span>

                                <span className="font-medium text-text">Wireless Communication</span>
                                <span className="text-text-muted">Bluetooth</span>

                                <span className="font-medium text-text">Special Feature</span>
                                <span className="text-text-muted">Activity Tracker, Heart Rate Monitor, Multisport Tracker, Phone Call, Stress Tracking</span>
                            </div>
                        ) : product.id === 34 ? (
                            // FIRE-BOLTT NINJA CALL PRO MAX SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Fire-Boltt</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">Ninja Call Pro Max</span>

                                <span className="font-medium text-text">Screen Size</span>
                                <span className="text-text-muted">2.01 Inches</span>

                                <span className="font-medium text-text">Connectivity</span>
                                <span className="text-text-muted">Bluetooth</span>

                                <span className="font-medium text-text">Battery Life</span>
                                <span className="text-text-muted">7 Days Normal Use</span>

                                <span className="font-medium text-text">Special Feature</span>
                                <span className="text-text-muted">Bluetooth Calling, IP67 Water Resistant, 120+ Sports Modes</span>
                            </div>
                        ) : product.id === 37 ? (
                            // SAMSUNG GALAXY WATCH 7 SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Samsung</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">Galaxy Watch 7</span>

                                <span className="font-medium text-text">Screen Size</span>
                                <span className="text-text-muted">40mm</span>

                                <span className="font-medium text-text">Connectivity</span>
                                <span className="text-text-muted">Bluetooth, Wi-Fi, NFC</span>

                                <span className="font-medium text-text">Operating System</span>
                                <span className="text-text-muted">Wear OS</span>

                                <span className="font-medium text-text">Special Feature</span>
                                <span className="text-text-muted">Sapphire Crystal, Advanced Fitness Tracking</span>
                            </div>
                        ) : product.id === 35 ? (
                            // NOISE PRO 6 SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Noise</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">ColorFit Pro 6</span>

                                <span className="font-medium text-text">Screen Size</span>
                                <span className="text-text-muted">1.85 Inches (AMOLED)</span>

                                <span className="font-medium text-text">Processor</span>
                                <span className="text-text-muted">EN2</span>

                                <span className="font-medium text-text">Battery Life</span>
                                <span className="text-text-muted">Up to 7 Days</span>

                                <span className="font-medium text-text">Water Resistance</span>
                                <span className="text-text-muted">IP68</span>

                                <span className="font-medium text-text">Special Feature</span>
                                <span className="text-text-muted">Noise AI, AI Watchfaces, 3-axis motion sensors</span>
                            </div>
                        ) : product.id === 36 ? (
                            // APPLE WATCH SE 2 SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Apple</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">Watch SE (2nd Gen)</span>

                                <span className="font-medium text-text">Operating System</span>
                                <span className="text-text-muted">watchOS</span>

                                <span className="font-medium text-text">Connectivity</span>
                                <span className="text-text-muted">GPS + Cellular</span>

                                <span className="font-medium text-text">Water Resistance</span>
                                <span className="text-text-muted">50 meters</span>

                                <span className="font-medium text-text">Special Feature</span>
                                <span className="text-text-muted">Fall Detection, Emergency SOS, Sleep Tracking, Heart Rate Monitor</span>
                            </div>
                        ) : product.id === 38 ? (
                            // BOAT WAVE SIGMA 3 SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Boat</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">Wave Sigma 3</span>

                                <span className="font-medium text-text">Screen Size</span>
                                <span className="text-text-muted">2.01 Inches (HD Display)</span>

                                <span className="font-medium text-text">Water Resistance</span>
                                <span className="text-text-muted">IP67 (Sweat, Dust & Splash Resistance)</span>

                                <span className="font-medium text-text">Special Feature</span>
                                <span className="text-text-muted">Turn-by-turn Navigation, DIY Watch Face Studio, Bluetooth Calling</span>

                                <span className="font-medium text-text">Health Tracking</span>
                                <span className="text-text-muted">SpO2 Monitoring, Heart Rate Monitoring, Daily Activity Tracker</span>
                            </div>
                        ) : product.id === 13 ? (
                            // ONEPLUS 13R SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">OnePlus</span>

                                <span className="font-medium text-text">Operating System</span>
                                <span className="text-text-muted">Android 15, OxygenOS</span>

                                <span className="font-medium text-text">RAM Memory Installed Size</span>
                                <span className="text-text-muted">12 GB</span>

                                <span className="font-medium text-text">CPU Model</span>
                                <span className="text-text-muted">Snapdragon 8 Gen3</span>

                                <span className="font-medium text-text">CPU Speed</span>
                                <span className="text-text-muted">3.3 GHz</span>
                            </div>
                        ) : product.id === 8 ? (
                            // IPHONE 17 SPECS
                            <div className="grid grid-cols-[180px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Apple</span>

                                <span className="font-medium text-text">Operating System</span>
                                <span className="text-text-muted">iOS</span>

                                <span className="font-medium text-text">RAM Memory Installed</span>
                                <span className="text-text-muted">0.1 GB</span>

                                <span className="font-medium text-text">Size</span>
                                <span className="text-text-muted"></span>

                                <span className="font-medium text-text">CPU Speed</span>
                                <span className="text-text-muted">0.1 GHz</span>

                                <span className="font-medium text-text">Memory Storage Capacity</span>
                                <span className="text-text-muted">256 GB</span>
                            </div>
                        ) : product.id === 15 ? (
                            // MACBOOK AIR M4 SPECS
                            <div className="grid grid-cols-[160px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Apple</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">13-inch MacBook Air (M4, 2025)</span>

                                <span className="font-medium text-text">Screen Size</span>
                                <span className="text-text-muted">13.6 Inches</span>

                                <span className="font-medium text-text">Colour</span>
                                <span className="text-text-muted">Sky Blue</span>

                                <span className="font-medium text-text">Hard Disk Size</span>
                                <span className="text-text-muted">256 GB</span>

                                <span className="font-medium text-text">CPU Model</span>
                                <span className="text-text-muted">Apple M4</span>

                                <span className="font-medium text-text">RAM Memory</span>
                                <span className="text-text-muted">16 GB</span>
                            </div>
                        ) : product.id === 7 ? (
                            // LENOVO YOGA SPECS
                            <div className="grid grid-cols-[160px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Lenovo</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">Yoga Slim 7</span>

                                <span className="font-medium text-text">Screen Size</span>
                                <span className="text-text-muted">14 Inches</span>

                                <span className="font-medium text-text">Colour</span>
                                <span className="text-text-muted">Luna Grey</span>

                                <span className="font-medium text-text">Hard Disk Size</span>
                                <span className="text-text-muted">512 GB</span>

                                <span className="font-medium text-text">CPU Model</span>
                                <span className="text-text-muted">Intel Core Ultra 5</span>

                                <span className="font-medium text-text">RAM Memory</span>
                                <span className="text-text-muted">16 GB</span>
                            </div>
                        ) : product.id === 16 ? (
                            // LENOVO LOQ SPECS
                            <div className="grid grid-cols-[160px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">Lenovo</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">LOQ</span>

                                <span className="font-medium text-text">Screen Size</span>
                                <span className="text-text-muted">15.6 Inches</span>

                                <span className="font-medium text-text">Processor</span>
                                <span className="text-text-muted">i5-12th | RTX 3050</span>

                                <span className="font-medium text-text">Hard Disk Size</span>
                                <span className="text-text-muted">512 GB</span>

                                <span className="font-medium text-text">CPU Model</span>
                                <span className="text-text-muted">Core i5-12450HX</span>

                                <span className="font-medium text-text">RAM Memory</span>
                                <span className="text-text-muted">16 GB</span>
                            </div>
                        ) : product.id === 17 ? (
                            // HP OMEN SPECS
                            <div className="grid grid-cols-[160px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">HP</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">Omen Gaming Laptop 16</span>

                                <span className="font-medium text-text">Screen Size</span>
                                <span className="text-text-muted">16.1 Inches</span>

                                <span className="font-medium text-text">Colour</span>
                                <span className="text-text-muted">Black</span>

                                <span className="font-medium text-text">Hard Disk Size</span>
                                <span className="text-text-muted">1 TB</span>

                                <span className="font-medium text-text">CPU Model</span>
                                <span className="text-text-muted">Core i7</span>

                                <span className="font-medium text-text">RAM Memory</span>
                                <span className="text-text-muted">16 GB</span>

                                <span className="font-medium text-text">Operating System</span>
                                <span className="text-text-muted">Windows 11 Home</span>

                                <span className="font-medium text-text">Graphics Card</span>
                                <span className="text-text-muted">Dedicated</span>
                            </div>
                        ) : (
                            // ASUS / OTHER PRODCUTS SPECS
                            <div className="grid grid-cols-[160px_1fr] gap-y-2 text-sm">
                                <span className="font-medium text-text">Brand</span>
                                <span className="text-text-muted">ASUS</span>

                                <span className="font-medium text-text">Model Name</span>
                                <span className="text-text-muted">ASUS Vivobook 16</span>

                                <span className="font-medium text-text">Screen Size</span>
                                <span className="text-text-muted">16 Inches</span>

                                <span className="font-medium text-text">Colour</span>
                                <span className="text-text-muted">Black | Core 7 240H</span>

                                <span className="font-medium text-text">Hard Disk Size</span>
                                <span className="text-text-muted">512 GB</span>

                                <span className="font-medium text-text">CPU Model</span>
                                <span className="text-text-muted">Intel Core 7</span>

                                <span className="font-medium text-text">RAM Memory</span>
                                <span className="text-text-muted">16 GB</span>

                                <span className="font-medium text-text">Operating System</span>
                                <span className="text-text-muted">Windows 11 Home</span>

                                <span className="font-medium text-text">Special Feature</span>
                                <span className="text-text-muted">Anti-glare display, Backlit Keyboard, Precision touchpad</span>

                                <span className="font-medium text-text">Graphics Card</span>
                                <span className="text-text-muted">Integrated</span>
                            </div>
                        )}
                    </div>

                    {/* About this item */}
                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="font-bold text-lg mb-4">About this item</h3>
                        {product.id === 9 ? (
                            // SAMSUNG SPECIFIC DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">Galaxy AI and Now Brief:</span> Enter the new era of mobile AI with a companion that stays one-step ahead of your needs. Let natural conversation guide you through everyday tasks without switching between multiple apps, while Now Brief keeps you updated with your schedule, reminders, battery status, and Energy Score, all within One UI.</li>
                                <li><span className="font-medium text-text">Gemini Live:</span> Get real-time answers and ideas with Gemini Live. Chat freely, attach images, and prepare for presentations with responses that adapt to your style.</li>
                                <li><span className="font-medium text-text">Ultra Wide Camera:</span> Capture razor-sharp details from Wide to Telephoto and even Ultra Wide. Whether shooting landscapes or zoomed-in portraits, the AI-enhanced ProVisual Engine and 200 MP camera deliver vivid colors with exceptional clarity. Showcased beautifully on immersive display.</li>
                                <li><span className="font-medium text-text">Snapdragon 8 Elite:</span> Experience unmatched power with the Snapdragon 8 Elite processor, custom-tuned for Galaxy. Enjoy smoother gaming, real-time ray tracing, and advanced Vulkan optimization for immersive gameplay.</li>
                                <li><span className="font-medium text-text">Knox Security and Samsung Wallet:</span> Safeguard your data with defense-grade Knox security and enjoy fast, reliable, and secure payments anywhere with Samsung Wallet.</li>
                            </ul>
                        ) : product.id === 21 ? (
                            // XIAOMI PAD 7 DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">Nano Texture Display</span> - A fusion of nano-precision and matte brilliance that reduces glare, enhances clarity, and delivers a paper-like smoothness for an immersive viewing experience. With dual-layer AG and AR etching, it minimizes reflections and distractions. Enjoy enhanced privacy, crisp details, and seamless navigation for a truly exceptional screen experience, whether indoors or outdoors</li>
                                <li><span className="font-medium text-text">3.2K CrystalRes Display</span> - Immerse yourself in unmatched visuals with a 3.2K QHD+ display that brings every detail to life. Experience fluid motion with a 144Hz Adaptive Sync refresh rate, vibrant precision with over 68.7 billion colors, and cinematic beauty with a 3:2 balanced aspect ratio. At 800 nits of peak brightness, it outshines the sun to keep your view crystal clear outdoors.</li>
                                <li><span className="font-medium text-text">Most Advanved Snapdragon 7 Series Processor</span> - Power through tasks with the Snapdragon 7+ Gen 3, offering upto 2x better performance for smoother multitasking and gaming. As the most advanced processor in the Snapdragon 7 series, it supports LPDDR5X memory and UFS 4.0 storage for lightning-fast data access. *as compared to previous gen xiaomi tablets</li>
                                <li><span className="font-medium text-text">Immersive Surround Sound</span> - Whether gaming or streaming, enjoy sound that puts you in the center of the action. Feel every note with the flagship quad speakers and Panoramic Surround Sound, bringing your content to life enhanced with Dolby Atmos. Experience the ultimate audio upgrade with Volume Booster Mode, achieving 200% volume without compromising sound quality.</li>
                                <li><span className="font-medium text-text">Stay productive for up to 16 hours</span> - Stay maximised all day with the robust 8850 mAh battery, giving you the power to work and create without letting you down. Get back to business faster with 45W Turbo Charging, ensuring you're always ready to perform</li>
                            </ul>
                        ) : product.id === 23 ? (
                            // IPAD AIR M3 DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">WHY IPAD AIR</span> — iPad Air is powerful, versatile and comes in a choice of two sizes. Featuring the incredible performance of the M3 chip built for Apple Intelligence and a stunning Liquid Retina display along with Touch ID, advanced cameras, blazing-fast Wi-Fi 6E and a USB-C connector.* Plus powerful productivity features in iPadOS and support for both next-generation Apple Pencil Pro and an advanced typing experience with Magic Keyboard.*</li>
                                <li><span className="font-medium text-text">APPLE INTELLIGENCE</span> — Apple Intelligence is the personal intelligence system that helps you write, express yourself and get things done effortlessly.* With groundbreaking privacy protections integrated into the core of iPad, it gives you peace of mind that no one else can access your data — not even Apple.</li>
                                <li><span className="font-medium text-text">PERFORMANCE AND STORAGE</span> — M3 is a powerful chip built for Apple Intelligence that brings amazing performance for advanced creative and product tasks, graphic-intensive games and smooth multitasking. And with all-day battery life, you can keep working and playing wherever you go.* Choose up to 1TB of storage depending on the room you need for apps, music, movies and more.*</li>
                                <li><span className="font-medium text-text">13” LIQUID RETINA DISPLAY</span> — The gorgeous Liquid Retina display features advanced technologies like P3 wide colour, True Tone and ultra-low reflectivity, which make everything look stunning.*</li>
                                <li><span className="font-medium text-text">IPADOS + APPS</span> — iPadOS makes iPad more productive, intuitive and versatile. With iPadOS, run multiple apps at once, use Apple Pencil to write in any text field with Scribble, and edit and share photos.* Stage Manager makes multitasking easy with resizable, overlapping apps and external display support. iPad Air comes with essential apps like Safari, Messages and Keynote, with over a million more apps designed specifically for iPad available on the App Store.</li>
                                <li><span className="font-medium text-text">APPLE PENCIL AND MAGIC KEYBOARD</span> — Apple Pencil Pro transforms iPad Air into an immersive drawing canvas and the world’s best note-taking device. Apple Pencil (USB-C) is also compatible with iPad Air. Magic Keyboard for iPad Air delivers an amazing typing experience with a built-in trackpad and 14-key function row, and it doubles as a protective cover on the go.</li>
                                <li><span className="font-medium text-text">ADVANCED CAMERAS</span> — iPad Air features a 12MP Center Stage front camera that’s perfect for video calls and selfies. The 12MP Wide back camera with True Tone flash is perfect for document scanning and capturing photos and 4K videos.</li>
                            </ul>
                        ) : product.id === 24 ? (
                            // REDMI PAD 2 PRO DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li>Upgrade your entertainment and productivity with the Redmi Pad 2 Pro, designed for power and performance on the go. Enjoy a stunning 30.73 cm(12.1) 2.5K display with a super-smooth 120Hz AdaptiveSync refresh rate and Dolby Vision for lifelike colours and clarity.</li>
                                <li>Stay connected everywhere with Wi-Fi 6, and experience seamless multi-device workflow through HyperOS 2, which lets you access phone apps, sync calls, share clipboard content, and switch networks effortlessly.</li>
                                <li>Powered by the Snapdragon 7s Gen 4, this tablet handles multitasking, gaming, classes and office work with ease. Store more with expandable storage up to 2TB. The massive 12000mAh battery delivers all-day endurance for streaming, studying, creating and more.</li>
                                <li>Immersive quad speakers with Dolby Atmos make movies, music and games sound bigger and richer. Pair it with the Redmi Smart Pen (sold separately) for natural writing and sketching, or the Redmi Pad 2 Pro Keyboard (sold separately) to turn your tablet into a productivity powerhouse.</li>
                            </ul>
                        ) : product.id === 5 ? (
                            // JBL WAVE BUDS 2 DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li>✅ <span className="font-medium text-text">Best-in-class Sound Quality</span>:JBL Wave Buds 2 earbuds feature 8mm dynamic driver which is engineered to produce rich and deep bass tones without overpowering mids and highs creating a well-rounded sound profile.</li>
                                <li>✅ <span className="font-medium text-text">ANC with Smart Ambient</span> :JBL Wave Buds 2 earbuds come with Active Noise Cancelling to listen to your surroundings and filter out distracting noise. Smart Ambient lets you control how much of the outside world you want to hear, so you can talk with others or stay aware of your surroundings—all without taking your earbuds out.</li>
                                <li>✅ <span className="font-medium text-text">Seamless Bluetooth Pairing</span> :JBL Wave Buds 2 uses BT5.3 technology and comes enabled with both Fast Pair by Google and Swift Pair by Microsoft, so they immediately pair with both your Android devices and Microsoft computer with a single tap.</li>
                                <li>✅ <span className="font-medium text-text">Multi-point connection</span>:Pair your JBL Wave Buds 2 earbuds with two Bluetooth devices at the same time and then switch effortlessly from one to the other. So if you’re watching a video on your tablet, you won’t miss a call on your mobile phone.</li>
                                <li>✅ <span className="font-medium text-text">4 mics for Crystal, clear calls</span>:Two mics on each earbud pick up and clearly transmit your voice while cancelling out ambient noise. So you can make clear, crisp calls even when you’re walking through a busy park on a breezy day.</li>
                            </ul>
                        ) : product.id === 6 ? (
                            // FASTRACK ASTOR FR2 PRO DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><strong>Stylish Design Meets Smart Tech</strong>: A sleek smartwatch for man or woman with a 1.43” AMOLED display, premium metal build, and adaptive always-on screen. Designed for those who want their smart watch to double as a fashion statement.</li>
                                <li><strong>Smart Calling, Smarter Living</strong>: Take calls from your wrist with SingleSync Bluetooth Calling. A must-have feature for professionals looking for a digital watch for man or women that keeps them effortlessly connected.</li>
                                <li><strong>Smooth Navigation, Maximum Control</strong>: Functional crown and dual menu styles ensure seamless interaction. Whether you're wearing a watch for man smartwatch or wrist watch for woman, control is always at your fingertips.</li>
                                <li><strong>All-Day Wellness Tracking</strong>: Monitor heart rate, SpO2, sleep, and stress with this all-round health smart watch. Perfect for ladies watch lovers or fitness-first men who want form and function in one wearable.</li>
                                <li><strong>Made to Match Every Mood</strong>: With 100+ watchfaces, this smart watch for women latest or smartwatch for man adapts to your look. A go-to for women watches branded fans and those seeking watches for women latest in style and tech.</li>
                            </ul>
                        ) : product.id === 34 ? (
                            // FIRE-BOLTT NINJA CALL PRO MAX DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><strong>51mm Large Display</strong>: Experience clarity with the 2.01-inch large display and 240*296 px resolution.</li>
                                <li><strong>Bluetooth Calling</strong>: Make and receive calls directly from your wrist. Includes Quick Access Dial Pad, Call History, and Sync Contacts.</li>
                                <li><strong>120+ Sports Modes</strong>: Track your fitness journey with over 120 sports modes to suit every activity.</li>
                                <li><strong>Health Suite</strong>: Comprehensive health monitoring including SpO2, Heart Rate Tracking, Sleep Monitoring, and Breath Training.</li>
                                <li><strong>Strong Battery Life</strong>: Enjoy up to 7 days of normal use and 15 days of standby time.</li>
                                <li><strong>Voice Assistant</strong>: Built-in AI Voice Assistant (Siri/Google) to get things done with just your voice.</li>
                                <li><strong>Smart Notifications</strong>: Stay updated with notifications from your favorite apps right on your wrist.</li>
                                <li><strong>IP67 Water Resistant</strong>: Designed to withstand dust and water splashes.</li>
                            </ul>
                        ) : product.id === 37 ? (
                            // SAMSUNG GALAXY WATCH FE DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><strong>Sapphire Crystal Glass</strong>: Durable and scratch-resistant, ready for any adventure.</li>
                                <li><strong>Advanced Fitness Tracking</strong>: Automatically detects and tracks workouts, helping you stay on top of your fitness goals.</li>
                                <li><strong>Samsung Health</strong>: Comprehensive health monitoring including heart rate and body composition analysis.</li>
                                <li><strong>Stylish Design</strong>: Available in new colors with distinctive stitching on the band, perfect for daily wear.</li>
                                <li><strong>Galaxy Ecosystem</strong>: Seamlessly connects with your Samsung Galaxy devices for a unified experience.</li>
                            </ul>
                        ) : product.id === 35 ? (
                            // NOISE PRO 6 DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><strong>Powered by Noise AI</strong>: Experience intelligent, interactive, and innovative features like AI Watchfaces that let you imagine, describe, and wear unique faces, and an AI Companion for smart, personal insights.</li>
                                <li><strong>Smart. Personal. Insightful</strong>: Your AI Companion is ready to help. Ask it anything, analyze your sleep patterns for the last night, summarize your activity, or even build a workout plan to gain muscle.</li>
                                <li><strong>Most Powerful EN2 Processor</strong>: Equipped with the EN2 Processor for enhanced performance, ensuring smooth navigation and efficient operation.</li>
                                <li><strong>Stunning Display</strong>: Features a 1.85" AMOLED display for sharp, vibrant visuals.</li>
                                <li><strong>Premium Build</strong>: Built with a Zinc Alloy body and comes with IP68 water resistance, making it durable for various conditions. Powered by Nebula UI 2.0.</li>
                            </ul>
                        ) : product.id === 36 ? (
                            // APPLE WATCH SE 2 DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><strong>Cellular Connectivity</strong>: Send a text, make a call, and stream music and podcasts without your iPhone, even while traveling internationally.</li>
                                <li><strong>Health Insights</strong>: Get deep insights into your health, including high and low heart rate notifications, irregular rhythm notifications, and sleep stages tracking.</li>
                                <li><strong>Safety Features</strong>: Get help when you need it with Fall Detection, Crash Detection, and Emergency SOS.</li>
                                <li><strong>Fitness Tracking</strong>: Measure your daily activity and track all the ways you move with the Activity app using advanced sensors.</li>
                                <li><strong>Water Resistant</strong>: Swimproof design with water resistance up to 50 meters, perfect for tracking swims and surfing.</li>
                            </ul>
                        ) : product.id === 38 ? (
                            // BOAT WAVE SIGMA 3 DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><strong>Turn-by-turn Navigation</strong>: Stay on the right path with on-watch navigation guidance. Simply search your destination on the boAt Crest App and sync it to your watch.</li>
                                <li><strong>DIY Watch Face Studio</strong>: Personalize your watch face with your favorite designs, photos, or themes to reflect your unique style and personality.</li>
                                <li><strong>2.01" HD Display</strong>: Enjoy a large, vibrant, and clear viewing experience with the massive high-definition display.</li>
                                <li><strong>Bluetooth Calling</strong>: Stay connected on the go with seamless Bluetooth calling directly from your wrist.</li>
                                <li><strong>Comprehensive Health Suite</strong>: Monitor your health with SpO2 tracking, heart rate monitoring, and daily activity tracking to stay on top of your wellness goals.</li>
                                <li><strong>IP67 Resistance</strong>: Built to withstand your active lifestyle with IP67 sweat, dust, and splash resistance.</li>
                            </ul>
                        ) : product.id === 28 ? (
                            // SONY WH-1000XM5 DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">The Best Noise Cancellation</span>: Two processors control 8 microphones—our biggest step forward in noise canceling technology.</li>
                                <li><span className="font-medium text-text">Magnificent Sound</span>: Enjoy high quality audio with customization via the Sony Sound Connect app.</li>
                                <li><span className="font-medium text-text">Long Battery Life</span>: Up to 30 hours of battery life.</li>
                                <li><span className="font-medium text-text">Quick Charging</span>: 3 min charge for 3 hours of playback.</li>
                                <li><span className="font-medium text-text">All-day Comfort</span>: Lightweight and comfortable design.</li>
                            </ul>
                        ) : product.id === 29 ? (
                            // GALAXY BUDS3 PRO DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><strong>[DESIGN]</strong> Galaxy Buds3 Pro's iconic new in-ear blade design with LED lighting features to express yourself & impress those around you. The sleek design is also functional - simply swipe up/down on the blade to adjust volume, and pinch to play/pause/skip. We make it easy.</li>
                                <li><strong>[COMFORT]</strong> Galaxy Buds 3 Pro is designed through 3D ear data analyses & simulations to deliver optimal comfort & fit. The soft rubber tips ensure that earbuds stay secured in your ear giving you ultimate comfort & listening experience</li>
                                <li><strong>[Hi-Fi AUDIO]</strong> The sound on our Galaxy Buds3 Pro is crystal clear & easily matches studio quality. The 24bit/96kHz support & enhanced two-way speaker with dual amp work in harmony to delivery truly pristine & immersive audio experience tailored to your preferences</li>
                                <li><strong>[PERFECT FIT]</strong> With Galaxy Buds3 Pro, say goodbye to constantly adjusting your earbuds to find that pitch-perfect sound experience. It intelligently tracks & analyses the sound inside & outside your ears to help apply the most suitable EQ & ANC algorithms real-time, allowing for an optimized ANC experience</li>
                                <li><strong>[INTELLIGENT SOUND]</strong> Listen to high quality optimized sound in real-time with sounds tailored to your surroundings. Galaxy Buds3 Pro powered by Galaxy AI listens & responds to your environment by eliminating unwanted noises. And what's more, our Galaxy Buds3 Pro can intelligently help allow speech or even safety sirens go through to your ears selectively so you can stay immersed both inside & out</li>
                            </ul>
                        ) : product.id === 30 ? (
                            // CMF BY NOTHING BUDS PRO DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">Unmatched Sound Effects</span>: With Hybrid ANC technology, the CMF Buds Pro use microphones both inside and outside the headset to cancel noise with a depth of up to 45dB. With ultra bass technology it enhances your bass experience.Whether you're on a busy commute to work or in a noisy office, you can fully immerse yourself in your favorite music.</li>
                                <li><span className="font-medium text-text">Seamless Dual Connection</span>: CMF headphones are equipped with Bluetooth 5.3 chips. Experience faster connection speed and smoother calls. Supports Google fast pairing and Microsoft Swift fast pairing. This Bluetooth headset can connect to various Bluetooth devices, including IOS, Android, tablets and laptops. In-ear detection function allows you to quickly enter the music world.</li>
                                <li><span className="font-medium text-text">Where aesthetics meets quality</span>: A monotonous life requires some vitality and bold expression. Express your creativity through CMF Buds Pro. Feather-light comfort delivered in a bold, timeless design. The IP54 level of dust and water resistance allows you to use them with peace of mind even during intense exercise.</li>
                                <li><span className="font-medium text-text">Effortless touch control</span>: Double tap to forward, answer or hang up calls. Tap three times to back or reject a call. Tap and hold to switch between Active Noise Cancellation and Transparency Mode. You can customize it in the Nothing X app. And all the features available in Nothing OS and Nothing X app for iOS and other Android devices.</li>
                                <li><span className="font-medium text-text">Listening never stops</span>: The unique battery life of the headphones is up to 11 hours, and the playtime with a charging box is up to 39 hours, allowing you to continuously listen to your favorite music. And it also has a fast charging function, which can be used up to 5 hours after 10 minutes of wired charging.</li>
                            </ul>
                        ) : product.id === 31 ? (
                            // REALME BUDS T310 DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><strong>46dB Hybrid Noise Cancellation</strong>: Adjustable three-level noise reduction to block out distraction.</li>
                                <li><strong>40 Hours Total Playback</strong>: Up to 40 hours with ANC OFF, and 26 hours with ANC ON. Fast charge support.</li>
                                <li><strong>12.4mm Dynamic Bass Driver</strong>: Larger driver for powerful and deep bass.</li>
                                <li><strong>360° Spatial Audio Effect</strong>: Immersive surround sound experience.</li>
                                <li><strong>Dual Device Connection</strong>: Seamlessly switch between two devices.</li>
                                <li><strong>Ultra-low Latency</strong>: 45ms ultra-low latency for gaming.</li>
                                <li><strong>IP55 Water & Dust Resistance</strong>: Durable design for workouts and outdoor use.</li>
                            </ul>
                        ) : product.id === 32 ? (
                            // BOAT ROCKERZ 650 PRO DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">Seamless Touch & Swipe Controls</span>: Delve into heightened listening comfort with the smooth touch and swipe controls of the boAt Rockerz 650 Pro Bluetooth Headphones. Toggle between tracks, manage calls, change the volume, and do more effortlessly.</li>
                                <li><span className="font-medium text-text">Captivating Dolby Audio</span>: Unlock audio that moves you with engrossing Dolby Audio in these headphones. Be it your playlist or watchlist, these headphones are an audiophile’s unwavering companion!</li>
                                <li><span className="font-medium text-text">80 hours of Playback</span>: Enjoy a whopping 80 hours of listening with your headphones. Groove to the latest tracks or call up your squad and enjoy uninterrupted performance.</li>
                                <li><span className="font-medium text-text">40mm Drivers</span>: Listen to thumping audio with the 40mm drivers in these headphones. Bass-rich boAt Signature Sound from the dual drivers is bound to amplify your listening experience to the next level.</li>
                                <li><span className="font-medium text-text">Bluetooth v5.3 & AUX Compatibility</span>: Choose between wireless comfort with Bluetooth v5.3 or opt for AUX connectivity with your Rockerz.</li>
                            </ul>
                        ) : product.id === 33 ? (
                            // BOAT AIRDOPES 141 ELITE ANC DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">Active Noise Cancellation</span>: Enjoy audio the way it was intended with Airdopes 141 Elite ANC TWS Earbuds. By canceling 35dB of background noise, these earbuds create an audio zone just for you sans clutter.</li>
                                <li><span className="font-medium text-text">Quad Mics with ENx Tech</span>: Not just ANC, these earbuds also boast four mics with ENx technology. Breeze through calls with high clarity regardless of your location.</li>
                                <li><span className="font-medium text-text">Playback & ASAP Charge</span>: These earbuds provide a playback time of upto 42 Hours and ASAP Charge of 150 Mins after charging for 10 Mins only.</li>
                                <li><span className="font-medium text-text">Beast Mode</span>: Make your mark in the virtual battleground, with the 65 ms low latency of BEAST mode. Race seamlessly towards the finish line leaving lag behind.</li>
                                <li><span className="font-medium text-text">IPX5 Splash Resistance</span>: Head out to the gym and exercise with your earbuds in tow. Designed with IPX5 sweat and splash resistance, these earbuds are perfect for carrying on the go.</li>
                            </ul>
                        ) : product.id === 41 ? (
                            // NOISE BUDS N1 TWS DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><strong>Up to 40-hour playtime</strong>: Dive into a marathon of music with an incredible 40-hour playtime.</li>
                                <li><strong>Quad Mic with ENC</strong>: Experience crystal-clear calls with Quad Mic and ENC in action.</li>
                                <li><strong>11mm Driver</strong>: Enjoy a powerful sound experience elevated with the precision of an 11mm driver.</li>
                                <li><strong>Ultra-low latency</strong>: Enjoy lag-free communication thanks to the ultra-low latency of up to 40ms.</li>
                                <li><strong>Instacharge</strong>: Top up your beats in just 10 minutes for a playtime of 120 minutes.</li>
                            </ul>
                        ) : product.id === 22 ? (
                            // GALAXY TAB S11 DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">Galaxy AI</span>: Galaxy AI Key to unleash Galaxy AI to search</li>
                                <li><span className="font-medium text-text">Display</span>: 11” Large Screen Display | Dynamic AMOLED 2X display | 120 Hz Refresh rate</li>
                                <li><span className="font-medium text-text">Hexagonal S Pen for smooth and precise stroke</span></li>
                                <li><span className="font-medium text-text">Long Lasting Battery up to 18hrs</span></li>
                                <li><span className="font-medium text-text">Multi-Modal AI</span>: Gemini| Galaxy AI (Drawing and Writing Assist) | PC like experience with DeX Mode</li>
                            </ul>
                        ) : product.id === 25 ? (
                            // LENOVO IDEA TAB PRO DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">Display</span>:- 12.7 Inch LCD Screen | Resolution: 2944 x 1840 | Refresh Rate: 144Hz | Brightness: 400nits</li>
                                <li><span className="font-medium text-text">Processor</span>:- MediaTek Dimensity 8300. Octa-core, leading 4nm chip design. With 256GB storage, and Wi-Fi 6, 802.11ax 2x2, you're set for smooth multitasking and super-fast downloads.</li>
                                <li><span className="font-medium text-text">Memory & Storage</span> : 12GB Soldered LPDDR5x | 256GB UFS 4.0, microSD card, supports up to 1TB (exFAT)</li>
                                <li><span className="font-medium text-text">Speakers & Camera</span>: 4 JBL speakers, 1W x4, optimized with Dolby Atmos | Front 8.0MP / Rear 13.0MP with Flashlight</li>
                                <li><span className="font-medium text-text">Battery</span>: Integrated 10200mAh (Typ.) | Upto 11 hours of YouTube streaming</li>
                            </ul>
                        ) : product.id === 4 ? (
                            // ONEPLUS PAD 3 DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">[World's fastest mobile CPU] :</span> Ultimate android tablet powered by Snapdragon 8 Elite Mobile Platform chipset, 40% faster GPU , 45% faster CPU, 300% faster NPU, 2947633 AnTuTu Score | Qualcomm's cutting-edge flagship.</li>
                                <li><span className="font-medium text-text">[Elite viewing experience with 13.2" 3.4k Display] :</span> 3392*2499 display resolution with Dolby vision, 7:5 Aspect ratio LCD display, 315 PPI, 144Hz adaptive refresh rate, 600 nits brightness and 900 nits HBM (high brightness mode), Rhine intelligent eye protection 4.0 certification.</li>
                                <li><span className="font-medium text-text">[8-speaker setup - Cinematic immersive audio experience]:</span> .Distributed 8-speaker Setup, it delivers a more impactful bass effect & clearer high-frequency performance, advanced spatial audio with Holographic Audio processing to deliver cinema-level immersive audio experiences.</li>
                                <li><span className="font-medium text-text">[Our biggest battery ever] :</span> Tablet with the largest battery capacity of 12,140 mAh, with 80W lightning fast charging, Up to 18 hours of video playback.</li>
                                <li><span className="font-medium text-text">[Creator's go-to studio]:</span> Swipe into the perfect canvas to design, illustrate, film, and score a masterpiece. Ignite every spark of your imagination into blazing life, effortlessly switching between your creations.</li>
                                <li><span className="font-medium text-text">[Ultra thin] :</span> An impossibly ultra-thin profile meets a full metal unibody design for portable power perfected.</li>
                                <li><span className="font-medium text-text">[OnePlus AI] :</span> Smoother workflows for maximum productivity AI Summary, AI Translation, AI Speak & AI Writer, Dedicated AI button on keyboard for easy Google Gemini activation.</li>
                                <li><span className="font-medium text-text">[Seamless connected ecosystem] :</span> Elite experience with OnePlus smartphone , Work flows and memories grow with quick sharing via File Dock and Screen Share. Or transfer large files effortlessly via NFC on the Smart Keyboard using One-touch Transmission.</li>
                            </ul>
                        ) : product.id === 3 ? (
                            // ONEPLUS BUDS DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">Industry leading ANC up to 55 dB & 5500Hz range:</span> Powered by the latest OnePlus algorithms, Buds 4 can dynamically adjust ANC in real time—up to 800 times per second—based on ambient noise to ensure optimal noise cancellation. [All-New Adaptive Mode] Dynamically switches between ANC and Transparency Modes for safer and smoother listening.</li>
                                <li><span className="font-medium text-text">Flagship level near-lossless sound:</span> Featuring twin tailored DACs (Digital-to-Analog Converter), an 11mm woofer and a 6mm tweeter, precisely engineered to deliver powerful bass and clear treble, creating rich lows and pristine highs across a wide soundstage. Industry leading Hi-res Codec of LHDC 5.0 and upto 1 Mbps 24-bit 192kHz LHDC 5.0 meets studio-grade Hi-Res for silky-smooth sound with reduced latency.</li>
                                <li><span className="font-medium text-text">Steady Connect | AI translation:</span> Steady connect ensures reliable connectivity both indoors & outdoors. It ensures ultra strong bluetooth with massively extended range up to 250 meters(For select OnePlus phones with Oxygen OS15.0.0 & above). With AI translation, break the language barrier. Experience seamless real-time conversation in many languages. [IP55 Rating]: With IP55 dust and water resistance, you're protected against sweat and rain—no worries, just music.</li>
                                <li><span className="font-medium text-text">Customizable settings for hassle free control:</span> Slide up/down for volume control, Long touch/hold to switch among ANC, adaptive & transparency mode, single tap for play/pause,double or triple taps for switching songs. [47ms low latency in game mode]: Low latency ensures every gunshot, footstep, and game alert syncs perfectly with your actions, providing users with a smoother and more enjoyable gaming experience.</li>
                                <li><span className="font-medium text-text">Fast charing & longer battery life:</span> Large battery delivers up to 45 hours of non-stop music with ANC Off; A quick 10-minute charge delivers up to 11 hours of music playback. [Dual-Device Connection | BT5.4 | Google Fast Pair ]: Simultaneously connect to two devices (Android/iOS/Windows smartphones, tablets or computers) for quick and seamless device switching, Google fast pair simplifies the pairing process, Voice assistant shortcut (Google Gemini, Google Assistant or Apple Siri) to help you with various tasks.</li>
                            </ul>
                        ) : product.id === 14 ? (
                            // SAMSUNG FOLD 7 DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">Ultra Unfolds</span> - Our most innovating design, re-engineered to be our slimmest, lightest Galaxy Fold ever. With expansive screens inside and out to show you a new, undisrupted world of craftsmanship, you get the ultra experience, unfolded.</li>
                                <li><span className="font-medium text-text">Ultra Sleek</span> - Folded or Unfolded, the ultra light Galaxy Z Fold7 with next-gen Galaxy AI exceeds your expectations of a 5G smartphone. With a wider 21:9 cover screen & sleeker form, it is easier to hold and get things done comfortably including hassle free payments on Samsung Wallet.</li>
                                <li><span className="font-medium text-text">Ultra 200MP Camera</span> - Capture super stunning, high-resolution shots with the powerful 200MP Ultra camera that is perfectly paired with AI powered next-gen ProVisual Engine.</li>
                                <li><span className="font-medium text-text">Built Tough</span> - The advanced Armor Aluminium frame is thinner in form, stronger and more durable. Corning Gorilla Glass Ceramic 2 glass has also been applied for resilience. And, with Knox vault, your privacy is completely secured with on-device protection.</li>
                                <li><span className="font-medium text-text">Ultra Powerful</span> - Expand your gaming on the biggest display screen of Z Fold ever with the most advanced Snapdragon mobile processor which ensures smoother graphics, faster gameplay and an efficient battery that powers all-day use. Moreover, with the all-new One UI 8, get the most personalised UI for the cover screen and massive main screen.</li>
                            </ul>
                        ) : product.id === 11 ? (
                            // SAMSUNG S24 DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li>Easy to grip. Satisfying to hold. With their unified design and satin finish, Galaxy S24 feels as smooth as it looks.</li>
                                <li>They're the upgrades you've waited for. More screen. More battery. More processing power. There's so much more to love about Galaxy S24.</li>
                                <li>A true pixel powerhouse that will not disappoint. Ever. Snap high-res pics for that will no doubt withstand the test of time for years to come.</li>
                                <li>Search like never before with Circle to Search. Simply trace an object to get Google Search results. It's a new visual way to find what you're looking for.</li>
                                <li>Get quick language translation on your next phone call. That's right, AI helps you communicate outside your own language while you talk on the phone. And get this, it even works on messaging.</li>
                            </ul>
                        ) : product.id === 10 ? (
                            // PIXEL 10 PRO XL DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li>The 48 MP telephoto camera features an upgraded 5x telephoto lens and has the longest and best zoom quality ever in a Pixel. Now get even more unbelievable close-ups with 100x Pro Res Zoom and 10x optical image quality.</li>
                                <li>Pixel’s pro camera system makes everything look amazing by default, even in low light. Capture more of the scene with advanced AI models, and bring out incredible details with up to 100x zoom, stunning 50 MP images, and super steady videos in 8K with Video Boost.</li>
                                <li>Pixel 10 Pro XL lasts over 24 hours, and up to 100 hours with Extreme Battery Saver. It charges to 70% in about 30 minutes, and has Pixelsnap magnetic technology for effortless wireless charging that snaps into place.</li>
                                <li>Instead of typing, use Gemini Live to have a natural, free-flowing conversation. Share your screen, or even add an image, file, or YouTube video for a more in-depth conversation.</li>
                            </ul>
                        ) : product.id === 12 ? (
                            // IQOO 15 DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">PERFORMANCE:</span> Fastest Snapdragon 8 Elite Gen 5 Processor with TSMC's 3 nm process technology, 4 Mn+ Antutu Score and a non-Arm public architecture CPU for the first time with 20% single core improvement and 23% GPU improvement from previous generation. In addition to that, it has LPDDR5X Ultra with UFS 4.1 technology, 7000 mAh 4th Gen Silicon Anode Battery with 100W FlashCharge and 40W wireless charging. Also, iQOO 15 is IP68+IP69 rated for dust and water resistance.</li>
                                <li><span className="font-medium text-text">DISPLAY:</span> Samsung 2K M14 LEAD OLED Display for the first time ever in android. India's brightest display with 2600nits HBM and 6000nits Local Peak Brightness. It also comes with an anti-reflective film.</li>
                                <li><span className="font-medium text-text">GAMING:</span> Supercomputing chip Q3, 2K + 144 FPS for lower power consumption and higher energy efficiency. iQOO's 1st internally developed Game Livestreaming Assistant, PC-Grade Ray tracing technology and India's Largest Single Layer VC cooling system with 8000 mm².</li>
                                <li><span className="font-medium text-text">CAMERA:</span> Triple camera setup – 50MP Sony 3X Periscope Camera, 50MP Sony VCS True Color Camera, 50MP Ultra Wide-Angle Camera with an Upgraded 32MP Selfie Camera and 4k Video Recording. Humanistic Street Photography Camera along with AI visual effects and AI reflection erase.</li>
                                <li><span className="font-medium text-text">OPERATING SYSTEM:</span> Origin OS 6 first time ever in iQOO out of the box with 5 years of OS updates and 7 years of security patches. It comes with Origin Island, Office Kit, Lock Screen Customization.</li>
                            </ul>
                        ) : product.id === 13 ? (
                            // ONEPLUS 13R DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">Flagship power made smarter with the Snapdragon 8 Gen 3 flagship</span> – Up to 98% faster AI, 30% faster CPU compared to the OnePlus 12R. The OnePlus 13R maximizes the CPU efficiency of the Snapdragon 8 Gen 3 when gaming, while lowering heat and power consumption.</li>
                                <li><span className="font-medium text-text">Winning made smooth with maximum 120fps gaming experience</span>, no input delay and zero-touch latency gameplay. We've tuned the GPU pipeline to unlock near-instant 120fps HDR gaming that hits harder than any highlight.</li>
                                <li><span className="font-medium text-text">Our biggest battery ever</span> – Press play all day, every day, with the cutting-edge 6000mAh battery. Driven by our next-gen battery management system, your multimedia becomes an all-you-can-consume buffet.</li>
                                <li><span className="font-medium text-text">Pro-grade triple camera with the latest SONY LYT-700 50MP main camera with OIS</span>, a new 50MP telephoto camera with 2x optical zoom and 4x lossless zoom, and an 8MP ultra-wide camera at 112°. Unlock DSLR-like portraits with flagship algorithm.</li>
                                <li><span className="font-medium text-text">OxygenOS 15</span> - Experience the power of all-new OnePlus AI. Search smarter, crank up your creativity, and power your productivity for a smoother digital life.</li>
                                <li><span className="font-medium text-text">1.5K ProXDR Display with all-new RadiantView</span>, for a bright display even under blazing sun – certified by TUV Rheinland Intelligent Eye Care with High Visibility.</li>
                            </ul>
                        ) : product.id === 8 ? (
                            // IPHONE 17 DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">DESIGNED TO DELIGHT. BUILT TO LAST</span> — iPhone 17 comes in five gorgeous colours, with a brighter 15.93 cm (6.3”) display and a Ceramic Shield 2 front that’s 3x more scratch resistant.</li>
                                <li><span className="font-medium text-text">SMOOTHER. BRIGHTER. BRILLIANT</span> — Smooth scrolling with ProMotion up to 120Hz, better outdoor contrast with 3,000 nits peak brightness and 33% fewer reflections compared with previous generation.</li>
                                <li><span className="font-medium text-text">18MP CENTER STAGE FRONT CAMERA</span> — Flexible ways to frame your shot. Smarter group selfies, Dual Capture video for simultaneous front and rear recording, and more.</li>
                                <li><span className="font-medium text-text">STUNNING SHOTS</span> — Capture super-high-resolution shots by default with the 48MP Dual Fusion camera system, 4x optical zoom range and 48MP Fusion Ultra Wide camera.</li>
                                <li><span className="font-medium text-text">A19 CHIP. POWER PLAYER. ENERGY EXPERT</span> — With a 5-core GPU, the enhanced neural engine helps power everything you do on iPhone — from Apple Intelligence to AAA games.</li>
                                <li><span className="font-medium text-text">CHARGES FAST. MAKES IT LAST</span> — All-day battery life with up to 30 hours of video playback. Charge up to 50% in 20 minutes.</li>
                                <li><span className="font-medium text-text">iOS</span> — A fresh design with Liquid Glass. Beautiful, delightful and instantly familiar. With a more vibrant Lock Screen, customizable backgrounds and polls in Messages, Call Screening and more.</li>
                            </ul>
                        ) : product.id === 42 ? (
                            // SAMSUNG A55 DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">Design</span> - Experience cinematic scenes with stunning 6.6” FHD+ Super AMOLED display with Vision Booster, 16M Colors and 120Hz Refresh Rate. Premium metal frame. Key-island design for intuitive grip.</li>
                                <li><span className="font-medium text-text">AI Enhancements</span> - Circle to search - Music, Image or text. Enhance your photos with Camera enhanced by AI and Intelligent visual editing - Object eraser. Image remaster. AI edit suggestions.</li>
                                <li><span className="font-medium text-text">Battery</span> - Do more with long-lasting and massive 5000 mAh battery with 25W fast charging support. Last up to 2 days on a single charge with 28 hours Video playback time.</li>
                                <li><span className="font-medium text-text">Built to last</span> - Corning Gorilla Glass Victus+ on both front and back. IP67 rated water and dust resistance. Powerful Exynos 1480 processor for fast, flawless mobile experiences. Larger Vapor Chamber for heat control.</li>
                                <li><span className="font-medium text-text">Exclusive Features</span> - Future-ready with segment best 4x OS upgrades. Defense grade security with Samsung Knox. Hassle free payments with Tap and Pay on Samsung Wallet. Seamless experience with OneUI.</li>
                            </ul>
                        ) : product.id === 15 ? (
                            // MACBOOK AIR M4 DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">SPEED OF LIGHTNESS</span> — MacBook Air with the M4 chip lets you blaze through work and play. With Apple Intelligence,* up to 18 hours of battery life,* and an incredibly portable design, you can take on anything, anywhere.</li>
                                <li><span className="font-medium text-text">SUPERCHARGED BY M4</span> — The Apple M4 chip brings even more speed and fluidity to everything you do, like working between multiple apps, editing videos or playing graphically demanding games.</li>
                                <li><span className="font-medium text-text">BUILT FOR APPLE INTELLIGENCE</span> — Apple Intelligence is the personal intelligence system that helps you write, express yourself and get things done effortlessly. With groundbreaking privacy protections, it gives you peace of mind that no one else can access your data — not even Apple.*</li>
                                <li><span className="font-medium text-text">UP TO 18 HOURS OF BATTERY LIFE</span> — MacBook Air delivers the same incredible performance whether it’s running on battery or plugged in.*</li>
                                <li><span className="font-medium text-text">A BRILLIANT DISPLAY</span> — The 34.46 cm (13.6”) Liquid Retina display supports 1 billion colours.* Photos and videos pop with rich contrast and sharp detail, and text appears super crisp.</li>
                                <li><span className="font-medium text-text">LOOK AND SOUND YOUR BEST</span> — Everything looks and sounds amazing with a 12MP Center Stage camera, three mics and four speakers with Spatial Audio.</li>
                                <li><span className="font-medium text-text">CONNECT IT ALL</span> — MacBook Air features two Thunderbolt 4 ports, a MagSafe charging port, a headphone jack, Wi-Fi 6E and Bluetooth 5.3. And it supports up to two external displays.</li>
                            </ul>
                        ) : product.id === 17 ? (
                            // HP OMEN DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">16-core 14th Gen Intel Core i7-14650HX:</span> Utilize the might of 24 threads and a 30MB L3 cache to dominate virtual battlefields. Stay cool in the heat of the action with an upgraded cooling system.</li>
                                <li><span className="font-medium text-text">8GB NVIDIA GeForce RTX 4060 Laptop GPU:</span> Unlock an immersive gaming experience with graphics that deliver AI-accelerated performance, enhanced 3D rendering, and hyper-efficient data processing.</li>
                                <li><span className="font-medium text-text">Upgraded memory and storage:</span> Experience seamless gameplay with 1TB PCIe Gen4 NVMe TLC M.2 SSD, ensuring a lag-free performance. Effortlessly handle demanding gaming applications with 16GB DDR5 RAM.</li>
                                <li><span className="font-medium text-text">Popular games:</span> Play all your favorite games like Valorant, Metro Exodus, Dirt 5, Assassin’s Creed Valhalla, Shadow of the Tomb Raider, Civilization VI, GTA 5, Gears of War 5 (Gears 5), and more.</li>
                                <li><span className="font-medium text-text">Micro-edge display:</span> Dive into the game on the 16.1-inch FHD display, featuring 300 nits, micro-edge bezel, anti-glare screen, and 144Hz refresh rate for crisp and lag-free visuals.</li>
                            </ul>
                        ) : product.id === 7 ? (
                            // LENOVO YOGA DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">AI Enabled Processor:</span> Intel Core Ultra 5 125H, 14C (4P + 8E + 2LPE) / 18T, Max Turbo up to 4.5Ghz| Cores:-14 | Threads:- 18 | Cache:- 18MB</li>
                                <li><span className="font-medium text-text">OS:</span> Pre-Loaded Windows 11 Home with Lifetime Validity | Microsoft 365 Basic + Office Home 2024 | Xbox GamePass Ultimate 3-month subscription</li>
                                <li><span className="font-medium text-text">Memory and Storage:</span> 16GB RAM LPDDR5 -6400 | 512GB SSD M.2 2242 PCIe 4.0x4 NVMe || Graphics: Integrated Intel Arc Graphics | NPU: Integrated Intel AI Boost, up to 11 TOPS</li>
                                <li><span className="font-medium text-text">Display:</span> 14" WUXGA (1920x1200) OLED | Display: 400nits Glossy | 60Hz | 100% DCI-P3 | Display HDR True Black 500 | Dolby Vision | Eyesafe</li>
                                <li><span className="font-medium text-text">Camera:</span> FHD 1080p + IR with E-shutter, ToF Sensor | Speakers:- Stereo speakers, 2W x4, optimized with Dolby Atmos, Amplifier (AMP) || Connections:- Wi-Fi 6E, 802.11ax 2x2 + BT5.3</li>
                                <li><span className="font-medium text-text">Battery:</span> 65Wh | supports Rapid Charge Boost (get 2 hours of runtime with a 15-minute charge) | Max Battery Life : MobileMark 25 at 250nits: 10.3 hr, Local video (1080p) playback at 150nits: 20.8 hr</li>
                                <li><span className="font-medium text-text">Design:</span> 1.49 cm Thin and 1.39 kg Light | Full Body Aluminium Material | Backlit Keyboard</li>
                            </ul>
                        ) : product.id === 16 ? (
                            // LENOVO LOQ DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">Processor:</span> Intel Core i5-12450HX | Speed: 2.4GHz (Base) - 4.4GHz (Max) | 8 Cores | 12 Threads | 12MB Cache</li>
                                <li><span className="font-medium text-text">Display:</span> 15.6" FHD (1920x1080) IPS Technology | 144 Hz Refresh Rate | 100pct. sRGB | Brightness: 300Nits Anti-glare || Connectivity : Wi-Fi 6, 802.11ax 2x2 | BT5.2</li>
                                <li><span className="font-medium text-text">Memory:</span> 16GB SO-DIMM DDR5-4800, Max Memory :-Up to 32GB DDR5-4800 | Storage: 512GB SSD M.2 2242 PCIe 4.0x4 NVMe</li>
                                <li><span className="font-medium text-text">Graphics:</span> NVIDIA GeForce RTX 3050 6GB GDDR6, Boost Clock 1732MHz, TGP 95W | G-Sync || Cooling: Hyperchamber thermal design is a game-changer. Dual fans spin outward, expelling heat eficiently from the rear end.</li>
                                <li><span className="font-medium text-text">AI Engine + :</span> The Lenovo AI Engine+ and Lenovo LA1 AI Chip work together with the MUX Switch with NVIDIA Advanced Optimus for a truly epic boost in performance.</li>
                            </ul>
                        ) : (
                            // GENERIC / ASUS DESCRIPTION
                            <ul className="list-disc list-outside ml-5 space-y-2 text-sm text-text-muted">
                                <li><span className="font-medium text-text">Processor:</span> Intel Core 7 Processor 240H 2.5 GHz (24MB Cache, up to 5.2 GHz, 10 cores, 16 Threads)</li>
                                <li><span className="font-medium text-text">Display:</span> FHD+ (1920 x 1200) 16:10 aspect ratio, 144Hz refresh rate, 300nits Brightness</li>
                                <li><span className="font-medium text-text">Keyboard:</span> Backlit Chiclet Keyboard with Num-key</li>
                                <li><span className="font-medium text-text">Graphics:</span> NVIDIA GeForce RTX 4050 Laptop GPU (194 AI TOPS)</li>
                                <li><span className="font-medium text-text">Software:</span> Microsoft 365 Basic with 100GB Cloud Storage for 1 Year + Office Home 2024 with lifetime validity | Operating System : Windows 11 Home</li>
                            </ul>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-gray-100 space-y-4">
                        <div className="flex gap-4">
                            <Button
                                onClick={() => addToCart(product)}
                                className="flex-1 py-4 text-lg flex items-center justify-center gap-2"
                            >
                                <ShoppingBag /> Add to Cart
                            </Button>
                            <Button
                                variant="outline"
                                className={`px-4 ${isInWishlist(product.id) ? 'bg-primary/5 border-primary text-primary' : ''}`}
                                onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
                            >
                                <Star size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

