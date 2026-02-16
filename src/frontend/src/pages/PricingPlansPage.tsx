import { useState } from 'react';
import { useGetPublishedPlans, useCreatePlan, useIsCallerAdmin } from '../hooks/useQueries';
import { useTranslation } from '../i18n';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function PricingPlansPage() {
  const { data: plans = [], isLoading } = useGetPublishedPlans();
  const { data: isAdmin } = useIsCallerAdmin();
  const createPlan = useCreatePlan();
  const { t } = useTranslation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [planCategory, setPlanCategory] = useState('');
  const [planFeatures, setPlanFeatures] = useState('');

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!planName.trim() || !planPrice) {
      toast.error('Plan name and price are required');
      return;
    }

    const features = planFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    try {
      await createPlan.mutateAsync({
        name: planName.trim(),
        description: planDescription.trim(),
        price: BigInt(planPrice),
        features,
        category: planCategory.trim() || 'general',
      });
      toast.success('Plan created successfully!');
      setDialogOpen(false);
      setPlanName('');
      setPlanDescription('');
      setPlanPrice('');
      setPlanCategory('');
      setPlanFeatures('');
    } catch (error) {
      console.error('Failed to create plan:', error);
      toast.error('Failed to create plan');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('pricing.title')}</h1>
          <p className="text-xl text-muted-foreground mb-6">{t('pricing.subtitle')}</p>
          {isAdmin && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>{t('pricing.create')}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('pricing.create')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreatePlan} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="planName">Plan Name *</Label>
                    <Input
                      id="planName"
                      value={planName}
                      onChange={(e) => setPlanName(e.target.value)}
                      placeholder="Enter plan name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planDescription">Description</Label>
                    <Textarea
                      id="planDescription"
                      value={planDescription}
                      onChange={(e) => setPlanDescription(e.target.value)}
                      placeholder="Describe the plan"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planPrice">Price (in tokens) *</Label>
                    <Input
                      id="planPrice"
                      type="number"
                      value={planPrice}
                      onChange={(e) => setPlanPrice(e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planCategory">{t('pricing.category')}</Label>
                    <Input
                      id="planCategory"
                      value={planCategory}
                      onChange={(e) => setPlanCategory(e.target.value)}
                      placeholder="general"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planFeatures">{t('pricing.features')} (one per line)</Label>
                    <Textarea
                      id="planFeatures"
                      value={planFeatures}
                      onChange={(e) => setPlanFeatures(e.target.value)}
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      rows={5}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={createPlan.isPending}>
                    {createPlan.isPending ? t('common.loading') : t('common.create')}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.id.toString()} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="flex items-baseline gap-1 mt-4">
                  <DollarSign size={24} className="text-muted-foreground" />
                  <span className="text-4xl font-bold">{plan.price.toString()}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check size={20} className="text-[oklch(0.7_0.18_140)] flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
