import { useEffect, useState } from 'react';
import { useLogActivityWithContext, useInteropContext } from '../../hooks/useInteropContext';
import { useConversations, useAddMessage, useGetUserProfile } from '../../hooks/useQueries';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Send, Loader2, AlertCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MessagingInboxShell() {
  const { identity } = useInternetIdentity();
  const logActivity = useLogActivityWithContext();
  const { data: context, isLoading: contextLoading } = useInteropContext();
  const [selectedConversationId, setSelectedConversationId] = useState<bigint | null>(null);
  const [messageContent, setMessageContent] = useState('');

  const activeOrg = context?.activeOrg ?? null;
  const isAuthenticated = context?.authenticated ?? false;

  const { data: conversations = [], isLoading: conversationsLoading, isFetching } = useConversations(activeOrg);
  const addMessage = useAddMessage();

  useEffect(() => {
    if (identity && activeOrg) {
      logActivity.mutate({
        appId: BigInt(2),
        eventType: 'app_opened',
        metadata: 'Messaging Inbox',
      });
    }
  }, [identity, activeOrg]);

  const handleSendMessage = async () => {
    if (!selectedConversationId || !messageContent.trim() || !activeOrg) return;

    try {
      await addMessage.mutateAsync({
        conversationId: selectedConversationId,
        content: messageContent.trim(),
        orgId: activeOrg,
      });
      setMessageContent('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);

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
              Please log in to access Messaging.
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
              Please select an organization to view messages.
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

        <h1 className="text-4xl font-bold mb-8">Messaging</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {conversationsLoading && !isFetching ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <p className="text-sm">No conversations yet</p>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="divide-y">
                    {conversations.map((conversation) => (
                      <ConversationItem
                        key={conversation.id.toString()}
                        conversation={conversation}
                        isSelected={conversation.id === selectedConversationId}
                        onClick={() => setSelectedConversationId(conversation.id)}
                        currentUserPrincipal={identity?.getPrincipal().toString() || ''}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Message View */}
          <Card className="md:col-span-2">
            {selectedConversation ? (
              <>
                <CardHeader>
                  <CardTitle>
                    <ConversationTitle
                      participants={selectedConversation.participants}
                      currentUserPrincipal={identity?.getPrincipal().toString() || ''}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] mb-4 pr-4">
                    <div className="space-y-4">
                      {selectedConversation.messages.map((message, index) => (
                        <MessageBubble
                          key={index}
                          message={message}
                          isCurrentUser={message.sender.toString() === identity?.getPrincipal().toString()}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageContent.trim() || addMessage.isPending}
                    >
                      {addMessage.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send size={18} />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader>
                  <CardTitle>Select a conversation</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[500px] text-muted-foreground">
                  <div className="text-center">
                    <Send size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Choose a conversation to start messaging</p>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function ConversationItem({
  conversation,
  isSelected,
  onClick,
  currentUserPrincipal,
}: {
  conversation: any;
  isSelected: boolean;
  onClick: () => void;
  currentUserPrincipal: string;
}) {
  const otherParticipant = conversation.participants.find(
    (p: any) => p.toString() !== currentUserPrincipal
  );
  const { data: participantProfile } = useGetUserProfile(otherParticipant?.toString() || null);
  const participantName = participantProfile?.name || otherParticipant?.toString().slice(0, 8) + '...';
  const lastMessage = conversation.messages[conversation.messages.length - 1];

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 text-left hover:bg-accent transition-colors flex items-center gap-3 ${
        isSelected ? 'bg-accent' : ''
      }`}
    >
      <Avatar>
        <AvatarFallback>{participantName[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{participantName}</p>
        {lastMessage && (
          <p className="text-sm text-muted-foreground truncate">{lastMessage.content}</p>
        )}
      </div>
    </button>
  );
}

function ConversationTitle({
  participants,
  currentUserPrincipal,
}: {
  participants: any[];
  currentUserPrincipal: string;
}) {
  const otherParticipant = participants.find((p) => p.toString() !== currentUserPrincipal);
  const { data: participantProfile } = useGetUserProfile(otherParticipant?.toString() || null);
  const participantName = participantProfile?.name || otherParticipant?.toString().slice(0, 8) + '...';

  return <span>{participantName}</span>;
}

function MessageBubble({ message, isCurrentUser }: { message: any; isCurrentUser: boolean }) {
  const { data: senderProfile } = useGetUserProfile(message.sender.toString());
  const senderName = senderProfile?.name || message.sender.toString().slice(0, 8) + '...';
  const timeAgo = formatTimeAgo(Number(message.timestamp) / 1_000_000);

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-lg p-3 ${
            isCurrentUser
              ? 'bg-[oklch(0.68_0.19_35)] text-white'
              : 'bg-muted'
          }`}
        >
          {!isCurrentUser && (
            <p className="text-xs font-semibold mb-1">{senderName}</p>
          )}
          <p className="text-sm">{message.content}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1 px-1">{timeAgo}</p>
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}
