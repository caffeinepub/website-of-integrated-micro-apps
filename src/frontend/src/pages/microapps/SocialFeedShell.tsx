import { useEffect } from 'react';
import { useLogActivity, useGetCallerUserProfile } from '../../hooks/useQueries';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function SocialFeedShell() {
  const { data: userProfile } = useGetCallerUserProfile();
  const logActivity = useLogActivity();

  useEffect(() => {
    if (userProfile) {
      logActivity.mutate({
        orgId: userProfile.activeOrgId || BigInt(0),
        appId: BigInt(1),
        eventType: 'OpenApp',
        metadata: 'Social Feed',
      });
    }
  }, [userProfile]);

  const mockPosts = [
    {
      id: 1,
      author: 'Alice Johnson',
      content: 'Just launched our new decentralized app on the Internet Computer! 🚀',
      likes: 42,
      comments: 8,
    },
    {
      id: 2,
      author: 'Bob Smith',
      content: 'Loving the new features in Arkly Portal. The integration is seamless!',
      likes: 28,
      comments: 5,
    },
    {
      id: 3,
      author: 'Carol Davis',
      content: 'Who else is excited about the future of Web3? 🌐',
      likes: 67,
      comments: 12,
    },
  ];

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

        <div className="space-y-6">
          {mockPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{post.author}</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{post.content}</p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <button className="flex items-center gap-2 hover:text-[oklch(0.7_0.2_340)] transition-colors">
                    <Heart size={18} />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-[oklch(0.68_0.19_35)] transition-colors">
                    <MessageCircle size={18} />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-[oklch(0.72_0.18_60)] transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
