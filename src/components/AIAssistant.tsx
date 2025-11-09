'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([
    { text: 'Hi! I\'m your MEC Food Assistant. Ask me about menu items, combos, or recommendations!', isBot: true },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, isBot: false }]);

    // Simple AI responses
    setTimeout(() => {
      let response = '';
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes('breakfast') || lowerInput.includes('morning')) {
        response = 'For breakfast, I recommend our Breakfast Combo (Idli + Vada + Coffee) for ₹50. We also have Dosa, Pongal, and Upma available!';
      } else if (lowerInput.includes('lunch')) {
        response = 'Try our Lunch Special (Meals + Buttermilk) for ₹70. We also have Biriyani for ₹80 and Fried Rice for ₹70!';
      } else if (lowerInput.includes('snack')) {
        response = 'Our Evening Snack Combo (Samosa + Tea) is perfect for ₹20. We also have Bajji, Bonda, and Cutlets!';
      } else if (lowerInput.includes('combo') || lowerInput.includes('offer')) {
        response = 'We have 4 great combos: Breakfast Combo (₹50), Lunch Special (₹70), Evening Snack (₹20), and Student Special Biriyani (₹90)!';
      } else if (lowerInput.includes('cheap') || lowerInput.includes('budget')) {
        response = 'Our budget-friendly items: Tea (₹10), Vadai (₹10), Vada (₹15), Samosa (₹15), and Buttermilk (₹15)!';
      } else if (lowerInput.includes('biriyani') || lowerInput.includes('biryani')) {
        response = 'Our vegetable Biriyani is ₹80 and takes 30 minutes to prepare. Or try the Student Special combo with Biriyani + Cool Drink for ₹90!';
      } else {
        response = 'We have a variety of items across Breakfast, Lunch, Snacks, Beverages, and Desserts. What are you in the mood for?';
      }

      setMessages((prev) => [...prev, { text: response, isBot: true }]);
    }, 1000);

    setInput('');
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg"
              onClick={() => setIsOpen(true)}
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Food Assistant
                </CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-80 overflow-y-auto space-y-4 mb-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          msg.isBot
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-orange-500 text-white'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about menu items..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <Button size="icon" onClick={handleSend}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
