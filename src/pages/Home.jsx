import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/Button';
import { products } from '../data/products';

export const Home = () => {
    // Just show first 3 items as featured
    const featuredProducts = products.slice(0, 3);

    return (
        <>
            <Hero />
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-16">

                    <h2 className="text-4xl font-serif font-bold text-text mt-3">Highly Rated Collection</h2>
                    <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link to="/shop">
                        <Button variant="outline" className="min-w-[200px] border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                            Shop More
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    );
};
