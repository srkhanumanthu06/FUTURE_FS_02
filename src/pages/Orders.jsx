import { useCart } from '../context/CartContext';
import { Package, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const Orders = () => {
    const { orders } = useCart();

    if (orders.length === 0) {
        return (
            <div className="pt-20 pb-20 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Package size={40} className="text-text-muted" />
                </div>
                <h1 className="text-3xl font-serif font-bold text-text mb-2">No Orders Yet</h1>
                <p className="text-text-muted mb-8 max-w-md">
                    Looks like you haven't bought anything yet. Explore our products and start shopping!
                </p>
                <Link to="/shop">
                    <Button>Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-8 pb-20 px-4 max-w-7xl mx-auto">
            <h1 className="text-3xl font-serif font-bold text-text mb-8">My Orders</h1>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-gray-50 px-6 py-4 flex flex-wrap gap-4 items-center justify-between border-b border-gray-200">
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-xs text-text-muted uppercase font-medium">Order Placed</p>
                                    <p className="text-sm font-medium">{order.date}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-text-muted uppercase font-medium">Total</p>
                                    <p className="text-sm font-medium">₹{order.total.toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-text-muted uppercase font-medium">Ship To</p>
                                    <p className="text-sm font-medium text-primary cursor-pointer hover:underline">User</p>
                                </div>
                            </div>
                            <div className="text-sm text-text-muted">
                                Order # {order.id.slice(0, 8).toUpperCase()}
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex flex-col gap-6">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-text text-lg">{item.name}</h3>
                                            <p className="text-sm text-text-muted mb-2">{item.category}</p>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                                    Arriving Tomorrow
                                                </span>
                                                <span className="text-text-muted">Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
