import { ClubsRankingTable } from "@/components/home/clubs-ranking-table";
import { clubsService } from "@/services/clubs.service";


export default async function ClubsRankingPage() {
  const clubsRanking = await clubsService.getRanking();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {clubsRanking && <ClubsRankingTable ranking={clubsRanking} />}
      </div>
    </main>
  );
}
