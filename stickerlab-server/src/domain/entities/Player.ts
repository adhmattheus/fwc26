import { Club } from "./Club";

export interface Player {
  id: string;
  name: string;
  canonicalName: string;
  albumCode: string | null;
  inAlbum: boolean;
  calledUp: boolean;
  teamId: string;
  clubId: string | null;
  club?: Club | null;
  createdAt: Date;
  updatedAt: Date;
}
