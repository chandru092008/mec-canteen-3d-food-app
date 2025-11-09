'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import AIAssistant from '@/components/AIAssistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, Clock, Star, TrendingUp, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  isCombo: boolean;
  preparationTime: number;
  imageUrl?: string;
}

export default function HomePage() {
  const { user } = useAuth();
  const [comboOffers, setComboOffers] = useState<FoodItem[]>([]);
  const [popularItems, setPopularItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/food-items');
        const data = await res.json();
        
        if (data.success) {
          const combos = data.items.filter((item: FoodItem) => item.isCombo);
          const popular = data.items.filter((item: FoodItem) => 
            ['Biriyani', 'Dosa', 'Meals', 'Coffee'].includes(item.name)
          );
          
          setComboOffers(combos);
          setPopularItems(popular);
        }
      } catch (error) {
        console.error('Failed to fetch items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-orange-500">Order Online Now</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Welcome to MEC Food Web
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Delicious meals from your campus canteen, delivered fresh. Browse our menu, customize your order, and enjoy authentic South Indian cuisine!
            </p>
            <div className="flex gap-4">
              <Link href="/menu">
                <Button size="lg" className="gap-2">
                  <UtensilsCrossed className="h-5 w-5" />
                  Explore Menu
                </Button>
              </Link>
              {!user && (
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 p-1">
              <img
                src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=800&fit=crop"
                alt="Delicious Food"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <Star className="h-6 w-6 text-orange-600" fill="currentColor" />
                </div>
                <div>
                  <p className="font-bold text-lg">4.8/5</p>
                  <p className="text-sm text-muted-foreground">Student Rating</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-orange-500 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">40+</p>
              <p className="text-orange-100">Menu Items</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">500+</p>
              <p className="text-orange-100">Happy Students</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">15min</p>
              <p className="text-orange-100">Avg Prep Time</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">4.8★</p>
              <p className="text-orange-100">Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Combo Offers Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Combo Offers 🎉</h2>
            <p className="text-muted-foreground">Save more with our special combo deals</p>
          </div>
          <Link href="/menu">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {comboOffers.map((combo, idx) => (
              <motion.div
                key={combo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  {/* Combo Image */}
                  {combo.imageUrl && (
                    <div className="relative h-40 overflow-hidden rounded-t-lg">
                      <img
                        src={combo.imageUrl}
                        alt={combo.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  )}
                  <CardHeader>
                    <Badge className="w-fit mb-2 bg-green-500">Combo Deal</Badge>
                    <CardTitle className="text-xl">{combo.name}</CardTitle>
                    <CardDescription>{combo.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-orange-600">₹{combo.price}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {combo.preparationTime}min
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href="/menu" className="w-full">
                      <Button className="w-full gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Order Now
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Popular Items */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <h2 className="text-3xl font-bold">Popular Items</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                {/* Popular Item Image */}
                {item.imageUrl && (
                  <div className="relative h-40 overflow-hidden rounded-t-lg">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-orange-600">₹{item.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Order?
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Browse our complete menu and place your order now!
        </p>
        <Link href="/menu">
          <Button size="lg" className="gap-2">
            <UtensilsCrossed className="h-5 w-5" />
            View Full Menu
          </Button>
        </Link>
      </section>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}