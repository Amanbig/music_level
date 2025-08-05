'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { musicService, GenerationRequest } from '@/lib/music';
import { authService } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Layout } from '@/components/Layout';
import { Music, Wand2, Save, Download } from 'lucide-react';

interface GenerateFormData extends GenerationRequest {
  saveName?: string;
  saveDescription?: string;
}

export default function GeneratePage() {
  const [loading, setLoading] = useState(false);
  const [generatedMusic, setGeneratedMusic] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<GenerateFormData>();

  const onGenerate = async (data: GenerateFormData) => {
    setLoading(true);
    
    try {
      const { saveName, saveDescription, ...generateData } = data;
      const result = await musicService.generateMusic(generateData);
      setGeneratedMusic(result);
    } catch (error: any) {
      console.error('Generation error:', error);
      alert(error.response?.data?.message || 'Failed to generate music');
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (data: GenerateFormData) => {
    if (!generatedMusic || !data.saveName) return;
    
    setSaving(true);
    
    try {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      await musicService.saveGeneration({
        name: data.saveName,
        notes: generatedMusic.notes || [],
        description: data.saveDescription,
        userId: user.$id,
        instrument: data.instrument
      });
      
      alert('Music saved successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Save error:', error);
      alert(error.response?.data?.message || 'Failed to save music');
    } finally {
      setSaving(false);
    }
  };

  const downloadMidi = () => {
    if (!generatedMusic?.midiData) return;
    
    try {
      const blob = new Blob([generatedMusic.midiData], { type: 'audio/midi' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-music.mid';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Generate Music</h1>
          <p className="mt-2 text-gray-600">
            Create AI-powered music compositions with custom parameters
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wand2 className="h-5 w-5 mr-2 text-blue-600" />
                Music Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onGenerate)} className="space-y-4">
                <Input
                  label="Song Name (Optional)"
                  placeholder="e.g., Peaceful Morning"
                  {...register('songName')}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instrument
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...register('instrument')}
                  >
                    <option value="piano">Piano</option>
                    <option value="guitar">Guitar</option>
                    <option value="violin">Violin</option>
                    <option value="flute">Flute</option>
                    <option value="drums">Drums</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Instructions (Optional)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="e.g., Make it upbeat and energetic, or slow and melancholic..."
                    {...register('extra')}
                  />
                </div>
                
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                >
                  <Music className="h-4 w-4 mr-2" />
                  Generate Music
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Music className="h-5 w-5 mr-2 text-green-600" />
                Generated Music
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!generatedMusic ? (
                <div className="text-center py-12">
                  <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Your generated music will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 mb-2">
                      Music Generated Successfully!
                    </h3>
                    <p className="text-sm text-green-700">
                      Your AI-generated music is ready. You can save it to your library or download the MIDI file.
                    </p>
                  </div>
                  
                  {generatedMusic.midiData && (
                    <Button
                      variant="outline"
                      onClick={downloadMidi}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download MIDI File
                    </Button>
                  )}
                  
                  <form onSubmit={handleSubmit(onSave)} className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-900">Save to Library</h4>
                    
                    <Input
                      label="Save Name"
                      placeholder="Enter a name for this composition"
                      {...register('saveName', { required: 'Name is required to save' })}
                      error={errors.saveName?.message}
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description (Optional)
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={2}
                        placeholder="Add a description for this composition..."
                        {...register('saveDescription')}
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      loading={saving}
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save to Library
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}