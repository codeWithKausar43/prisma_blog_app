import { prisma } from "../lib/prisma";
import { UserRoles } from "../middlewares/auth";

async function seedAdmin() {
  try {
    const adminData = {
      name: "likhon2",
      email: "admin2@admin.com",
      role: UserRoles.ADMIN,
      password: "admin123",
      emailVerified: true,
    };
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("Admin user already exists. Skipping seeding.");
    }

    const signUpAdmin = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:4000",
        },
        body: JSON.stringify(adminData),
      },
    );

    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }

    console.log(signUpAdmin);
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
}

seedAdmin();
