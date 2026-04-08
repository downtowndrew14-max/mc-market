export type AccountType = "Full Access" | "OG Name" | "Hypixel" | "Rare Name";

export interface Account {
  id: string;
  username: string;
  price: number;
  type: string;
  hasCape: boolean;
  capeType: string;
  nameChanges: number;
  description: string;
  discord: string;
  createdAt: string | Date;
}
