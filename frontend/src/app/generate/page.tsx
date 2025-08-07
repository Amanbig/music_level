'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { musicService, GenerationRequest } from '@/lib/music';
import { authService } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Loading } from '@/components/ui/Loading';
import { Layout } from '@/components/Layout';
import { Music, Wand2, Save, Download, Sparkles, CheckCircle, ArrowRight, FileMusic } from 'lucide-react';

interface GenerateFormData extends GenerationRequest {
  saveName?: string;
  saveDescription?: string;
}

const instrumentOptions = [
  { value: 'piano', label: '🎹 Piano' },
  { value: 'guitar', label: '🎸 Guitar' },
  { value: 'violin', label: '🎻 Violin' },
  { value: 'flute', label: '🪈 Flute' },
  { value: 'drums', label: '🥁 Drums' },
  { value: 'trumpet', label: '🎺 Trumpet' },
  { value: 'saxophone', label: '🎷 Saxophone' },
  { value: 'cello', label: '🎻 Cello' },

];


export default function GeneratePage() {
  const [loading, setLoading] = useState(false);
  const [generatedMusic, setGeneratedMusic] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<GenerateFormData>({
    defaultValues: {
      instrument: 'piano'
    }
  });

  const watchedInstrument = watch('instrument');

  const onGenerate = async (data: GenerateFormData) => {
    setLoading(true);
    setError('');
    setGeneratedMusic(null);
    
    try {
      const { saveName, saveDescription, ...generateData } = data;
      const result = await musicService.generateMusic(generateData);
      // console.log('AI generation result:', result);
      setGeneratedMusic(result);
    } catch (error: any) {
      // console.error('Generation error:', error);
      setError(error.response?.data?.message || 'Failed to generate music. Please try again.');
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
        notes: generatedMusic.notes || generatedMusic || [],
        description: data.saveDescription,
        userId: user.userId,
        instrument: data.instrument
      });
      
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Save error:', error);
      setError(error.response?.data?.message || 'Failed to save music');
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

  const resetGeneration = () => {
    setGeneratedMusic(null);
    setError('');
    reset();
  };

  return (
    <Layout>
      <div className="px-4 sm:px-0 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Music Generation
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Create Your Musical Masterpiece
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into beautiful music compositions using advanced AI technology
          </p>
        </div>

        {error && (
          <Alert variant="error">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generation Form */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Wand2 className="h-6 w-6 mr-3 text-blue-600" />
                Music Generation
              </CardTitle>
              <CardDescription>
                Customize your AI music generation with these parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onGenerate)} className="space-y-6">
                <Input
                  label="Song Name"
                  placeholder="e.g., Peaceful Morning, Epic Adventure"
                  helperText="Give your composition a memorable name"
                  {...register('songName')}
                />
                
                <Select
                  label="Instrument"
                  options={instrumentOptions}
                  helperText="Choose the primary instrument for your composition"
                  {...register('instrument')}
                />
                
                <Textarea
                  label="Additional Instructions"
                  placeholder="e.g., Make it upbeat and energetic, or slow and melancholic. Add jazz influences, classical style, etc."
                  rows={4}
                  helperText="Describe the mood, style, or specific elements you want in your music"
                  {...register('extra')}
                />
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    loading={loading}
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loading size="sm" />
                        <span className="ml-2">Generating Music...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Generate Music
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Tips */}
              <div className="bg-muted rounded-lg p-4 mt-6">
                <h4 className="text-sm font-semibold text-foreground mb-3">💡 Pro Tips:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Be specific about the mood you want (happy, sad, energetic, calm)</li>
                  <li>• Mention musical styles (jazz, classical, rock, ambient)</li>
                  <li>• Describe the tempo (fast, slow, moderate)</li>
                  <li>• Add context (background music, main theme, intro)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Music className="h-6 w-6 mr-3 text-green-600" />
                Generated Music
              </CardTitle>
              <CardDescription>
                Your AI-generated composition will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-16">
                  <Loading size="lg" text="Creating your musical masterpiece..." />
                  <div className="mt-6 space-y-2">
                    <p className="text-sm text-muted-foreground">This usually takes 10-30 seconds</p>
                    <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              ) : !generatedMusic ? (
                <div className="text-center py-16">
                  <div className="p-4 bg-muted rounded-full w-fit mx-auto mb-6">
                    <FileMusic className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Ready to Generate
                  </h3>
                  <p className="text-muted-foreground">
                    Fill out the form and click "Generate Music" to create your composition
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <Alert variant="success">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <div>
                        <h3 className="font-semibold">Music Generated Successfully!</h3>
                        <p className="text-sm mt-1">Your AI-generated composition is ready to save or download.</p>
                      </div>
                    </div>
                  </Alert>
                  
                  {generatedMusic.midiData && (
                    <Button
                      variant="outline"
                      onClick={downloadMidi}
                      size="lg"
                      className="w-full"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download MIDI File
                    </Button>
                  )}
                  
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-foreground mb-4">Save to Library</h4>
                    
                    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
                      <Input
                        label="Save Name"
                        placeholder="Enter a name for this composition"
                        {...register('saveName', { required: 'Name is required to save' })}
                        error={errors.saveName?.message}
                      />
                      
                      <Textarea
                        label="Description"
                        placeholder="Add a description for this composition..."
                        rows={3}
                        helperText="Optional: Describe what makes this composition special"
                        {...register('saveDescription')}
                      />
                      
                      <div className="flex gap-3 pt-2">
                        <Button
                          type="submit"
                          loading={saving}
                          variant="gradient"
                          size="lg"
                          className="flex-1"
                        >
                          <Save className="h-5 w-5 mr-2" />
                          Save to Library
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          onClick={resetGeneration}
                        >
                          Generate New
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}