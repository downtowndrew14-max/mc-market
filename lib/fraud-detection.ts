// Fraud Detection System
// Analyzes accounts and user behavior for suspicious patterns

export interface FraudScore {
  score: number; // 0-100, higher = more suspicious
  flags: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
}

export function analyzeListing(data: {
  username: string;
  price: number;
  currentOffer: number;
  description: string;
  discord?: string;
  telegram?: string;
  oguser?: string;
  type: string;
  nameChanges: number;
}): FraudScore {
  let score = 0;
  const flags: string[] = [];

  // Price analysis
  if (data.price > 0 && data.price < 10) {
    score += 30;
    flags.push("Suspiciously low price for account type");
  }
  if (data.price > 5000) {
    score += 20;
    flags.push("Unusually high price - verify legitimacy");
  }
  if (data.currentOffer > data.price) {
    score += 40;
    flags.push("Current offer exceeds BIN price");
  }

  // Description analysis
  const suspiciousKeywords = [
    "100% safe", "guaranteed", "instant delivery", "no ban",
    "cracked", "hacked", "stolen", "cheap af", "too good"
  ];
  const descLower = data.description.toLowerCase();
  suspiciousKeywords.forEach(keyword => {
    if (descLower.includes(keyword)) {
      score += 15;
      flags.push(`Suspicious keyword: "${keyword}"`);
    }
  });

  // Contact method analysis
  const contactMethods = [data.discord, data.telegram, data.oguser].filter(Boolean).length;
  if (contactMethods === 0) {
    score += 50;
    flags.push("No contact methods provided");
  }

  // Username analysis
  if (data.username.length < 3) {
    score += 10;
    flags.push("Very short username - verify authenticity");
  }

  // Type vs price mismatch
  if (data.type === "OG" && data.price < 50) {
    score += 25;
    flags.push("OG account priced suspiciously low");
  }
  if (data.type === "Minecon" && data.price < 100) {
    score += 25;
    flags.push("Minecon account priced suspiciously low");
  }

  // Name changes
  if (data.nameChanges >= 15) {
    score += 10;
    flags.push("Maximum name changes used");
  }

  // Determine risk level
  let riskLevel: "low" | "medium" | "high" | "critical";
  if (score >= 80) riskLevel = "critical";
  else if (score >= 60) riskLevel = "high";
  else if (score >= 40) riskLevel = "medium";
  else riskLevel = "low";

  return { score, flags, riskLevel };
}
