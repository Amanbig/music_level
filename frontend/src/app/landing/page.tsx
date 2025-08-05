'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Music, Wand2, Download, Save, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Music Level</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Create Music with
            <span className="text-blue-600"> AI Power</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Generate beautiful, unique music compositions using artificial intelligence. 
            Perfect for musicians, content creators, and music enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                <Music className="h-5 w-5 mr-2" />
                Start Creating Music
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In to Continue
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for Music Creation
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to create, save, and share your AI-generated music
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Wand2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>AI Music Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Generate unique music compositions using advanced AI algorithms. 
                  Customize instruments, style, and mood to match your vision.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Save className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Save & Organize</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Save your favorite compositions to your personal library. 
                  Add descriptions and organize your music collection.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Download className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Export & Share</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Download your music as MIDI files. Compatible with all major 
                  music production software and digital audio workstations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Amazing Music?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of creators who are already using AI to make music
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary">
              <Users className="h-5 w-5 mr-2" />
              Join Music Level Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Music className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold">Music Level</span>
          </div>
          <p className="text-gray-400">
            © 2025 Music Level. AI-powered music generation platform.
          </p>
        </div>
      </footer>
    </div>
  );
}