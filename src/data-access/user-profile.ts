import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function getUserProfileByUserId(userId: string) {
  return prisma.userProfile.findUnique({
    where: { userId },
    include: { servicePeriods: { orderBy: { startDate: "desc" } } },
  });
}

export async function createUserProfile(
  userId: string,
  data: Omit<Prisma.UserProfileCreateInput, "userId">
) {
  return prisma.userProfile.create({
    data: { ...data, userId },
  });
}

export async function updateUserProfile(
  userId: string,
  data: Prisma.UserProfileUpdateInput
) {
  return prisma.userProfile.update({
    where: { userId },
    data,
  });
}

export async function deleteUserProfile(userId: string) {
  return prisma.userProfile.delete({
    where: { userId },
  });
}
