'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Smartphone, Banknote, QrCode, Building2, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const paymentMethods = [
  { id: 'UPI', label: 'UPI / GPay', icon: Smartphone, description: 'Pay using UPI apps' },
  { id: 'Card', label: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, etc.' },
  { id: 'Cash', label: 'Cash on Pickup', icon: Banknote, description: 'Pay when collecting' },
  { id: 'QR', label: 'QR Code', icon: QrCode, description: 'Scan and pay' },
  { id: 'Bank Transfer', label: 'Bank Transfer', icon: Building2, description: 'Direct transfer' },
];

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [pickupCode, setPickupCode] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'student') {
      router.push('/');
    } else if (items.length === 0 && !orderPlaced) {
      router.push('/cart');
    }
  }, [user, items, router, orderPlaced]);

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          totalAmount: total,
          paymentMethod,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setPickupCode(data.order.pickupCode);
        setOrderPlaced(true);
        clearCart();
        toast.success('Order placed successfully!');
      } else {
        toast.error('Failed to place order');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'student') {
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900 mx-auto mb-4 flex items-center justify-center">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl">Order Placed Successfully!</CardTitle>
              <CardDescription>Your food is being prepared</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-2">Your Pickup Code</p>
                <p className="text-4xl font-bold text-orange-600">{pickupCode}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Show this code when collecting your order
                </p>
              </div>

              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Total</span>
                  <span className="font-bold">₹{total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium">{paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Time</span>
                  <span className="font-medium">15-20 minutes</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => router.push('/student')} className="flex-1">
                  View Order Status
                </Button>
                <Button onClick={() => router.push('/menu')} variant="outline" className="flex-1">
                  Order More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Method Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose how you'd like to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`flex items-center space-x-4 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                          paymentMethod === method.id
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-border hover:border-orange-300'
                        }`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <method.icon className="h-6 w-6 text-orange-600" />
                        <div className="flex-1">
                          <Label htmlFor={method.id} className="font-medium cursor-pointer">
                            {method.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span className="font-medium text-green-600">₹0</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">₹{total}</span>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By placing this order, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
