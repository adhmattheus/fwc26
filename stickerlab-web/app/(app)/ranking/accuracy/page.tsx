import { RankingTable } from "@/components/home/ranking-table";
import { statisticsService } from "@/services/statistics.service";


export default async function AccuracyRankingPage() {
  const ranking = await statisticsService.getRanking();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {ranking && <RankingTable ranking={ranking} />}
      </div>
    </main>
  );
}
