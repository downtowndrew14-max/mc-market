import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.account.createMany({
    data: [
      {
        username: "Notch",
        price: 149.99,
        currentOffer: 120,
        type: "OG",
        capes: "Migrator,Founder's",
        nameChanges: 0,
        description: "Original username, never changed. Comes with Migrator and Founder's cape. No bans.",
        discord: "seller",
      },
      {
        username: "xXDarkSlayerXx",
        price: 4.99,
        currentOffer: 0,
        type: "Low Tier",
        capes: "",
        nameChanges: 2,
        description: "No bans, fresh stats.",
        discord: "seller2",
      },
      {
        username: "Frost",
        price: 59.99,
        currentOffer: 45,
        type: "Semi-OG",
        capes: "Vanilla",
        nameChanges: 0,
        description: "Short semi-OG name with Vanilla cape. No bans.",
        discord: "seller3",
      },
      {
        username: "Steve",
        price: 229.99,
        currentOffer: 180,
        type: "OG",
        capes: "Migrator,MineCon 2012",
        nameChanges: 0,
        description: "Iconic OG name. MVP++ for 300d. Multiple rare capes.",
        discord: "seller4",
      },
    ],
    skipDuplicates: true,
  });
  console.log("Seeded demo accounts.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
