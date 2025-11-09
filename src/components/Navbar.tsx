'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, ShoppingCart, User, LogOut, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
            <UtensilsCrossed className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">MEC Food Web</h1>
            <p className="text-xs text-muted-foreground">Madras Engineering College</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-orange-600 transition-colors">
            Home
          </Link>
          <Link href="/menu" className="text-sm font-medium hover:text-orange-600 transition-colors">
            Menu
          </Link>
          {user?.role === 'student' && (
            <Link href="/student" className="text-sm font-medium hover:text-orange-600 transition-colors">
              My Portal
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link href="/admin" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Admin Portal
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user && user.role === 'student' && (
            <Link href="/cart">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {items.length}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {user.role === 'student' && (
                      <p className="text-xs font-medium text-orange-600">
                        Wallet: ₹{user.walletBalance}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === 'student' && (
                  <DropdownMenuItem onClick={() => router.push('/student')}>
                    My Portal
                  </DropdownMenuItem>
                )}
                {user.role === 'admin' && (
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    Admin Portal
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
