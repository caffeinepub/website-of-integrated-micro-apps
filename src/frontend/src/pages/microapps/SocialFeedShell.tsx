import { useEffect, useState } from 'react';
import { useLogActivityWithContext, useInteropContext } from '../../hooks/useInteropContext';
import { useSocialPosts, useCreatePost, useGetUserProfile } from '../../hooks/useQueries';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, MessageCircle, Share2, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { UserRole } from '../../backend';

export default function SocialFeedShell() {
  const { identity } = useInternetIdentity();
  const logActivity = useLogActivityWithContext();
  const { data: context, isLoading: contextLoading } = useInteropContext();
  const [newPostContent, setNewPostContent] = useState('');

  const activeOrg = context?.activeOrg ?? null;
  const userRole = context?.userRole ?? null;
  const isAuthenticated = context?.authenticated ?? false;

  const { data: posts = [], isLoading: postsLoading, isFetching } = useSocialPosts(activeOrg);
  const createPost = useCreatePost();

  useEffect(() => {
    if (identity && activeOrg) {
      logActivity.mutate({
        appId: BigInt(1),
        eventType: 'app_opened',
        metadata: 'Social Feed',
      });
    }
  }, [identity, activeOrg]);

  const handleCreatePost = async () => {
    if (!activeOrg || !newPostContent.trim()) return;

    try {
      await createPost.mutateAsync({
        orgId: activeOrg,
        content: newPostContent.trim(),
      });
      setNewPostContent('');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const isOwnerOrAdmin = userRole === UserRole.owner || userRole === UserRole.admin;

  if (contextLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please log in to access the Social Feed.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!activeOrg) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Link to="/directory">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft size={16} className="mr-2" />
              Back to Directory
            </Button>
          </Link>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please select an organization to view the social feed.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link to="/directory">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to Directory
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8">Social Feed</h1>

        {/* Create Post Form */}
        {isAuthenticated && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <Textarea
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="mb-4 min-h-[100px]"
              />
              <Button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || createPost.isPending}
                className="w-full"
              >
                {createPost.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {postsLoading && !isFetching ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No posts yet. Be the first to share something!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id.toString()}
                post={post}
                isOwnerOrAdmin={isOwnerOrAdmin}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, isOwnerOrAdmin }: { post: any; isOwnerOrAdmin: boolean }) {
  const { data: authorProfile } = useGetUserProfile(post.author.toString());
  const authorName = authorProfile?.name || post.author.toString().slice(0, 8) + '...';
  const timeAgo = formatTimeAgo(Number(post.timestamp) / 1_000_000);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{authorName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{authorName}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <button className="flex items-center gap-2 hover:text-[oklch(0.7_0.2_340)] transition-colors">
            <Heart size={18} />
            <span>Like</span>
          </button>
          <button className="flex items-center gap-2 hover:text-[oklch(0.68_0.19_35)] transition-colors">
            <MessageCircle size={18} />
            <span>Comment</span>
          </button>
          <button className="flex items-center gap-2 hover:text-[oklch(0.72_0.18_60)] transition-colors">
            <Share2 size={18} />
            <span>Share</span>
          </button>
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
