
import bcrypt from "bcrypt";
import { prisma } from "./singletonPrisma.js";

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 9);
  
  await prisma.user.create({
    data: {
      email: "test@gmail.com",
      password: hashedPassword,
      role: "admin",
      contact: "9811111111",
      name: "test"
    },
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
