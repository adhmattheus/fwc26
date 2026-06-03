import { api } from "./api";

export interface TeamInGroup {
  id: string;
  name: string;
  slug: string;
  fifaCode: string;
  badgeUrl: string | null;
  colorPrimary: string;
  colorSecondary: string;
  comparison: {
    inAlbumAndCalledUp: number;
    onlyInAlbum: number;
    calledUpWithoutSticker: number;
  };
}

export interface GroupResponse {
  id: string;
  name: string;
  displayOrder: number;
  teams: TeamInGroup[];
  createdAt: string;
  updatedAt: string;
}

export const groupsService = {
  getAll: () => api.get<GroupResponse[]>("/groups"),
};
