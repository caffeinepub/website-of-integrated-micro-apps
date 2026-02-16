import { useEffect } from 'react';
import { useLogActivity, useGetCallerUserProfile } from '../../hooks/useQueries';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function MessagingInboxShell() {
  const { data: userProfile } = useGetCallerUserProfile();
  const logActivity = useLogActivity();

  useEffect(() => {
    if (userProfile) {
      logActivity.mutate({
        orgId: userProfile.activeOrgId || BigInt(0),
        appId: BigInt(2),
        eventType: 'OpenApp',
        metadata: 'Messaging Inbox',
      });
    }
  }, [userProfile]);

  const mockThreads = [
    { id: 1, name: 'Team Alpha', lastMessage: 'Meeting at 3pm tomorrow', unread: 2 },
    { id: 2, name: 'Project Beta', lastMessage: 'Updated the design files', unread: 0 },
    { id: 3, name: 'Sarah Wilson', lastMessage: 'Thanks for the help!', unread: 1 },
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

        <h1 className="text-4xl font-bold mb-8">Messaging</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {mockThreads.map((thread) => (
                  <button
                    key={thread.id}
                    className="w-full p-4 text-left hover:bg-accent transition-colors flex items-center gap-3"
                  >
                    <Avatar>
                      <AvatarFallback>{thread.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{thread.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{thread.lastMessage}</p>
                    </div>
                    {thread.unread > 0 && (
                      <div className="w-6 h-6 rounded-full bg-[oklch(0.68_0.19_35)] text-white text-xs flex items-center justify-center">
                        {thread.unread}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Select a conversation</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <Send size={48} className="mx-auto mb-4 opacity-50" />
                <p>Choose a conversation to start messaging</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
