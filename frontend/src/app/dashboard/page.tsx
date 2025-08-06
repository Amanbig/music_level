'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { musicService, Generation } from '@/lib/music';
import { authService } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { Layout } from '@/components/Layout';
import { Music, Download, Trash2, Plus, Calendar, Sparkles, TrendingUp, Clock } from 'lucide-react';

export default function DashboardPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          const userGenerations = await musicService.getUserGenerations(currentUser.userId);
          setGenerations(userGenerations);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!user || !confirm('Are you sure you want to delete this generation?')) return;

    try {
      await musicService.deleteGeneration(id, user.userId);
      setGenerations(generations.filter(g => g.id !== id));
    } catch (error) {
      console.error('Error deleting generation:', error);
    }
  };

  const handleDownload = async (id: string, name: string) => {
    try {
      const blob = await musicService.downloadGeneration(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.mid`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading generation:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loading size="lg" text="Loading your music library..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your AI-generated music compositions and create new masterpieces
            </p>
          </div>
          <Link href="/generate">
            <Button variant="gradient" size="lg" className="w-full lg:w-auto">
              <Sparkles className="h-5 w-5 mr-2" />
              Generate New Music
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Compositions</p>
                  <p className="text-3xl font-bold text-foreground">{generations.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Music className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-3xl font-bold text-foreground">
                    {generations.filter(g => {
                      const createdDate = new Date(g.createdAt);
                      const now = new Date();
                      return createdDate.getMonth() === now.getMonth() &&
                        createdDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Latest Creation</p>
                  <p className="text-lg font-semibold text-foreground">
                    {generations.length > 0
                      ? new Date(Math.max(...generations.map(g => new Date(g.createdAt).getTime()))).toLocaleDateString()
                      : 'None yet'
                    }
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Music Library */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Music Library</h2>
            {generations.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {generations.length} composition{generations.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {generations.length === 0 ? (
            <Card variant="gradient" className="text-center">
              <CardContent className="py-16">
                <div className="max-w-md mx-auto">
                  <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-6">
                    <Music className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    No music generated yet
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Start your musical journey by creating your first AI-powered composition.
                    It only takes a few seconds!
                  </p>
                  <Link href="/generate">
                    <Button variant="gradient" size="lg">
                      <Plus className="h-5 w-5 mr-2" />
                      Generate Your First Song
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generations.map((generation) => (
                <Card key={generation.id} variant="elevated" className="group hover:scale-[1.02] transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate mb-1">
                          {generation.name}
                        </CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(generation.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Music className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {generation.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {generation.description}
                        </p>
                      )}

                      {generation.instrument && (
                        <Badge variant="secondary" size="sm">
                          {generation.instrument}
                        </Badge>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(generation.id, generation.name)}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(generation.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}