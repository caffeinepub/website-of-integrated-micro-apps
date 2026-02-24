import { useEffect, useState } from 'react';
import { useLogActivityWithContext, useInteropContext } from '../../hooks/useInteropContext';
import { useForumTopics, useCreateTopic, useGetUserProfile } from '../../hooks/useQueries';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { UserRole } from '../../backend';

export default function ForumShell() {
  const { identity } = useInternetIdentity();
  const logActivity = useLogActivityWithContext();
  const { data: context, isLoading: contextLoading } = useInteropContext();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');

  const activeOrg = context?.activeOrg ?? null;
  const userRole = context?.userRole ?? null;
  const isAuthenticated = context?.authenticated ?? false;

  const { data: topics = [], isLoading: topicsLoading, isFetching } = useForumTopics(activeOrg);
  const createTopic = useCreateTopic();

  useEffect(() => {
    if (identity && activeOrg) {
      logActivity.mutate({
        appId: BigInt(3),
        eventType: 'app_opened',
        metadata: 'Community Forum',
      });
    }
  }, [identity, activeOrg]);

  const handleCreateTopic = async () => {
    if (!activeOrg || !newTopicTitle.trim() || !newTopicContent.trim()) return;

    try {
      await createTopic.mutateAsync({
        orgId: activeOrg,
        title: newTopicTitle.trim(),
        content: newTopicContent.trim(),
      });
      setNewTopicTitle('');
      setNewTopicContent('');
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create topic:', error);
    }
  };

  const isOwnerOrAdmin = userRole === UserRole.owner || userRole === UserRole.admin;

  if (contextLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please log in to access the Community Forum.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!activeOrg) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link to="/directory">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft size={16} className="mr-2" />
              Back to Directory
            </Button>
          </Link>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please select an organization to view the forum.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

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
          {isAuthenticated && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>New Topic</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Topic</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Input
                      placeholder="Topic title"
                      value={newTopicTitle}
                      onChange={(e) => setNewTopicTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Topic content"
                      value={newTopicContent}
                      onChange={(e) => setNewTopicContent(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>
                  <Button
                    onClick={handleCreateTopic}
                    disabled={!newTopicTitle.trim() || !newTopicContent.trim() || createTopic.isPending}
                    className="w-full"
                  >
                    {createTopic.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Topic'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="space-y-4">
          {topicsLoading && !isFetching ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : topics.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No topics yet. Start a discussion!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            topics.map((topic) => (
              <TopicCard
                key={topic.id.toString()}
                topic={topic}
                isOwnerOrAdmin={isOwnerOrAdmin}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function TopicCard({ topic, isOwnerOrAdmin }: { topic: any; isOwnerOrAdmin: boolean }) {
  const { data: authorProfile } = useGetUserProfile(topic.author.toString());
  const authorName = authorProfile?.name || topic.author.toString().slice(0, 8) + '...';
  const timeAgo = formatTimeAgo(Number(topic.timestamp) / 1_000_000);
  const replyCount = topic.replies.length;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarFallback>{authorName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{topic.title}</CardTitle>
            <CardDescription>
              Started by {authorName} • {timeAgo}
            </CardDescription>
            <p className="mt-2 text-sm text-foreground line-clamp-2">{topic.content}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span>{replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
          </div>
          {isOwnerOrAdmin && (
            <div className="ml-auto flex gap-2">
              <Button variant="ghost" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">Delete</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}
