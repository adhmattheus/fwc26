"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GroupResponse } from "@/services/groups.service";
import { useMemo } from "react";

interface Props {
  groups: GroupResponse[];
}

export function AlbumFilters({ groups }: Props) {
  const sorted = useMemo(
    () => [...groups].sort((a, b) => a.displayOrder - b.displayOrder),
    [groups],
  );

  const allTeams = useMemo(() => sorted.flatMap((g) => g.teams), [sorted]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="flex gap-3 mb-6">
      <Select onValueChange={(val) => scrollTo(val)}>
        <SelectTrigger className="w-48 cursor-pointer">
          <SelectValue placeholder="Go to group" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="cursor-pointer" value="fwc">FWC</SelectItem>
          <SelectItem className="cursor-pointer" value="cc">Coca-Cola</SelectItem>
          {sorted.map((g) => (
            <SelectItem className="cursor-pointer" key={g.id} value={`group-${g.name}`}>
              Group {g.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(val) => scrollTo(val)}>
        <SelectTrigger className="w-48 cursor-pointer">
          <SelectValue placeholder="Go to team" />
        </SelectTrigger>
        <SelectContent>
          {allTeams.map((team) => (
            <SelectItem className="cursor-pointer" key={team.id} value={`team-${team.id}`}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
