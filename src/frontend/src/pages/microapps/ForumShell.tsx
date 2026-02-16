import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function ForumShell() {
  const mockTopics = [
    {
      id: 1,
      title: 'Welcome to the Arkly Community Forum',
      author: 'Admin',
      replies: 24,
      views: 156,
      lastActivity: '2 hours ago',
    },
    {
      id: 2,
      title: 'How to integrate multiple micro-apps?',
      author: 'DevUser',
      replies: 12,
      views: 89,
      lastActivity: '5 hours ago',
    },
    {
      id: 3,
      title: 'Feature request: Dark mode improvements',
      author: 'Designer123',
      replies: 8,
      views: 45,
      lastActivity: '1 day ago',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/directory">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to Directory
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Community Forum</h1>
          <Button>New Topic</Button>
        </div>

        <div className="space-y-4">
          {mockTopics.map((topic) => (
            <Card key={topic.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>{topic.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{topic.title}</CardTitle>
                    <CardDescription>
                      Started by {topic.author} • {topic.lastActivity}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    <span>{topic.replies} replies</span>
                  </div>
                  <div>
                    <span>{topic.views} views</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
