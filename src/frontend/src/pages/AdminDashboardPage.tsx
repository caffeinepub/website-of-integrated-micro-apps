import { useGetDashboardMetrics, useGetActivityLogs, useIsCallerAdmin } from '../hooks/useQueries';
import { useTranslation } from '../i18n';
import RequireRole from '../components/RequireRole';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Package, DollarSign, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: metrics } = useGetDashboardMetrics();
  const { data: activityLogs = [] } = useGetActivityLogs();
  const { data: isAdmin } = useIsCallerAdmin();
  const { t } = useTranslation();

  if (!isAdmin) {
    return <RequireRole requireAdmin>{null}</RequireRole>;
  }

  const [orgCount, vendorCount, planCount, activityCount] = metrics || [
    BigInt(0),
    BigInt(0),
    BigInt(0),
    BigInt(0),
  ];

  const recentActivities = activityLogs.slice(-10).reverse();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{t('dashboard.title')}</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.organizations')}</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orgCount.toString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.vendors')}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendorCount.toString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.plans')}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{planCount.toString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.activities')}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activityCount.toString()}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Org ID</TableHead>
                  <TableHead>Metadata</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No recent activity
                    </TableCell>
                  </TableRow>
                ) : (
                  recentActivities.map((log) => (
                    <TableRow key={log.id.toString()}>
                      <TableCell className="font-medium">{log.eventType}</TableCell>
                      <TableCell>{log.orgId.toString()}</TableCell>
                      <TableCell className="max-w-xs truncate">{log.metadata}</TableCell>
                      <TableCell>{new Date(Number(log.timestamp) / 1000000).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
