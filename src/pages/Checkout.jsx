import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';

export const Checkout = () => {
    const { cart, cartTotal, clearCart, addOrder } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Card');

    const handlePayment = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate payment processing
        const order = {
            id: crypto.randomUUID(),
            date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
            total: cartTotal,
            items: [...cart],
            paymentMethod
        };
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            addOrder(order);
            clearCart();
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="pt-20 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-4xl">
                    ✓
                </div>
                <h1 className="text-4xl font-serif font-bold text-text">Order Confirmed!</h1>
                <p className="text-text-muted max-w-md">
                    Thank you for your purchase. We have sent a confirmation email to simulate@email.com.
                </p>
                <Button onClick={() => window.location.href = '/'}>
                    Return Home
                </Button>
            </div>
        );
    }

    if (cart.length === 0) {
        return <div className="p-20 text-center">Your cart is empty.</div>;
    }

    return (
        <div className="pt-8 pb-20 px-4 max-w-7xl mx-auto">
            <h1 className="text-3xl font-serif font-bold text-text mb-8">Checkout</h1>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Form */}
                <div>
                    <h2 className="text-xl font-medium mb-4">Shipping Information</h2>
                    <form onSubmit={handlePayment} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="First Name" required className="p-3 border rounded-md w-full" />
                            <input placeholder="Last Name" required className="p-3 border rounded-md w-full" />
                        </div>
                        <input placeholder="Email Address" type="email" required className="p-3 border rounded-md w-full" />
                        <input placeholder="Address" required className="p-3 border rounded-md w-full" />
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="City" required className="p-3 border rounded-md w-full" />
                            <input placeholder="Postal Code" required className="p-3 border rounded-md w-full" />
                        </div>

                        <h2 className="text-xl font-medium mt-6 mb-4">Payment Method</h2>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {['Card', 'UPI', 'COD'].map((method) => (
                                <button
                                    key={method}
                                    type="button"
                                    onClick={() => setPaymentMethod(method)}
                                    className={`p-3 border rounded-md text-sm font-medium transition-colors ${paymentMethod === method
                                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {method === 'COD' ? 'Cash on Delivery' : method}
                                </button>
                            ))}
                        </div>

                        {paymentMethod === 'Card' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <input placeholder="Card Number" required className="p-3 border rounded-md w-full" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="MM/YY" required className="p-3 border rounded-md w-full" />
                                    <input placeholder="CVC" required className="p-3 border rounded-md w-full" />
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'UPI' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <input placeholder="Enter VPA (e.g. user@upi)" required className="p-3 border rounded-md w-full" />
                                <p className="text-xs text-text-muted">A payment request will be sent to your UPI app.</p>
                            </div>
                        )}

                        {paymentMethod === 'COD' && (
                            <div className="p-4 bg-gray-50 rounded-md text-sm text-text-muted animate-in fade-in slide-in-from-top-2 duration-300">
                                You can pay via Cash or UPI when the product is delivered.
                            </div>
                        )}

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-full py-3 mt-6 text-lg"
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing...' : paymentMethod === 'COD' ? `Place Order` : `Pay ₹${cartTotal.toLocaleString('en-IN')}`}
                        </Button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-6 rounded-lg h-fit">
                    <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                    <div className="space-y-4 mb-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between">
                                <span className="text-text-muted">{item.name} x {item.quantity}</span>
                                <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
        </div >
    );
};
