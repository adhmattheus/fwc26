import { GroupsGrid } from "@/components/home/groups-grid";
import { OverallStatistics } from "@/components/home/overall-statistics";
import { PageHeader } from "@/components/home/page-header";
import { StatusLegend } from "@/components/home/status-legend";
import { groupsService } from "@/services/groups.service";
import { statisticsService } from "@/services/statistics.service";


export default async function HomePage() {
  const [groups, overallStats] = await Promise.all([
    groupsService.getAll(),
    statisticsService.getOverall(),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <PageHeader />
        {overallStats && <OverallStatistics stats={overallStats} />}
        <StatusLegend />
        {groups && <GroupsGrid groups={groups} />}
      </div>
    </main>
  );
}
