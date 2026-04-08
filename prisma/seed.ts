import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.account.createMany({
    data: [
      {
        username: "Notch",
        price: 149.99,
        type: "OG Name",
        hasCape: true,
        capeType: "Migrator",
        nameChanges: 0,
        description: "Original username, never changed. Comes with Migrator cape.",
        discord: "seller#0001",
      },
      {
        username: "xXDarkSlayerXx",
        price: 4.99,
        type: "Full Access",
        hasCape: false,
        capeType: "",
        nameChanges: 2,
        description: "Full access account, 2 name changes used.",
        discord: "seller#0002",
      },
      {
        username: "Frost",
        price: 59.99,
        type: "OG Name",
        hasCape: true,
        capeType: "Vanilla",
        nameChanges: 0,
        description: "Short OG name with Vanilla cape. Rare find.",
        discord: "seller#0003",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded 3 demo accounts.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
