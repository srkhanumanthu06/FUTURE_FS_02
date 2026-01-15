import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/Button';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <div className="group relative bg-white rounded-lg overflow-hidden border border-transparent hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-xl">
            <Link to={`/product/${product.id}`} className="block">
                <div className="aspect-square overflow-hidden bg-gray-100 relative">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </Link>
            <div className="p-4 space-y-2">
                <p className="text-xs text-text-muted uppercase tracking-wider">{product.category}</p>
                <h3 className="text-lg font-serif font-bold text-text group-hover:text-primary transition-colors">
                    {product.name}
                </h3>
                <p className="text-primary font-medium">
                    ₹{product.price.toLocaleString('en-IN')}
                </p>

                <Button
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2 text-sm py-2 mt-4"
                    onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                    }}
                >
                    <ShoppingCart size={16} /> Add to Cart
                </Button>
            </div>
        </div>
    );
};
