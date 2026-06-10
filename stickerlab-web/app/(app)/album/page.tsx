import { AlbumAccordion } from "@/components/album/album-accordion";
import { groupsService } from "@/services/groups.service";


export default async function AlbumPage() {
  const groups = await groupsService.getAll();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Album</h1>
        {groups && <AlbumAccordion groups={groups} />}
      </div>
    </main>
  );
}
