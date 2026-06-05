"use client";

import { PlayerAssignClubDialog } from "@/components/player/player-assign-club-dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PlayerResponse } from "@/services/teams.service";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useState } from "react";

interface PlayerCardProps {
  player: PlayerResponse;
  showCode?: boolean;
  cardClassName?: string;
  onAddClub?: (player: PlayerResponse, clubId: string) => void;
}

export function PlayerCard({
  player,
  showCode = true,
  cardClassName,
  onAddClub,
}: PlayerCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card
        className={`p-0 transition-colors ${cardClassName || "hover:bg-muted"}`}
      >
        <CardContent className="flex items-center gap-3 px-3 py-2">
          {showCode && player.albumCode && (
            <span className="text-[10px] font-mono text-muted-foreground bg-white/80 px-1.5 py-0.5 rounded border">
              {player.albumCode}
            </span>
          )}
          <span className="text-sm text-foreground flex-1">{player.name}</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-4 w-4 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                <PlusCircle className="h-4 w-4" />
                Adicionar clube
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      <PlayerAssignClubDialog
        player={player}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(p, clubId) => onAddClub?.(p, clubId)}
      />
    </>
  );
}
