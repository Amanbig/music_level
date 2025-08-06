'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authService, User } from '@/lib/auth';
import { Button } from './ui/Button';
import { Loading } from './ui/Loading';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 sticky top-0 z-50">
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
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <div className="flex items-center space-x-3 px-3 py-2 bg-slate-100 rounded-lg">
                <div className="p-1.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
                  <UserIcon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700">{user.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-600 hover:text-slate-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-sm">
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${item.active
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-slate-200 pt-3 mt-3">
                <div className="flex items-center space-x-3 px-4 py-2 mb-2">
                  <div className="p-1.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
                    <UserIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-slate-600 hover:text-slate-900"
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
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
};