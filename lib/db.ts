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

// Matches the Discord server listing categories
export const ACCOUNT_TYPES = [
  "OG", "Semi-OG", "Minecon", "3 Letter",
];

export const ALL_CAPES = [
  "15th Anniversary", "Cherry Blossom", "Common", "Copper", "Follower's",
  "Founder's", "Home", "MCC 15th Year", "Menace", "Migrator",
  "MineCon 2011", "MineCon 2012", "MineCon 2013", "MineCon 2015", "MineCon 2016",
  "Minecraft Experience", "Mojang Office", "Pan", "Purple Heart",
  "Realms Mapmaker", "Translator", "Vanilla", "Yearn", "Zombie Horse",
];

// Discord server emoji IDs for cape images (back view)
export const CAPE_EMOJI_IDS: Record<string, string> = {
  "15th Anniversary":     "1490156596225904740",
  "Cherry Blossom":       "1490153285699764296",
  "Copper":               "1490156630313144451",
  "Follower's":           "1490156699254784151",
  "Founder's":            "1490156607559041055",
  "Home":                 "1490156653465702480",
  "MCC 15th Year":        "1490156675888316448",
  "Menace":               "1490156641675640943",
  "Migrator":             "1490153265588080743",
  "MineCon 2011":         "1490153218678722740",
  "MineCon 2012":         "1490153227453464599",
  "MineCon 2013":         "1490153237159084244",
  "MineCon 2015":         "1490153246499803227",
  "MineCon 2016":         "1490153256075264140",
  "Minecraft Experience": "1490156619009626186",
  "Mojang Office":        "1490156816687169689",
  "Pan":                  "1490153295594131548",
  "Purple Heart":         "1490156687359873156",
  "Realms Mapmaker":      "1490156722382442526",
  "Translator":           "1490156745698443275",
  "Vanilla":              "1490153275914322033",
  "Yearn":                "1490156664941318214",
};

export function getCapeImageUrl(capeName: string): string | null {
  const id = CAPE_EMOJI_IDS[capeName];
  return id ? `https://cdn.discordapp.com/emojis/${id}.png?size=64` : null;
}

export function getCapeList(capes: string): string[] {
  return capes ? capes.split(",").map((c) => c.trim()).filter(Boolean) : [];
}
