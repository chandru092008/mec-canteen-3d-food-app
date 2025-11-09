'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Wallet, ShoppingBag, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Order {
  id: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  pickupCode: string;
  items: any[];
  createdAt: string;
}

export default function StudentPortal() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'student') {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const res = await fetch(`/api/orders?userId=${user.id}`);
        const data = await res.json();

        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user || user.role !== 'student') {
    return null;
  }

  const activeOrders = orders.filter(
    (order) => order.orderStatus === 'pending' || order.orderStatus === 'preparing' || order.orderStatus === 'ready'
  );

  const pastOrders = orders.filter(
    (order) => order.orderStatus === 'completed' || order.orderStatus === 'cancelled'
  );

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { variant: any; label: string } } = {
      pending: { variant: 'secondary', label: 'Pending' },
      preparing: { variant: 'default', label: 'Preparing' },
      ready: { variant: 'default', label: 'Ready for Pickup' },
      completed: { variant: 'default', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (status === 'cancelled') return <XCircle className="h-5 w-5 text-red-600" />;
    return <Clock className="h-5 w-5 text-orange-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Student Portal</h1>
          <p className="text-muted-foreground">Manage your profile, orders, and wallet</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">₹{user.walletBalance}</div>
                <p className="text-xs text-muted-foreground mt-1">Available for orders</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground mt-1">All time orders</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeOrders.length}</div>
                <p className="text-xs text-muted-foreground mt-1">In progress</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Profile & Orders Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-lg font-medium mt-1">{user.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-lg font-medium mt-1">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Student ID</label>
                    <p className="text-lg font-medium mt-1">{user.studentId || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-lg font-medium mt-1">{user.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                    <p className="text-lg font-medium mt-1 capitalize">{user.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Wallet Balance</label>
                    <p className="text-lg font-bold text-orange-600 mt-1">₹{user.walletBalance}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Orders Tab */}
          <TabsContent value="active">
            {loading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                </CardContent>
              </Card>
            ) : activeOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-16">
                  <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-bold mb-2">No Active Orders</h3>
                  <p className="text-muted-foreground">You don't have any orders in progress</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {getStatusIcon(order.orderStatus)}
                              Order #{order.pickupCode}
                            </CardTitle>
                            <CardDescription>
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </CardDescription>
                          </div>
                          {getStatusBadge(order.orderStatus)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Pickup Code */}
                        {order.orderStatus === 'ready' && (
                          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
                            <p className="text-sm text-muted-foreground mb-1">Pickup Code</p>
                            <p className="text-3xl font-bold text-orange-600">{order.pickupCode}</p>
                            <p className="text-xs text-muted-foreground mt-1">Show this at the counter</p>
                          </div>
                        )}

                        {/* Order Items */}
                        <div>
                          <p className="font-medium mb-2">Items:</p>
                          <div className="space-y-2">
                            {order.items.map((item: any, itemIdx: number) => (
                              <div key={itemIdx} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {item.name} x{item.quantity}
                                </span>
                                <span className="font-medium">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Order Summary */}
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">Payment Method</p>
                            <p className="font-medium">{order.paymentMethod}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-2xl font-bold text-orange-600">₹{order.totalAmount}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value="history">
            {loading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                </CardContent>
              </Card>
            ) : pastOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-16">
                  <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-bold mb-2">No Past Orders</h3>
                  <p className="text-muted-foreground">Your order history will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastOrders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {getStatusIcon(order.orderStatus)}
                            Order #{order.pickupCode}
                          </CardTitle>
                          <CardDescription>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </CardDescription>
                        </div>
                        {getStatusBadge(order.orderStatus)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} item(s) • {order.paymentMethod}
                          </p>
                        </div>
                        <p className="text-xl font-bold">₹{order.totalAmount}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
