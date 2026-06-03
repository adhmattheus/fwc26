import { GroupsGrid } from "@/components/home/groups-grid";
import { OverallStatistics } from "@/components/home/overall-statistics";
import { PageHeader } from "@/components/home/page-header";
import { RankingTable } from "@/components/home/ranking-table";
import { StatusLegend } from "@/components/home/status-legend";
import { groupsService } from "@/services/groups.service";
import { statisticsService } from "@/services/statistics.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [groups, overallStats, ranking] = await Promise.all([
    groupsService.getAll(),
    statisticsService.getOverall(),
    statisticsService.getRanking(),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto">
        <PageHeader />
        {overallStats && <OverallStatistics stats={overallStats} />}
        <StatusLegend />
        {groups && <GroupsGrid groups={groups} />}
        {ranking && <RankingTable ranking={ranking} />}
      </div>
    </main>
  );
}
