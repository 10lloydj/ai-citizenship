/**
 * Country Metadata Configuration
 *
 * Defines available countries, their status, and metadata for the UI.
 */

import { jamaicaCitizenshipByDescentRules } from "@/lib/rules/jm-cbd-v1";
import type { CountryRules } from "./types";

// ============================================================================
// Country Metadata Types
// ============================================================================

export type CountryStatus = "active" | "coming_soon" | "disabled";

export type CountryMetadata = {
  /** Country code (ISO 3166-1 alpha-2 lowercase) */
  code: string;
  /** Display name */
  name: string;
  /** Flag emoji */
  flag: string;
  /** Short description for cards */
  shortDescription: string;
  /** Current status */
  status: CountryStatus;
  /** Number of visa-free countries (for display) */
  visaFreeCountries?: number;
  /** Key benefits (for display) */
  benefits?: string[];
};

// ============================================================================
// Country Registry
// ============================================================================

/**
 * All countries in the system (active and coming soon)
 */
export const countries: CountryMetadata[] = [
  {
    code: "jm",
    name: "Jamaica",
    flag: "🇯🇲",
    shortDescription:
      "Visa-free access to 80+ countries. The right to live, work, and own property in the Caribbean.",
    status: "active",
    visaFreeCountries: 83,
    benefits: [
      "Visa-free travel to 80+ countries",
      "Right to live and work in Jamaica",
      "Property ownership rights",
      "Pass citizenship to children",
    ],
  },
  {
    code: "it",
    name: "Italy",
    flag: "🇮🇹",
    shortDescription:
      "EU citizenship. Live anywhere in Europe. Pass it down forever.",
    status: "coming_soon",
    visaFreeCountries: 188,
    benefits: [
      "Full EU citizenship",
      "Live and work in any EU country",
      "Access to EU healthcare and education",
      "No generational limit",
    ],
  },
  {
    code: "pl",
    name: "Poland",
    flag: "🇵🇱",
    shortDescription: "EU passport. Deep roots. A growing economy.",
    status: "coming_soon",
    visaFreeCountries: 182,
    benefits: [
      "Full EU citizenship",
      "Live and work in any EU country",
      "Strong economy with opportunities",
      "Rich cultural heritage",
    ],
  },
];

// ============================================================================
// Country Rules Registry
// ============================================================================

/**
 * Map of country codes to their rules
 * Only active countries have rules loaded
 */
const rulesRegistry: Record<string, CountryRules> = {
  jm: jamaicaCitizenshipByDescentRules,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get all countries
 */
export function getAllCountries(): CountryMetadata[] {
  return countries;
}

/**
 * Get only active countries
 */
export function getActiveCountries(): CountryMetadata[] {
  return countries.filter((c) => c.status === "active");
}

/**
 * Get coming soon countries
 */
export function getComingSoonCountries(): CountryMetadata[] {
  return countries.filter((c) => c.status === "coming_soon");
}

/**
 * Get country metadata by code
 */
export function getCountry(code: string): CountryMetadata | undefined {
  return countries.find((c) => c.code === code);
}

/**
 * Get country rules by code
 * Returns undefined if country doesn't exist or isn't active
 */
export function getCountryRules(code: string): CountryRules | undefined {
  const country = getCountry(code);
  if (!country || country.status !== "active") {
    return;
  }
  return rulesRegistry[code];
}

/**
 * Check if a country is active
 */
export function isCountryActive(code: string): boolean {
  const country = getCountry(code);
  return country?.status === "active";
}

/**
 * Get country name by code
 */
export function getCountryName(code: string): string {
  return getCountry(code)?.name ?? code.toUpperCase();
}

/**
 * Get country flag by code
 */
export function getCountryFlag(code: string): string {
  return getCountry(code)?.flag ?? "🌍";
}
