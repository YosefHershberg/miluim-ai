import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function getServicePeriodsByUserId(userId: string) {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) return [];

  return prisma.servicePeriod.findMany({
    where: { userProfileId: profile.id },
    orderBy: { startDate: "desc" },
  });
}

export async function createServicePeriod(
  userId: string,
  data: Omit<Prisma.ServicePeriodCreateInput, "userProfile">
) {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) throw new Error("Profile not found");

  return prisma.servicePeriod.create({
    data: {
      ...data,
      userProfile: { connect: { id: profile.id } },
    },
  });
}

export async function createServicePeriods(
  userId: string,
  periods: Omit<Prisma.ServicePeriodCreateInput, "userProfile">[]
) {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) throw new Error("Profile not found");

  return prisma.servicePeriod.createMany({
    data: periods.map((p) => ({
      ...p,
      userProfileId: profile.id,
    })) as Prisma.ServicePeriodCreateManyInput[],
  });
}

export async function deleteServicePeriod(id: string, userId: string) {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) throw new Error("Profile not found");

  // Verify ownership
  const period = await prisma.servicePeriod.findFirst({
    where: { id, userProfileId: profile.id },
  });
  if (!period) throw new Error("Service period not found or access denied");

  return prisma.servicePeriod.delete({ where: { id } });
}

export async function getServicePeriodById(id: string) {
  return prisma.servicePeriod.findUnique({ where: { id } });
}
