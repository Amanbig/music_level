'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Loading } from '@/components/ui/Loading';
import { Music, Wand2, Download, Save, Users, Sparkles, Play, Star, ArrowRight } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await authService.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated) {
          // Get user info but don't redirect - show landing page with different navigation
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-light flex items-center justify-center">
        <Loading size="xl" text="Loading Music Level..." />
      </div>
    );
  }

  // Show landing page for all users (authenticated and non-authenticated)
  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Music Level
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              {isAuthenticated ? (
                // Authenticated user navigation
                <>
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    Welcome, {user?.name}!
                  </span>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="md">Dashboard</Button>
                  </Link>
                  <Link href="/generate">
                    <Button variant="gradient" size="md">Generate Music</Button>
                  </Link>
                </>
              ) : (
                // Non-authenticated user navigation
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="md">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button variant="gradient" size="md">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/5 dark:to-purple-600/5"></div>
        <div className="max-w-7xl mx-auto mobile-padding sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4 mr-2" />
            AI-Powered Music Generation
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Create Music with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              AI Magic
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Transform your musical ideas into reality with our advanced AI composer.
            Generate beautiful, unique compositions in seconds - perfect for musicians,
            content creators, and music enthusiasts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              // Authenticated user CTAs
              <>
                <Link href="/generate">
                  <Button variant="gradient" size="xl" className="w-full sm:w-auto">
                    <Play className="h-5 w-5 mr-2" />
                    Generate Music Now
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    View My Library
                  </Button>
                </Link>
              </>
            ) : (
              // Non-authenticated user CTAs
              <>
                <Link href="/auth/signup">
                  <Button variant="gradient" size="xl" className="w-full sm:w-auto">
                    <Play className="h-5 w-5 mr-2" />
                    Start Creating Music
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    Sign In to Continue
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">10K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Songs Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">5+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Instruments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">1K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto mobile-padding sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Powerful Features for Music Creation
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, save, and share your AI-generated music compositions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card variant="elevated" className="text-center group hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl w-fit">
                  <Wand2 className="h-8 w-8 text-white" />
                </div>
                <CardTitle>AI Music Generation</CardTitle>
                <CardDescription>
                  Generate unique music compositions using advanced AI algorithms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Customize instruments, style, and mood to match your vision.
                  Our AI understands music theory and creates harmonious compositions.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" className="text-center group hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl w-fit">
                  <Save className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Save & Organize</CardTitle>
                <CardDescription>
                  Build your personal music library with smart organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Save your favorite compositions, add descriptions, and organize
                  your music collection with tags and categories.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" className="text-center group hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl w-fit">
                  <Download className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Export & Share</CardTitle>
                <CardDescription>
                  Download professional-quality MIDI files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Export your music as MIDI files compatible with all major
                  music production software and digital audio workstations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto mobile-padding sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Loved by Creators Worldwide
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">
              See what our users are saying about Music Level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Content Creator",
                content: "Music Level has revolutionized my content creation process. I can generate perfect background music in minutes!",
                rating: 5
              },
              {
                name: "Mike Chen",
                role: "Music Producer",
                content: "The AI understands music theory better than I expected. It's like having a creative partner that never runs out of ideas.",
                rating: 5
              },
              {
                name: "Emma Davis",
                role: "Indie Musician",
                content: "I use Music Level for inspiration and starting points. The quality of generated melodies is incredible.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} variant="elevated" className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="max-w-7xl mx-auto mobile-padding sm:px-6 lg:px-8 text-center relative">
          {isAuthenticated ? (
            // Authenticated user CTA
            <>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Create Your Next Masterpiece?
              </h2>
              <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Welcome back, {user?.name}! Continue your musical journey and create amazing compositions with AI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/generate">
                  <Button size="xl" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 dark:bg-white dark:text-blue-600 dark:hover:bg-blue-50 w-full sm:w-auto">
                    <Play className="h-5 w-5 mr-2" />
                    Generate Music Now
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                    View My Library
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            // Non-authenticated user CTA
            <>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Create Amazing Music?
              </h2>
              <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join thousands of creators who are already using AI to bring their musical ideas to life
              </p>
              <Link href="/auth/signup">
                <Button size="xl" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 dark:bg-white dark:text-blue-600 dark:hover:bg-blue-50">
                  <Users className="h-5 w-5 mr-2" />
                  Join Music Level Today
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12">
        <div className="max-w-7xl mx-auto mobile-padding sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Music Level</span>
            </div>
            <p className="text-muted-foreground mb-8">
              AI-powered music generation platform for creators worldwide
            </p>
            <div className="border-t border-border pt-8">
              <p className="text-muted-foreground text-sm">
                © 2025 Music Level. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
