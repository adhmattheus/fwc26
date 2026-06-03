export interface Team {
  id: string;
  name: string;
  slug: string;
  fifaCode: string;
  badgeUrl: string | null;
  colorPrimary: string;
  colorSecondary: string;
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
}
