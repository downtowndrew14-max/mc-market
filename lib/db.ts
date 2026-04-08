export interface Account {
  id: string;
  username: string;
  price: number;
  currentOffer: number;
  type: string;
  capes: string;
  nameChanges: number;
  description: string;
  discord: string;
  oguser: string;
  telegram: string;
  createdAt: string | Date;
}

export const ACCOUNT_TYPES = [
  "High Tier", "OG", "Semi-OG", "Low Tier", "Minecon", "Stats", "Caped", "Other",
];

export const ALL_CAPES = [
  "15th Anniversary", "Cherry Blossom", "Common", "Copper", "Follower's",
  "Founder's", "Home", "MCC 15th Year", "Menace", "Migrator",
  "MineCon 2011", "MineCon 2012", "MineCon 2013", "MineCon 2015", "MineCon 2016",
  "Minecraft Experience", "Mojang Office", "Pan", "Purple Heart",
  "Realms Mapmaker", "Translator", "Vanilla", "Yearn", "Zombie Horse",
];

export function getCapeList(capes: string): string[] {
  return capes ? capes.split(",").map((c) => c.trim()).filter(Boolean) : [];
}
