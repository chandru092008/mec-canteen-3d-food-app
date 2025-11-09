'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Search, ShoppingCart, Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  isCombo: boolean;
  preparationTime: number;
  imageUrl?: string;
}

export default function MenuPage() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();
  const [items, setItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'BREAKFAST', 'LUNCH', 'SNACKS', 'BEVERAGES', 'DESSERT', 'COMBO OFFERS'];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/food-items');
        const data = await res.json();
        
        if (data.success) {
          setItems(data.items);
          setFilteredItems(data.items);
        }
      } catch (error) {
        console.error('Failed to fetch items:', error);
        toast.error('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    let filtered = items;

    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [searchQuery, selectedCategory, items]);

  const handleAddToCart = (item: FoodItem) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }

    if (user.role !== 'student') {
      toast.error('Only students can order food');
      return;
    }

    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.imageUrl,
    });

    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Our Menu
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore our delicious selection of South Indian cuisine
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 mb-8">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs md:text-sm">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Loading State */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Items Grid */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-2xl text-muted-foreground">No items found</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      {/* 3D Food Image */}
                      <div className="relative h-48 overflow-hidden rounded-t-lg bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <p className="text-muted-foreground">No image</p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex gap-2">
                          {item.isCombo && (
                            <Badge className="bg-green-500">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Combo
                            </Badge>
                          )}
                          {!item.isAvailable && (
                            <Badge variant="destructive">Unavailable</Badge>
                          )}
                        </div>

                        {/* Price Badge */}
                        <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-lg">
                          <p className="text-lg font-bold text-orange-600">₹{item.price}</p>
                        </div>
                      </div>

                      <CardHeader>
                        <CardTitle className="text-xl">{item.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {item.description || 'Delicious item from MEC canteen'}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{item.preparationTime} min</span>
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Button
                          className="w-full gap-2"
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.isAvailable}
                        >
                          {item.isAvailable ? (
                            <>
                              <Plus className="h-4 w-4" />
                              Add to Cart
                            </>
                          ) : (
                            'Not Available'
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}