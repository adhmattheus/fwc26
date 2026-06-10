import { teamsService } from "@/services/teams.service";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AlbumTeamPage({ params }: Props) {
  const { id } = await params;
  const { team } = await teamsService.getById(id);

  const stickers = Array.from({ length: 20 }, (_, i) => ({
    code: `${team.fifaCode}-${i + 1}`,
    number: i + 1,
  }));

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">
          {team.name}
        </h1>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {stickers.map((sticker) => (
            <div
              key={sticker.code}
              className="flex flex-col items-center justify-center rounded-lg border-2 border-red-300 bg-red-100 p-3 text-center cursor-pointer select-none transition-colors hover:opacity-80"
            >
              <span className="text-xs font-bold text-red-700">{sticker.code}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
