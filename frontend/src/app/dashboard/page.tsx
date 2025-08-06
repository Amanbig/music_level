'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { musicService, Generation } from '@/lib/music';
import { authService } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Layout } from '@/components/Layout';
import { Music, Download, Trash2, Plus, Calendar } from 'lucide-react';

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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {user?.name}! Manage your AI-generated music compositions.
            </p>
          </div>
          <Link href="/generate">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate New Music
            </Button>
          </Link>
        </div>

        {generations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No music generated yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start creating your first AI-powered music composition
              </p>
              <Link href="/generate">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Your First Song
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generations.map((generation) => (
              <Card key={generation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{generation.name}</span>
                    <Music className="h-5 w-5 text-blue-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generation.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {generation.description}
                      </p>
                    )}
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(generation.createdAt).toLocaleDateString()}
                    </div>
                    
                    {generation.instrument && (
                      <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {generation.instrument}
                      </div>
                    )}
                    
                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(generation.id, generation.name)}
                        className="flex-1"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(generation.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}