import { useGetCallerUserProfile, useListOrganizations, useSaveCallerUserProfile } from '../hooks/useQueries';
import { useTranslation } from '../i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Building2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

export default function OrgSwitcher() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: organizations = [] } = useListOrganizations();
  const saveProfile = useSaveCallerUserProfile();
  const { t } = useTranslation();

  const activeOrg = organizations.find((org) => org.id === userProfile?.activeOrgId);

  const handleSelectOrg = async (orgId: bigint) => {
    if (!userProfile) return;

    try {
      await saveProfile.mutateAsync({
        ...userProfile,
        activeOrgId: orgId,
      });
      toast.success('Organization switched');
    } catch (error) {
      console.error('Failed to switch organization:', error);
      toast.error('Failed to switch organization');
    }
  };

  const handleClearOrg = async () => {
    if (!userProfile) return;

    try {
      await saveProfile.mutateAsync({
        ...userProfile,
        activeOrgId: undefined,
      });
      toast.success('Organization cleared');
    } catch (error) {
      console.error('Failed to clear organization:', error);
      toast.error('Failed to clear organization');
    }
  };

  if (organizations.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Building2 size={16} />
          <span className="hidden sm:inline">{activeOrg ? activeOrg.name : t('org.none')}</span>
          <ChevronDown size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t('org.select')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id.toString()}
            onClick={() => handleSelectOrg(org.id)}
            className={org.id === userProfile?.activeOrgId ? 'bg-accent' : ''}
          >
            {org.name}
          </DropdownMenuItem>
        ))}
        {activeOrg && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleClearOrg}>Clear Selection</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
