import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function AiPromptPlaygroundShell() {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<{ prompt: string; response: string }[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const mockResponse = `This is a simulated AI response to: "${prompt}". In a real implementation, this would connect to an AI service.`;

    setHistory([...history, { prompt, response: mockResponse }]);
    setPrompt('');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/directory">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to Directory
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[oklch(0.7_0.19_280)] to-[oklch(0.68_0.17_200)] flex items-center justify-center">
            <Sparkles size={24} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold">AI Playground</h1>
        </div>

        <div className="space-y-6">
          {history.length > 0 && (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={index} className="space-y-2">
                  <Card className="bg-muted/50">
                    <CardContent className="py-4">
                      <p className="font-semibold text-sm text-muted-foreground mb-2">Your prompt:</p>
                      <p>{item.prompt}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="py-4">
                      <p className="font-semibold text-sm text-muted-foreground mb-2">AI Response:</p>
                      <p>{item.response}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Enter your prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask me anything..."
                  rows={4}
                  className="resize-none"
                />
                <Button type="submit" className="w-full gap-2" disabled={!prompt.trim()}>
                  <Send size={16} />
                  Send Prompt
                </Button>
              </form>
            </CardContent>
          </Card>

          {history.length === 0 && (
            <Card className="bg-muted/30">
              <CardContent className="py-12 text-center">
                <Sparkles size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  Start by entering a prompt above to see AI responses
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
