import { ADMIN_PERMISSIONS } from "@/lib/constant";

export function isAdmin(perms: string[]) {
  return ADMIN_PERMISSIONS.some((p) => perms.includes(p));
}

export function extractResources(perms: string[]) {
  return new Set(perms.map((p) => p.split(".")[0].toUpperCase()));
}