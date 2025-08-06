'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authService, User } from '@/lib/auth';
import { Button } from './ui/Button';
import { Loading } from './ui/Loading';
import { ThemeToggle } from './ui/ThemeToggle';
import { Music, User as UserIcon, LogOut, Home, Sparkles, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Layout: Checking auth for pathname:', pathname);
      try {
        const currentUser = await authService.getCurrentUser();
        console.log('Layout: Current user:', currentUser);
        if (currentUser) {
          setUser(currentUser);
          console.log('Layout: User set successfully');
        } else {
          console.log('Layout: No user found, checking if should redirect');
          if (!pathname.startsWith('/auth') && !pathname.startsWith('/landing')) {
            console.log('Layout: Redirecting to login');
            router.push('/auth/login');
          }
        }
      } catch (error) {
        console.error('Layout: Auth check error:', error);
        if (!pathname.startsWith('/auth') && !pathname.startsWith('/landing')) {
          console.log('Layout: Error occurred, redirecting to login');
          router.push('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-light flex items-center justify-center">
        <Loading size="xl" text="Loading your workspace..." />
      </div>
    );
  }

  // Don't show layout for auth and landing pages
  if (pathname.startsWith('/auth') || pathname.startsWith('/landing')) {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: Home,
      active: pathname === '/dashboard'
    },
    {
      href: '/generate',
      label: 'Generate',
      icon: Sparkles,
      active: pathname === '/generate'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-sm shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Music Level
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-10 md:flex md:items-baseline md:space-x-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${item.active
                      ? 'bg-blue-100 text-blue-700 shadow-sm dark:bg-blue-900/50 dark:text-blue-300'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex md:items-center md:space-x-3">
              <ThemeToggle />
              
              <div className="flex items-center space-x-3 px-3 py-2 bg-secondary rounded-lg">
                <div className="p-1.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
                  <UserIcon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-secondary-foreground">{user.name}</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-sm">
            <div className="mobile-padding py-3 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${item.active
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-border pt-3 mt-3">
                <div className="flex items-center space-x-3 px-4 py-2 mb-2">
                  <div className="p-1.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
                    <UserIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="mobile-padding sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
};