'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Music, Wand2, Download, Save, Users, Sparkles, Play, Star, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 sticky top-0 z-50">
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
            <div className="flex space-x-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="md">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="gradient" size="md">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4 mr-2" />
            AI-Powered Music Generation
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Create Music with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              AI Magic
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Transform your musical ideas into reality with our advanced AI composer. 
            Generate beautiful, unique compositions in seconds - perfect for musicians, 
            content creators, and music enthusiasts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">10K+</div>
              <div className="text-sm text-slate-600">Songs Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">5+</div>
              <div className="text-sm text-slate-600">Instruments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">1K+</div>
              <div className="text-sm text-slate-600">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Powerful Features for Music Creation
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to create, save, and share your AI-generated music compositions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <p className="text-slate-600">
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
                <p className="text-slate-600">
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
                <p className="text-slate-600">
                  Export your music as MIDI files compatible with all major 
                  music production software and digital audio workstations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Loved by Creators Worldwide
            </h2>
            <p className="text-xl text-slate-600">
              See what our users are saying about Music Level
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <p className="text-slate-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Create Amazing Music?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of creators who are already using AI to bring their musical ideas to life
          </p>
          <Link href="/auth/signup">
            <Button size="xl" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              <Users className="h-5 w-5 mr-2" />
              Join Music Level Today
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Music Level</span>
            </div>
            <p className="text-slate-400 mb-8">
              AI-powered music generation platform for creators worldwide
            </p>
            <div className="border-t border-slate-800 pt-8">
              <p className="text-slate-500 text-sm">
                © 2025 Music Level. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}