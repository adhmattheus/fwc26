import { ClubsRankingTable } from "@/components/home/clubs-ranking-table";
import { GroupsGrid } from "@/components/home/groups-grid";
import { OverallStatistics } from "@/components/home/overall-statistics";
import { PageHeader } from "@/components/home/page-header";
import { RankingTable } from "@/components/home/ranking-table";
import { StatusLegend } from "@/components/home/status-legend";
import { clubsService } from "@/services/clubs.service";
import { groupsService } from "@/services/groups.service";
import { statisticsService } from "@/services/statistics.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [groups, overallStats, ranking, clubsRanking] = await Promise.all([
    groupsService.getAll(),
    statisticsService.getOverall(),
    statisticsService.getRanking(),
    clubsService.getRanking(),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto">
        <PageHeader />
        {overallStats && <OverallStatistics stats={overallStats} />}
        <StatusLegend />
        {groups && <GroupsGrid groups={groups} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {ranking && <RankingTable ranking={ranking} />}
          {clubsRanking && <ClubsRankingTable ranking={clubsRanking} />}
        </div>
      </div>
    </main>
  );
}
