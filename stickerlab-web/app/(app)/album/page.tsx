import { AlbumAccordion } from "@/components/album/album-accordion";
import { AlbumFilters } from "@/components/album/album-filters";
import { AlbumStats } from "@/components/album/album-stats";
import { groupsService } from "@/services/groups.service";

export default async function AlbumPage() {
  const groups = await groupsService.getAll();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <AlbumStats />
        {groups && (
          <>
            <AlbumFilters groups={groups} />
            <AlbumAccordion groups={groups} />
          </>
        )}
      </div>
    </main>
  );
}
