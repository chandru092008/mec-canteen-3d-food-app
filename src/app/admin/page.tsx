'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Users, ShoppingBag, DollarSign, TrendingUp, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  pickupCode: string;
  items: any[];
  createdAt: string;
}

export default function AdminPortal() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/orders/all');
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchOrders();
    }
  }, [user]);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus, paymentStatus: 'completed' }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Order status updated');
        fetchOrders();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => 
    order.paymentStatus === 'completed' ? sum + order.totalAmount : sum, 0
  );
  
  const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
  const completedOrders = orders.filter(o => o.orderStatus === 'completed').length;

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { variant: any; label: string } } = {
      pending: { variant: 'secondary', label: 'Pending' },
      preparing: { variant: 'default', label: 'Preparing' },
      ready: { variant: 'default', label: 'Ready' },
      completed: { variant: 'default', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Portal</h1>
            <p className="text-muted-foreground">Manage orders, menu items, and analytics</p>
          </div>
          <Button onClick={fetchOrders} disabled={refreshing} variant="outline" size="icon">
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">₹{totalRevenue}</div>
                <p className="text-xs text-muted-foreground mt-1">All time revenue</p>
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
                <p className="text-xs text-muted-foreground mt-1">All orders</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{pendingOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{completedOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">Successfully delivered</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Orders Management */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="preparing">Preparing</TabsTrigger>
            <TabsTrigger value="ready">Ready</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {['all', 'pending', 'preparing', 'ready', 'completed'].map((tab) => (
            <TabsContent key={tab} value={tab}>
              {loading ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders
                    .filter((order) => tab === 'all' || order.orderStatus === tab)
                    .map((order) => (
                      <Card key={order.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                Order #{order.pickupCode}
                                {getStatusBadge(order.orderStatus)}
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
                            <div className="text-right">
                              <p className="text-2xl font-bold text-orange-600">₹{order.totalAmount}</p>
                              <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Order Items */}
                          <div>
                            <p className="font-medium mb-2">Items:</p>
                            <div className="space-y-1">
                              {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    {item.name} x{item.quantity}
                                  </span>
                                  <span className="font-medium">₹{item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Status Update */}
                          <div className="flex items-center gap-4">
                            <label className="text-sm font-medium">Update Status:</label>
                            <Select
                              value={order.orderStatus}
                              onValueChange={(value) => handleStatusUpdate(order.id, value)}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="preparing">Preparing</SelectItem>
                                <SelectItem value="ready">Ready for Pickup</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                  {orders.filter((order) => tab === 'all' || order.orderStatus === tab).length === 0 && (
                    <Card>
                      <CardContent className="text-center py-16">
                        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-bold mb-2">No Orders</h3>
                        <p className="text-muted-foreground">No orders in this category</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
