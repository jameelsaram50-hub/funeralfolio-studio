import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TEMPLATES } from "../constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeThemeId(themeIdInput: string | null | undefined): string {
  if (!themeIdInput) return "cherry-blossoms";
  const normalized = themeIdInput.toLowerCase().trim();
  
  // 1. Direct ID match
  let match = TEMPLATES.find(t => t.id === normalized);
  if (match) return match.id;
  
  // 2. Transformed name match (replace spaces/non-alphanumeric with hyphens)
  const slugified = normalized.replace(/[^a-z0-9]+/g, '-');
  match = TEMPLATES.find(t => t.id === slugified);
  if (match) return match.id;

  // 3. Match against slugified template name
  match = TEMPLATES.find(t => t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slugified);
  if (match) return match.id;

  // 4. Case-insensitive name match
  match = TEMPLATES.find(t => t.name.toLowerCase() === normalized);
  if (match) return match.id;

  // Default fallback
  return "cherry-blossoms";
}
