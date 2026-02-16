export const LOGO_OPTIONS = [
  "/logo-orbit.svg",
  "/logo-kite.svg",
  "/logo-gridwave.svg",
  "/logo-halo.svg",
];

export const SAMPLE_COMPANY_NAMES = [
  "BravaFlow AI",
  "NexoSprint",
  "AzulCore",
  "OrbeOps",
  "LumeScale",
  "PonteNova",
  "AtlasServe",
  "PulseDock",
];

export function fallbackBrandSuggestion() {
  const companyName = SAMPLE_COMPANY_NAMES[Math.floor(Math.random() * SAMPLE_COMPANY_NAMES.length)];
  const logo = LOGO_OPTIONS[Math.floor(Math.random() * LOGO_OPTIONS.length)];
  return { companyName, logo };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48);
}
