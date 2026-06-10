export interface RefreshToken {
  id: string;
  token: string;
  expiresAt: Date;
  userId: string;
  createdAt: Date;
}
