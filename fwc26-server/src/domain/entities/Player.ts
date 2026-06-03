export interface Player {
  id: string;
  name: string;
  canonicalName: string;
  albumCode: string | null;
  inAlbum: boolean;
  calledUp: boolean;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
}
