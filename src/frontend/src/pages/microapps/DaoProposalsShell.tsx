import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function DaoProposalsShell() {
  const mockProposals = [
    {
      id: 1,
      title: 'Increase treasury allocation for development',
      description: 'Proposal to allocate 10% more funds to the development team',
      status: 'active',
      votesFor: 142,
      votesAgainst: 38,
    },
    {
      id: 2,
      title: 'Add new governance token utility',
      description: 'Introduce staking rewards for governance token holders',
      status: 'active',
      votesFor: 89,
      votesAgainst: 12,
    },
    {
      id: 3,
      title: 'Update community guidelines',
      description: 'Revise the community code of conduct',
      status: 'passed',
      votesFor: 201,
      votesAgainst: 15,
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

        <h1 className="text-4xl font-bold mb-8">DAO Proposals</h1>

        <div className="space-y-6">
          {mockProposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{proposal.title}</CardTitle>
                    <CardDescription className="mt-2">{proposal.description}</CardDescription>
                  </div>
                  <Badge variant={proposal.status === 'active' ? 'default' : 'secondary'}>
                    {proposal.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>For: {proposal.votesFor}</span>
                      <span>Against: {proposal.votesAgainst}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[oklch(0.7_0.18_140)]"
                        style={{
                          width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                {proposal.status === 'active' && (
                  <div className="flex gap-2">
                    <Button size="sm" className="gap-2">
                      <ThumbsUp size={16} />
                      Vote For
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                      <ThumbsDown size={16} />
                      Vote Against
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
