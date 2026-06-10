import { TeamCard } from "@/components/team-card";
import type { GroupResponse } from "@/services/groups.service";

interface GroupsGridProps {
  groups: GroupResponse[];
  basePath?: string;
}

export function GroupsGrid({ groups, basePath }: GroupsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {groups.map((group) => (
        <section key={group.name} className="space-y-3">
          <h2 className="text-sm font-bold text-foreground bg-muted px-3 py-2 rounded-lg">
            Group {group.name}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {group.teams?.map((team) => (
              <TeamCard key={team.id} team={team} basePath={basePath} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
