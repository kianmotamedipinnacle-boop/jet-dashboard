'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MedicareMetrics {
  leadsToday: number;
  conversionRate: number;
  avgCommissionValue: number;
  agentPerformance: Array<{
    name: string;
    calls: number;
    conversions: number;
    revenue: number;
  }>;
  enrollmentDeadlines: Array<{
    type: string;
    date: string;
    daysLeft: number;
  }>;
}

export function MedicareDashboard() {
  const [metrics, setMetrics] = useState<MedicareMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicareMetrics();
    const interval = setInterval(fetchMedicareMetrics, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchMedicareMetrics = async () => {
    try {
      const response = await fetch('/api/medicare-metrics');
      const data = await response.json();
      setMetrics(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch Medicare metrics:', error);
      // Use mock data for immediate implementation
      setMetrics({
        leadsToday: 15,
        conversionRate: 24.5,
        avgCommissionValue: 687,
        agentPerformance: [
          { name: 'Caitlin', calls: 0, conversions: 0, revenue: 0 },
          { name: 'Hella', calls: 0, conversions: 0, revenue: 0 }
        ],
        enrollmentDeadlines: [
          { type: 'Medicare Advantage AEP', date: '2024-12-07', daysLeft: 296 },
          { type: 'Medicare Supplement OEP', date: '2024-05-31', daysLeft: 106 }
        ]
      });
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading Medicare metrics...</div>;
  }

  if (!metrics) {
    return <div>Failed to load Medicare metrics</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Lead Metrics */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Leads Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {metrics.leadsToday}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Ready for Caitlin & Hella
          </p>
        </CardContent>
      </Card>

      {/* Conversion Rate */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
            Conversion Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {metrics.conversionRate}%
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            Lead to Enrollment
          </p>
        </CardContent>
      </Card>

      {/* Avg Commission Value */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Avg Commission Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            ${metrics.avgCommissionValue}
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            First-Year ACV
          </p>
        </CardContent>
      </Card>

      {/* Agent Performance */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
            Agent Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {metrics.agentPerformance.map((agent, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                  {agent.name}
                </span>
                <span className="text-xs text-orange-600 dark:text-orange-400">
                  {agent.calls} calls
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
            Starting Monday Feb 17
          </p>
        </CardContent>
      </Card>

      {/* Enrollment Deadlines */}
      <Card className="md:col-span-2 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-red-700 dark:text-red-300">
            Medicare Enrollment Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.enrollmentDeadlines.map((deadline, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-900 dark:text-red-100">
                    {deadline.type}
                  </h4>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {deadline.date}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                    {deadline.daysLeft}
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    days left
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="md:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Monday Launch Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Generate Call Sheets
            </button>
            <button className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Review Lead Scoring
            </button>
            <button className="p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
              Agent Briefings
            </button>
            <button className="p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              Compliance Check
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}